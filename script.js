// Chatbot Toggle Logic
document.querySelector('.chatbot-toggler').addEventListener('click', () => {
    document.querySelector('.chatbot').classList.toggle('show-chatbot');
});

document.querySelector('.close-chatbot').addEventListener('click', () => {
    document.querySelector('.chatbot').classList.remove('show-chatbot');
});

// Handle Menu Options
function handleOption(option) {
    const chatBox = document.querySelector('.chat-box');

    // Add user message to chat
    const userMessage = document.createElement('li');
    userMessage.classList.add('chat', 'outgoing');
    userMessage.innerHTML = `<p>You selected: <strong>${option}</strong></p>`;
    chatBox.appendChild(userMessage);

    // Scroll to the latest message
    chatBox.scrollTop = chatBox.scrollHeight;

    // Add chatbot response to chat after a short delay
    setTimeout(() => {
        const botMessage = document.createElement('li');
        botMessage.classList.add('chat', 'incoming');
        botMessage.innerHTML = `<span class="material-symbols-outlined">smart_toy</span><p>${getBotResponse(option)}</p>`;
        chatBox.appendChild(botMessage);

        // Scroll to the latest message
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000); // 1-second delay for a more natural interaction
}

// Get Bot Response Based on Selected Option
function getBotResponse(option) {
    switch (option) {
        case 'School Info':
            return 'Our school offers quality education with experienced teachers and modern facilities. Please specify what you’d like to know more about!';
        case 'Fee Payment':
            return 'You can pay fees via bank transfer, mobile payment, or in-person. For detailed instructions, please contact the admin.';
        case 'Student Details':
            return 'Please provide the student’s ID or name to fetch their details.';
        case 'Events':
            return 'Upcoming events: Science Fair on 15th Feb, Sports Day on 20th Feb. Let us know if you want more details!';
        case 'Contact Admin':
            return 'You can contact the admin via email at admin@school.com or call us at +263-123-456-789.';
        default:
            return 'Sorry, I didn’t understand that. Please try again.';
    }
}
