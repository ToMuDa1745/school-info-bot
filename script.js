document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const chatbotToggler = document.querySelector('.chatbot-toggler');
    const chatbot = document.querySelector('.chatbot');
    const closeBtn = document.querySelector('.chatbot header .material-symbols-outlined');
    const sendBtn = document.querySelector('#send-btn');
    const inputField = document.querySelector('.chat-input textarea');
    const chatBox = document.querySelector('.chat-box');  // Make sure this matches the HTML class name
    const fileInput = document.querySelector('#excelFileInput'); // Corrected ID for file input

    if (!chatbotToggler || !chatbot || !closeBtn || !sendBtn || !inputField || !chatBox || !fileInput) {
        console.error('One or more elements not found in the DOM.');
        return;
    }

    let responses = [];
    let studentDataset = []; // Store the Excel data here
    let currentState = 'waitingForResponse';

    // Function to parse the uploaded Excel file
    function loadExcelData(file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            studentDataset = XLSX.utils.sheet_to_json(worksheet);
            console.log("Excel data loaded:", studentDataset);
            alert("Excel file successfully loaded!");
        };
        reader.readAsArrayBuffer(file);
    }

    // Handle file upload
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            loadExcelData(file);
        } else {
            alert("Please upload a valid Excel file.");
        }
    });

    // Toggle chatbot visibility
    chatbotToggler.addEventListener('click', () => {
        chatbot.classList.toggle('show-chatbot');
    });

    // Close chatbot
    closeBtn.addEventListener('click', () => {
        chatbot.classList.remove('show-chatbot');
    });

    // Handle message sending
    sendBtn.addEventListener('click', () => {
        let message = inputField.value.trim();
        if (message) {
            let outgoingMessage = document.createElement('li');
            outgoingMessage.classList.add('chat', 'outgoing');
            outgoingMessage.innerHTML = `<p>${message}</p>`;
            chatBox.appendChild(outgoingMessage);

            inputField.value = '';
            chatBox.scrollTop = chatBox.scrollHeight;

            setTimeout(() => {
                let botResponse = document.createElement('li');
                botResponse.classList.add('chat', 'incoming');

                let response = getBotResponse(message);
                botResponse.innerHTML = `<span class="material-symbols-outlined">smart_toy</span><p>${response}</p>`;
                chatBox.appendChild(botResponse);

                chatBox.scrollTop = chatBox.scrollHeight;
            }, 1000);
        }
    });

    // Fetch bot responses
    function getBotResponse(message) {
        console.log("User message:", message);
        message = message.trim().toLowerCase();

        if ((message === "hi" || message.includes("hello")) && currentState === 'waitingForResponse') {
            currentState = 'waitingForMenu';
            return "Hi there! 👋 Welcome to the school assistant. Please type 'menu' to see options.";
        }

        if (currentState === 'waitingForMenu' && message === "menu") {
            currentState = 'waitingForResponse';
            return `Here are the options:
            
            1️⃣ Assignments  
            2️⃣ Student Details  
            3️⃣ Fee Payment Updates  
        
            Type a number or your query.`;
        }

        if (message.includes("student details")) {
            currentState = 'waitingForStudentDetails';
            return "Please provide the center number and candidate number in this format: 'Center:12345, Candidate:67890'.";
        }

        if (currentState === 'waitingForStudentDetails') {
            let match = message.match(/center:(\d+),\s*candidate:(\d+)/i);
            if (match) {
                let centerNumber = match[1];
                let candidateNumber = match[2];
                let studentDetails = getStudentDetails(centerNumber, candidateNumber);

                currentState = 'waitingForResponse';
                return studentDetails || "No matching record found. Please check the details and try again.";
            } else {
                return "Invalid format. Please use 'Center:12345, Candidate:67890'.";
            }
        }

        return "Sorry, I didn't quite understand that. Could you rephrase?";
    }

    // Function to fetch student details from the dataset
    function getStudentDetails(centerNumber, candidateNumber) {
        let result = studentDataset.find(student =>
            student['Centre Number'] == centerNumber &&
            student['Candidate Number'] == candidateNumber
        );

        if (result) {
            return `Student Details:
            Name: ${result['Name']} ${result['Surname']}
            DOB: ${result['DOB']}
            Gender: ${result['Gender']}
            School: ${result['Centre Name']}`;
        } else {
            return null;
        }
    }
});
