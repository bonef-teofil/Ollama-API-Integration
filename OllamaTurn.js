const ollamaSelectorPanel = document.getElementsByClassName("ollama-selector")[0];
const gameBoardPanel = document.getElementsByClassName("game-container")[0];
const ollamaSelectorInput = document.getElementById("ollama-selector-input");

const ollamaSystemPrompt = `You are an AI playing with O in Tic-Tac-Toe.
Board X and O means taken.
0-8 means available.
Choose ONLY from available numbers
Response with one digit number. DO NOT INCLUDE ANY ANOTHER TEXT.`;


let conversation = [{
    role: 'system',
    content: ollamaSystemPrompt,
}];
let gameBoardNumbers;

let ollamaModel = "llama3.2";


function setLlamaModel() {
    ollamaSelectorPanel.style.display = "none";
    gameBoardPanel.style.display = "flex"
    ollamaModel = ollamaSelectorInput.value;
}

function gameBoardToString() {
    let str = "";
    for (let i = 0; i < 9; ++i) {
        if (i % 3 == 0) {
            str += "\n"
        }
        str += gameBoardNumbers[i] + " ";
    }
    return str;
}

function ollamaTurn() {
    if (!gameActive) return;

    gameBoardNumbers = [...cells].map((cell, i) => cell.textContent || i).join('');

    conversation.push({
        role: 'user',
        content: `The current board is:${gameBoardToString()}\nRESPOND ONLY WITH ONE DIGIT PRESENT IN ${gameBoardToString()}`
    });
    ollamaRequest();
}

async function ollamaRequest() {

    console.log("Request board: " + gameBoardToString());
    try {
        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: ollamaModel,
                messages: conversation,
                stream: false
            }),
        });

        if (!response.ok) {
            throw new Error(response.status);
        }

        const data = await response.json();
        checkOllamaResponse(data.message.content);
    }
    catch (error) {
        endGame("Error: " + error);
        alert("Error: " + error);
        console.error("Error:", error);
    }
}

function checkOllamaResponse(response) {

    const ollamaMove = parseInt(response);
    conversation.push({
        role: 'assistant',
        content: response
    });
    if (isNaN(ollamaMove)) {
        console.log("Invalid response from Ollama: " + response);
        conversation.push({
            role: 'user',
            content: `Error: Non-numeric response. Current board: ${gameBoardToString()}\nRESPOND ONLY WITH ONE DIGIT PRESENT IN ${gameBoardToString()}`
        });
        ollamaRequest();
        return;
    }
    if (ollamaMove < 0 || ollamaMove > 8 || cells[ollamaMove].textContent !== '') {
        console.log("Invalid position from Ollama: " + response);
        conversation.push({
            role: 'user',
            content: `Error: Invalid or occupied position. Current board: ${gameBoardToString()}\nRESPOND ONLY WITH ONE DIGIT PRESENT IN ${gameBoardToString()}`
        });
        ollamaRequest();
        return;
    }

    cells[ollamaMove].textContent = "O";
    checkWinner();
}


function ShowConversation() {
    console.log("\n----------------------");
    conversation.forEach((message) => {
        console.log(message.role + ": " + message.content);
    });
    console.log("----------------------");
}