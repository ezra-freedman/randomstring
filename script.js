const canvas = document.getElementById('string-canvas');
const ctx = canvas.getContext('2d');

// --- Configuration ---
const MIN_STICK_LENGTH = 30; // Minimum stick length for mobile
let STICK_LENGTH = MIN_STICK_LENGTH; // Length of a single string segment (calculated based on screen size)
const DRAG_RADIUS = 15; // How close to click to drag a point
const JOIN_THRESHOLD = 20; // How close points must be to join
const FRICTION = 0.99;
const BOUNCE = 0.9;
const MAX_SPEED = 10; // Max random drift speed
const STRING_COLOR = 'rgba(255, 255, 255, 0.7)';
const STRING_WIDTH = 1.5;
// ---------------------

let width, height;

function calculateStickLength() {
    // Scale stick length based on screen size
    // Use ~8% of the smaller dimension (width or height)
    const minDimension = Math.min(width, height);
    return Math.max(MIN_STICK_LENGTH, minDimension * 0.08);
}
let points = [];
let sticks = [];
let stringClusters = []; // To track which strings are connected
let draggedPoint = null;
let isDragging = false;
let mouse = { x: 0, y: 0, down: false };

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.oldx = x - (Math.random() - 0.5) * MAX_SPEED;
        this.oldy = y - (Math.random() - 0.5) * MAX_SPEED;
        this.pinned = false;
        this.cluster = null; // Which string cluster it belongs to
        this.isEndpoint = true; // Is it an end of a chain?
    }
}

class Stick {
    constructor(p0, p1, length) {
        this.p0 = p0;
        this.p1 = p1;
        this.length = length;
    }
}

class StringCluster {
    constructor(p0, p1, stick) {
        this.points = [p0, p1];
        this.sticks = [stick];
        p0.cluster = this;
        p1.cluster = this;
    }
}

// --- Core Simulation ---

function updatePoints() {
    for (const p of points) {
        if (p.pinned) continue;

        let vx = (p.x - p.oldx) * FRICTION;
        let vy = (p.y - p.oldy) * FRICTION;

        p.oldx = p.x;
        p.oldy = p.y;

        p.x += vx;
        p.y += vy;

        // Add a tiny random drift
        p.x += (Math.random() - 0.5) * 0.2;
        p.y += (Math.random() - 0.5) * 0.2;
    }
}

function constrainPoints() {
    for (const p of points) {
        if (p.pinned) continue;

        let vx = (p.x - p.oldx) * FRICTION;
        let vy = (p.y - p.oldy) * FRICTION;

        if (p.x > width) {
            p.x = width;
            p.oldx = p.x + vx * BOUNCE;
        } else if (p.x < 0) {
            p.x = 0;
            p.oldx = p.x + vx * BOUNCE;
        }
        if (p.y > height) {
            p.y = height;
            p.oldy = p.y + vy * BOUNCE;
        } else if (p.y < 0) {
            p.y = 0;
            p.oldy = p.y + vy * BOUNCE;
        }
    }
}

function updateSticks() {
    // Run multiple iterations to satisfy constraints
    for (let i = 0; i < 5; i++) {
        for (const s of sticks) {
            const dx = s.p1.x - s.p0.x;
            const dy = s.p1.y - s.p0.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const difference = s.length - distance;
            const percent = difference / distance / 2;
            const offsetX = dx * percent;
            const offsetY = dy * percent;

            if (!s.p0.pinned) {
                s.p0.x -= offsetX;
                s.p0.y -= offsetY;
            }
            if (!s.p1.pinned) {
                s.p1.x += offsetX;
                s.p1.y += offsetY;
            }
        }
    }
}

function checkCollisions() {
    // Check endpoints of different clusters for auto-joining
    for (let i = 0; i < stringClusters.length; i++) {
        const clusterA = stringClusters[i];
        for (let j = i + 1; j < stringClusters.length; j++) {
            const clusterB = stringClusters[j];

            for (const pA of clusterA.points) {
                if (!pA.isEndpoint) continue;

                for (const pB of clusterB.points) {
                    if (!pB.isEndpoint) continue;

                    const dx = pA.x - pB.x;
                    const dy = pA.y - pB.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < JOIN_THRESHOLD) {
                        // Join the clusters!
                        joinClusters(clusterA, pA, clusterB, pB, dist);
                        // Remove clusterB and restart check
                        stringClusters.splice(j, 1);
                        return; // Restart check as arrays were modified
                    }
                }
            }
        }
    }
}

function joinClusters(clusterA, pA, clusterB, pB, dist) {
    // Create a new stick
    const newStick = new Stick(pA, pB, dist);
    sticks.push(newStick);

    // Merge points and sticks
    clusterA.points.push(...clusterB.points);
    clusterA.sticks.push(...clusterB.sticks, newStick);

    // Update cluster reference for all points from B
    clusterB.points.forEach(p => {
        p.cluster = clusterA;
    });

    // These points are no longer endpoints of their *original* chain
    pA.isEndpoint = false;
    pB.isEndpoint = false;
}


function draw() {
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = STRING_COLOR;
    ctx.lineWidth = STRING_WIDTH;

    for (const s of sticks) {
        ctx.beginPath();
        ctx.moveTo(s.p0.x, s.p0.y);
        ctx.lineTo(s.p1.x, s.p1.y);
        ctx.stroke();
    }

    // Optional: Draw points for debugging/style
    // for (const p of points) {
    //     ctx.fillStyle = p.isEndpoint ? 'red' : 'white';
    //     ctx.beginPath();
    //     ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    //     ctx.fill();
    // }
}

function animate() {
    updatePoints();
    constrainPoints();
    updateSticks();
    checkCollisions(); // Check for auto-joins
    draw();
    requestAnimationFrame(animate);
}

// --- Event Handlers ---

function resizeHandler() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    STICK_LENGTH = calculateStickLength();
}

function getClosestPoint(x, y, maxDist) {
    let closest = null;
    let minDist = maxDist;
    for (const p of points) {
        // Only allow dragging endpoints
        if (!p.isEndpoint) continue;

        const dx = p.x - x;
        const dy = p.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) {
            minDist = dist;
            closest = p;
        }
    }
    return closest;
}

function spawnString(x, y) {
    const p0 = new Point(x, y);
    const p1 = new Point(x + (Math.random() - 0.5) * 40, y + (Math.random() - 0.5) * 40);
    const stick = new Stick(p0, p1, STICK_LENGTH);

    points.push(p0, p1);
    sticks.push(stick);

    const cluster = new StringCluster(p0, p1, stick);
    stringClusters.push(cluster);
}

canvas.addEventListener('mousedown', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.down = true;
    isDragging = false; // Reset drag flag

    // Check if we're grabbing a point
    draggedPoint = getClosestPoint(mouse.x, mouse.y, DRAG_RADIUS);
    if (draggedPoint) {
        canvas.style.cursor = 'grabbing';
        draggedPoint.pinned = true;
        draggedPoint.oldx = draggedPoint.x; // Stop momentum
        draggedPoint.oldy = draggedPoint.y;
    }
});

canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (mouse.down && draggedPoint) {
        isDragging = true;
    }

    if (draggedPoint) {
        draggedPoint.x = mouse.x;
        draggedPoint.y = mouse.y;
    }

    // Update cursor based on proximity to draggable points
    if (!mouse.down) {
        const nearPoint = getClosestPoint(mouse.x, mouse.y, DRAG_RADIUS);
        canvas.style.cursor = nearPoint ? 'grab' : 'default';
    }
});

canvas.addEventListener('mouseup', (e) => {
    mouse.down = false;

    if (draggedPoint) {
        draggedPoint.pinned = false;

        // Check for manual joining
        let joinTarget = getClosestPoint(mouse.x, mouse.y, JOIN_THRESHOLD);
        if (joinTarget && joinTarget !== draggedPoint && joinTarget.cluster !== draggedPoint.cluster) {
            // We found a point on another string to join to!
            const clusterA = draggedPoint.cluster;
            const clusterB = joinTarget.cluster;

            const dx = draggedPoint.x - joinTarget.x;
            const dy = draggedPoint.y - joinTarget.y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            joinClusters(clusterA, draggedPoint, clusterB, joinTarget, dist);

            // Remove clusterB
            const index = stringClusters.indexOf(clusterB);
            if(index > -1) {
                stringClusters.splice(index, 1);
            }
        }

        draggedPoint = null;
    } else if (!isDragging) {
        // This was a click, not a drag. Spawn a new string.
        spawnString(mouse.x, mouse.y);
        // After spawning, set cursor to default (don't immediately show grab)
        canvas.style.cursor = 'default';
    } else {
        // Update cursor after release for drag operations
        const nearPoint = getClosestPoint(mouse.x, mouse.y, DRAG_RADIUS);
        canvas.style.cursor = nearPoint ? 'grab' : 'default';
    }

    // Return focus to terminal input
    terminalInput.focus();

    isDragging = false;
});

// --- Initialization ---

window.addEventListener('resize', resizeHandler);
resizeHandler(); // Set initial size

// Spawn a few initial strings
for(let i = 0; i < 15; i++) {
    spawnString(
        Math.random() * width * 0.8 + width * 0.1,
        Math.random() * height * 0.8 + height * 0.1
    );
}

animate(); // Start the simulation

// --- Terminal Logic ---

const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const autocompleteHint = document.getElementById('autocomplete-hint');

// Command history
let commandHistory = [];
let historyIndex = -1;
let currentInput = '';

// --- Dynamic Canvas Masking for Terminal ---

function updateCanvasMask() {
    const footer = terminalOutput.closest('footer');
    const terminalGradient = document.getElementById('terminal-gradient');

    // Check if terminal has scrollable content
    if (terminalOutput.scrollHeight > terminalOutput.clientHeight) {
        terminalGradient.classList.add('show');
    } else {
        terminalGradient.classList.remove('show');
    }

    // Calculate terminal output and input heights (use visible height, not scroll height)
    const outputHeight = terminalOutput.offsetHeight;
    const inputArea = terminalInput.closest('.flex');
    const inputHeight = inputArea ? inputArea.offsetHeight : 0;

    // Total terminal height (output + input + spacing)
    const totalTerminalHeight = outputHeight + inputHeight + 20; // 20px for mb-2 + pt-3

    // Calculate the Y position where the mask should start (from bottom)
    const maskStartY = height - totalTerminalHeight - 40; // 40px for footer padding (2.5rem)

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

const commands = {
    '/help': 'Available commands:\n  /help     - Show this message\n  /contact  - Display contact information\n  /ls       - List recent blog posts\n  /spawn    - Spawn a new random string\n  /clear    - Clear the terminal output',
    '/contact': 'Email: contact@randomstring.com\nPhone: (555) 123-4567\nOffice: 123 Innovation Dr, Tech City',
    '/ls': 'No recent posts found.\n\n(This is a demo. In a real app, this would fetch data.)\n- 2025-11-10: The Future of Connected Data\n- 2025-10-22: Chaos Theory in Consulting',
    '/spawn': '',
    '/clear': ''
};

function processCommand(command) {
    const cmd = command.toLowerCase().trim();
    let output = '';

    // Echo the command (add newline before if there's existing content)
    const prefix = terminalOutput.innerHTML.length > 0 ? '\n' : '';
    terminalOutput.innerHTML += `${prefix}<span class="text-gray-400">> ${command}</span>\n`;

    if (cmd === '/clear') {
        terminalOutput.innerHTML = 'Terminal cleared.';
    } else if (cmd === '/spawn') {
        // Spawn a string at a random location
        const x = Math.random() * width * 0.8 + width * 0.1;
        const y = Math.random() * height * 0.8 + height * 0.1;
        spawnString(x, y);
        terminalOutput.innerHTML += `<span class="text-gray-300">String spawned at (${Math.round(x)}, ${Math.round(y)})</span>`;
    } else if (commands[cmd]) {
        output = commands[cmd];
        terminalOutput.innerHTML += `<span class="text-gray-300">${output}</span>`;
    } else {
        output = `Command not found: ${command}\nType /help for a list of commands.`;
        terminalOutput.innerHTML += `<span class="text-yellow-500">${output}</span>`;
    }

    // Scroll to bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
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

// Welcome message
// terminalOutput.innerHTML = 'Welcome to the randomstring console. Type /help for commands.';

// Focus the input field on page load
terminalInput.focus();
