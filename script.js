document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const chatbotToggler = document.querySelector('.chatbot-toggler');
    const chatbot = document.querySelector('.chatbot');
    const closeBtn = document.querySelector('.chatbot header .material-symbols-outlined');
    const sendBtn = document.querySelector('#send-btn');
    const inputField = document.querySelector('.chat-input textarea');
    const chatBox = document.querySelector('.chat-box');
    const fileInput = document.querySelector('#excelFileInput');
    const buttonContainer = document.querySelector('.button-container'); // Add this if buttons are inside a container

    if (!chatbotToggler || !chatbot || !closeBtn || !sendBtn || !inputField || !chatBox || !fileInput) {
        console.error('One or more elements not found in the DOM.');
        return;
    }

    let responses = [];
    let studentDataset = [];
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

    // Handle button clicks
    if (buttonContainer) {
        buttonContainer.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            if (button) {
                const option = button.textContent.trim();
                handleOption(option);
            }
        });
    }

    // Handle menu option selection
    function handleOption(option) {
        const outgoingMessage = document.createElement('li');
        outgoingMessage.classList.add('chat', 'outgoing');
        outgoingMessage.innerHTML = `<p>You selected: <strong>${option}</strong></p>`;
        chatBox.appendChild(outgoingMessage);
        chatBox.scrollTop = chatBox.scrollHeight;

        setTimeout(() => {
            const incomingMessage = document.createElement('li');
            incomingMessage.classList.add('chat', 'incoming');
            const response = getBotResponse(option);
            incomingMessage.innerHTML = `<span class="material-symbols-outlined">smart_toy</span><p>${response}</p>`;
            chatBox.appendChild(incomingMessage);
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 1000);
    }

    // Handle message sending
    sendBtn.addEventListener('click', () => {
        const message = inputField.value.trim();
        if (message) {
            let outgoingMessage = document.createElement('li');
            outgoingMessage.classList.add('chat', 'outgoing');
            outgoingMessage.innerHTML = `<p>${message}</p>`;
            chatBox.appendChild(outgoingMessage);

            inputField.value = '';
            chatBox.scrollTop = chatBox.scrollHeight;

            setTimeout(() => {
                const botResponse = document.createElement('li');
                botResponse.classList.add('chat', 'incoming');

                const response = getBotResponse(message);
                botResponse.innerHTML = `<span class="material-symbols-outlined">smart_toy</span><p>${response}</p>`;
                chatBox.appendChild(botResponse);

                chatBox.scrollTop = chatBox.scrollHeight;
            }, 1000);
        }
    });

    // Fetch bot responses
    function getBotResponse(option) {
        console.log("User input:", option);
        switch (option.toLowerCase()) {
            case 'school info':
                return 'Our school offers quality education with experienced teachers and modern facilities. Please specify what you’d like to know more about!';
            case 'fee payment':
                return 'You can pay fees via bank transfer, mobile payment, or in-person. For detailed instructions, please contact the admin.';
            case 'student details':
                return 'Please provide the student’s ID or name to fetch their details.';
            case 'events':
                return 'Upcoming events: Science Fair on 15th Feb, Sports Day on 20th Feb. Let us know if you want more details!';
            case 'contact admin':
                return 'You can contact the admin via email at admin@school.com or call us at +263-123-456-789.';
            default:
                return 'Sorry, I didn’t understand that. Please try again.';
        }
    }
});
