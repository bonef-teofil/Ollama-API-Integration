
const ollamaSystemPrompt = `You are an AI playing with O in Tic-Tac-Toe.
Board X and O means taken, 0-8 means available.
Choose ONLY from available numbers
Response with one digit number. Do not include any other text.`;

const OllamaBoardPrompt = `The current board is: `;

let conversation = [{
    role: 'system',
    content: systemPrompt,
}];

async function askOllama() {
    let gameBoardNumbers = [...cells].map((cell, i) => cell.textContent || i).join('');

    conversation.push({
        role: 'user',
        content: `The current board is: ${gameBoardNumbers}. DO NOT choose a taken number.`
    });

    console.log("Request board: " + gameBoardNumbers);

    const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: "llama3",
            messages: conversation,
            stream: false
        }),
    });

    if (!response.ok) {
        endGame("Error: " + response.status);
        alert("Error: " + response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    checkOllamaResponse(data.message.content);
}

function checkOllamaResponse(response) {

    const ollamaMove = parseInt(response);
    if (isNaN(ollamaMove)) {
        console.log("Invalid response from Ollama: " + response);
        endGame("Invalid response from Ollama");
        alert("Invalid response from Ollama: " + response);
        return;
    }
    if (ollamaMove < 0 || ollamaMove > 8 || cells[ollamaMove].textContent !== '') {
        console.log("Invalid position from Ollama: " + response);
        endGame("Invalid position from Ollama: " + response);
        alert("Invalid position from Ollama: " + response);
        return;
    }
    console.log("Ollama response: " + response);

    cells[ollamaMove].textContent = "O";
    conversation.push({
        role: 'assistant',
        content: response
    });
    checkMove();
}


function ShowConversation() {
    console.log("----------------------");
    conversation.forEach((message) => {
        console.log(message.role + ": " + message.content);
    });
    console.log("----------------------");
}