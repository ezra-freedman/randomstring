// Terminal elements
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const autocompleteHint = document.getElementById('autocomplete-hint');

// Command history
let commandHistory = [];
let historyIndex = -1;
let currentInput = '';

// Terminal state
let currentView = 'list'; // 'list' or 'article'
let currentArticle = null;

// Available commands
const commands = {
    '/help': 'Available commands:\n  /help     - Show this message\n  /about    - Learn about randomstring\n  /contact  - Display contact information\n  /links    - Things we\'ve built, written, or find interesting\n  /spawn    - Spawn a new random string\n  /clear    - Clear the terminal output',
    '/about': '',
    '/contact': '',
    '/links': '',
    '/spawn': '',
    '/clear': ''
};

// Process terminal commands
function processCommand(command) {
    const cmd = command.toLowerCase().trim();
    let output = '';

    // Clear previous scrollback and echo the command
    terminalOutput.innerHTML = `<span class="terminal-cmd text-gray-400">> ${command}</span>\n`;

    if (cmd === '/clear') {
        terminalOutput.innerHTML = '<span class="terminal-cmd">Terminal cleared.</span>';
        currentView = 'list';
    } else if (cmd === '/spawn') {
        // Spawn a string at a random location
        const x = Math.random() * width * 0.8 + width * 0.1;
        const y = Math.random() * height * 0.8 + height * 0.1;
        spawnString(x, y);
        terminalOutput.innerHTML += `<span class="terminal-cmd text-gray-300">String spawned at (${Math.round(x)}, ${Math.round(y)})</span>`;
    } else if (cmd === '/links') {
        currentView = 'list';
        currentArticle = null;
        displayLinksList();
    } else if (cmd === '/about') {
        displayAboutInfo();
    } else if (cmd === '/contact') {
        displayContactInfo();
    } else if (cmd === '/help') {
        output = `<div class="terminal-cmd text-gray-300" style="white-space: pre;">Available commands:
  /help     - Show this message
  /about    - Learn about randomstring
  /contact  - Display contact information
  /links    - Things we've built, written, or find interesting
  /spawn    - Spawn a new random string
  /clear    - Clear the terminal output</div>`;
        terminalOutput.innerHTML += output;
    } else if (commands[cmd]) {
        output = commands[cmd];
        terminalOutput.innerHTML += `<span class="terminal-cmd text-gray-300">${output}</span>`;
    } else {
        output = `Command not found: ${command}\nType /help for a list of commands.`;
        terminalOutput.innerHTML += `<span class="terminal-cmd text-yellow-500">${output}</span>`;
    }

    // Scroll to bottom (except for articles which should start at top)
    if (currentView !== 'article') {
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
}

// Autocomplete logic
function getAutocomplete(input) {
    if (!input.startsWith('/')) return null;
    const availableCommands = Object.keys(commands);
    const matches = availableCommands.filter(cmd => cmd.startsWith(input.toLowerCase()));
    return matches.length === 1 ? matches[0] : null;
}

function updateAutocompleteHint() {
    const input = terminalInput.value;
    const match = getAutocomplete(input);

    if (match && input.length > 0) {
        // Show the completion hint
        autocompleteHint.textContent = input + match.substring(input.length);
    } else {
        autocompleteHint.textContent = '';
    }
}

// Terminal input event handlers
terminalInput.addEventListener('input', (e) => {
    // Reset history navigation when user types
    if (historyIndex !== -1) {
        historyIndex = -1;
        currentInput = '';
    }
    updateAutocompleteHint();
});

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const command = terminalInput.value;
        if (command.trim() === '') return; // Do nothing if input is empty

        // Add to history
        commandHistory.push(command);
        historyIndex = -1;
        currentInput = '';

        processCommand(command);
        terminalInput.value = '';
        autocompleteHint.textContent = '';
    } else if (e.key === 'Tab') {
        e.preventDefault();
        const match = getAutocomplete(terminalInput.value);
        if (match) {
            terminalInput.value = match;
            autocompleteHint.textContent = '';
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length === 0) return;

        // Save current input when first pressing up
        if (historyIndex === -1) {
            currentInput = terminalInput.value;
            historyIndex = commandHistory.length - 1;
        } else if (historyIndex > 0) {
            historyIndex--;
        }

        terminalInput.value = commandHistory[historyIndex];
        autocompleteHint.textContent = '';
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex === -1) return;

        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            terminalInput.value = commandHistory[historyIndex];
        } else {
            // Back to current input
            historyIndex = -1;
            terminalInput.value = currentInput;
        }
        autocompleteHint.textContent = '';
    }
});

// Navigation Link Handlers for typing effect
function triggerCommand(command) {
    // On touch devices, skip animation and just execute
    if (isTouchDevice()) {
        processCommand(command);
        commandHistory.push(command);
        historyIndex = -1;
        currentInput = '';
        return;
    }

    // Focus the input first
    terminalInput.focus();

    // Clear any existing content in the input
    terminalInput.value = '';
    autocompleteHint.textContent = '';

    // Animate typing the command
    let index = 0;
    const typingSpeed = 50; // milliseconds per character

    function typeNextChar() {
        if (index < command.length) {
            terminalInput.value += command[index];
            updateAutocompleteHint();
            index++;
            setTimeout(typeNextChar, typingSpeed);
        } else {
            // Done typing, wait a moment to show the autocomplete hint
            setTimeout(() => {
                // Clear the autocomplete hint (simulating tab completion)
                autocompleteHint.textContent = '';

                // Wait another moment before processing
                setTimeout(() => {
                    // Now process the command
                    processCommand(command);

                    // Clear the input
                    terminalInput.value = '';

                    // Add to history
                    commandHistory.push(command);
                    historyIndex = -1;
                    currentInput = '';
                }, 100);
            }, 200);
        }
    }

    typeNextChar();
}

// Wire up navigation links
document.getElementById('links-link').addEventListener('click', (e) => {
    e.preventDefault();
    triggerCommand('/links');
});

document.getElementById('about-link').addEventListener('click', (e) => {
    e.preventDefault();
    triggerCommand('/about');
});

document.getElementById('contact-link').addEventListener('click', (e) => {
    e.preventDefault();
    triggerCommand('/contact');
});

// Focus the input field on page load (skip on touch devices)
if (!isTouchDevice()) {
    terminalInput.focus();
}

// Display about information
function displayAboutInfo() {
    let output = '<div style="padding-top: 1rem;">';
    output += '<span class="terminal-cmd text-gray-400">> /about</span>\n\n';

    output += '<div class="terminal-content">';
    // Big tagline
    output += '<div class="text-white text-2xl font-bold" style="font-family: \'Inter\', sans-serif;">randomstring</div>';
    output += '<div class="display-heading text-3xl mb-4"><span class="text-cyan-400">advises</span> · <span class="text-purple-400">invests</span> · <span class="text-green-400">builds</span></div>';

    // Partners section
    output += '<div class="text-gray-300 text-xl mb-4">Partners <span class="text-white font-semibold">Eric Silberstein</span> and <span class="text-white font-semibold">Ezra Freedman</span></div>';

    // Story
    output += '<div class="text-gray-400 mb-1" style="font-size: 1.0625rem;">Co-founded <span class="text-cyan-300">TrialNetworks</span> <span class="text-gray-500">(acquired by IQVIA)</span></div>';
    output += '<div class="text-gray-400 mb-4" style="font-size: 1.0625rem;">Helped shape <span class="text-purple-300">Klaviyo</span>, joining to start the data science team and supporting the company through <span class="text-green-300">IPO</span></div>';

    // Fun fact
    output += '<div class="text-gray-400 mb-4" style="font-size: 1.0625rem;">They both started coding in BASIC on the Atari 400.</div>';
    output += '</div></div>';

    terminalOutput.innerHTML = output;
}

// Display contact information
function displayContactInfo() {
    let output = '<div style="padding-top: 1rem;">';
    output += '<span class="terminal-cmd text-gray-400">> /contact</span>\n\n';

    output += '<div class="terminal-content">';

    // Eric's contact info
    output += '<div class="mb-6">';
    output += '<div class="display-heading text-white text-2xl mb-2">Eric Silberstein</div>';
    output += '<div class="mb-1" style="font-size: 1.0625rem;"><span class="text-gray-400">Email:</span> <a href="mailto:eric@randomstring.com" class="text-blue-300 hover:text-blue-200">eric@randomstring.com</a></div>';
    output += '<div style="font-size: 1.0625rem;"><span class="text-gray-400">LinkedIn:</span> <a href="https://linkedin.com/in/ericsilberstein" class="text-purple-300 hover:text-purple-200" target="_blank">linkedin.com/in/ericsilberstein</a></div>';
    output += '</div>';

    // Ezra's contact info
    output += '<div class="mb-8">';
    output += '<div class="display-heading text-white text-2xl mb-2">Ezra Freedman</div>';
    output += '<div class="mb-1" style="font-size: 1.0625rem;"><span class="text-gray-400">Email:</span> <a href="mailto:ezra@randomstring.com" class="text-blue-300 hover:text-blue-200">ezra@randomstring.com</a></div>';
    output += '<div style="font-size: 1.0625rem;"><span class="text-gray-400">LinkedIn:</span> <a href="https://linkedin.com/in/ezrafreedman" class="text-purple-300 hover:text-purple-200" target="_blank">linkedin.com/in/ezrafreedman</a></div>';
    output += '</div>';

    output += '</div></div>';

    terminalOutput.innerHTML = output;
}

// --- Dynamic Canvas Masking for Terminal ---

function updateCanvasMask() {
    const footer = terminalOutput.closest('footer');
    const terminalGradient = document.getElementById('terminal-gradient');

    // Don't show gradient when reading articles - we want to see the full content
    if (currentView === 'article') {
        terminalGradient.classList.remove('show');
    } else {
        // Check if terminal has scrollable content (for normal terminal commands)
        if (terminalOutput.scrollHeight > terminalOutput.clientHeight) {
            terminalGradient.classList.add('show');
        } else {
            terminalGradient.classList.remove('show');
        }
    }

    // Calculate terminal output and input heights (use visible height, not scroll height)
    const outputHeight = terminalOutput.offsetHeight;
    const inputArea = terminalInput.closest('.flex');
    const inputHeight = inputArea ? inputArea.offsetHeight : 0;

    // Total terminal height (output + input + spacing)
    const totalTerminalHeight = outputHeight + inputHeight + 20; // 20px for mb-2 + pt-3

    // Calculate the Y position where the mask should start (from bottom)
    const maskStartY = height - totalTerminalHeight - 40; // Back to normal padding

    // Create a clip-path that cuts out the terminal area at the bottom
    const clipPath = `polygon(0 0, 100% 0, 100% ${maskStartY}px, 0 ${maskStartY}px)`;
    canvas.style.clipPath = clipPath;
}

// Update mask on terminal changes
const terminalObserver = new MutationObserver(updateCanvasMask);
terminalObserver.observe(terminalOutput, { childList: true, subtree: true, characterData: true });

// Update mask on resize
window.addEventListener('resize', updateCanvasMask);

// Initial mask update
updateCanvasMask();