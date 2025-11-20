// Configure marked for terminal-friendly output
marked.setOptions({
    breaks: true,
    gfm: true
});

// Custom renderer for terminal styling
const terminalRenderer = new marked.Renderer();

terminalRenderer.heading = function(text, level) {
    const classes = {
        1: 'text-cyan-300 font-bold text-xl border-b border-gray-700 pb-1',
        2: 'text-blue-300 font-semibold text-lg',
        3: 'text-purple-300 font-medium text-base',
        4: 'text-green-300 font-medium text-sm',
        5: 'text-yellow-300 text-sm',
        6: 'text-gray-400 text-sm'
    };
    return `<h${level} class="${classes[level] || classes[6]} mb-1 mt-2">${text}</h${level}>`;
};

terminalRenderer.paragraph = function(text) {
    return `<p class="text-gray-300 mb-1 leading-snug">${text}</p>`;
};

terminalRenderer.image = function(href, title, text) {
    const titleText = title ? ` title="${title}"` : '';
    const altText = text || '';
    return `<img src="${href}" alt="${altText}"${titleText} class="max-w-full h-auto rounded my-2 block" style="max-height: 300px;">`;
};

terminalRenderer.strong = function(text) {
    return `<strong class="font-bold text-white">${text}</strong>`;
};

terminalRenderer.em = function(text) {
    return `<em class="italic text-yellow-300">${text}</em>`;
};

terminalRenderer.code = function(code) {
    return `<code class="bg-gray-800 text-green-400 px-1 rounded font-mono text-sm border border-gray-600">${code}</code>`;
};

terminalRenderer.codespan = function(code) {
    return `<code class="bg-gray-800 text-green-400 px-1 rounded font-mono text-sm border border-gray-600">${code}</code>`;
};

terminalRenderer.blockquote = function(quote) {
    return `<blockquote class="border-l-4 border-cyan-500 bg-gray-900 pl-3 py-1 my-1 text-cyan-200 italic rounded-r">${quote}</blockquote>`;
};

terminalRenderer.link = function(href, title, text) {
    const titleAttr = title ? ` title="${title}"` : '';
    return `<a href="${href}"${titleAttr} class="text-blue-400 hover:text-blue-300 underline decoration-dotted underline-offset-2">${text}</a>`;
};

terminalRenderer.list = function(body, ordered) {
    const tag = ordered ? 'ol' : 'ul';
    const classes = ordered ? 'list-decimal list-inside' : 'list-disc list-inside';
    return `<${tag} class="${classes} text-gray-300 mb-1 ml-2">${body}</${tag}>`;
};

terminalRenderer.listitem = function(text) {
    return `<li class="mb-0">${text}</li>`;
};

// Markdown to terminal-styled HTML converter
function markdownToTerminal(markdown) {
    // Remove YAML front matter
    const content = markdown.replace(/^---[\s\S]*?---\n/, '');

    // Parse with marked using our custom renderer
    return marked.parse(content, { renderer: terminalRenderer });
}