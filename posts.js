// Blog posts data - now referencing local markdown files
const blogPosts = [
  {
    "date": "2018-03-29",
    "title": "Getting Your Hands Dirty",
    "subtitle": "Don't read this before a meal. Or after.",
    "author": "Eric Silberstein",
    "readTime": "3 min read",
    "file": "medium_posts/2018-03-29-Getting-Your-Hands-Dirty.md"
  },
  {
    "date": "2018-03-22",
    "title": "Stale Docs",
    "subtitle": "Documentation and tutorials are an important part of your customers' experience. Give them the attention they deserve.",
    "author": "Ezra Freedman",
    "readTime": "4 min read",
    "file": "medium_posts/2018-03-22-Stale-Docs.md"
  },
  {
    "date": "2018-03-21",
    "title": "When Eric Met Steve, Jackie and Ed",
    "subtitle": "Why you need visionary customers",
    "author": "Eric Silberstein",
    "readTime": "7 min read",
    "file": "medium_posts/2018-03-21-When-Eric-Met-Steve,-Jackie-and-Ed.md"
  },
  {
    "date": "2018-03-14",
    "title": "Devs that Curl",
    "subtitle": "See you at the rink, eh?",
    "author": "Ezra Freedman",
    "readTime": "2 min read",
    "file": "medium_posts/2018-03-14-Devs-that-Curl.md"
  },
  {
    "date": "2018-03-13",
    "title": "Book Review: Designing Data-Intensive Applications",
    "subtitle": "Four things I love about Martin Kleppmann's book",
    "author": "Eric Silberstein",
    "readTime": "3 min read",
    "file": "medium_posts/2018-03-13-Book-Review-Designing-Data-Intensive-Applications.md"
  },
  {
    "date": "2018-03-08",
    "title": "Coding Under the Influence",
    "subtitle": "Can you build a dev team without alcohol?",
    "author": "Ezra Freedman",
    "readTime": "4 min read",
    "file": "medium_posts/2018-03-08-Coding-Under-the-Influence.md"
  },
  {
    "date": "2018-03-07",
    "title": "When to pivot",
    "subtitle": "Why we decided to change strategy nine months into our startup",
    "author": "Eric Silberstein",
    "readTime": "5 min read",
    "file": "medium_posts/2018-03-07-When-to-pivot.md"
  },
  {
    "date": "2018-03-01",
    "title": "How we temporarily made it to first place in our first Kaggle competition",
    "subtitle": "Late last year Ezra and I decided to survey some of the exciting technology developments that we couldn't focus on.",
    "author": "Eric Silberstein",
    "readTime": "5 min read",
    "file": "medium_posts/2018-03-01-How-we-temporarily-made-it-to-first-place-in-our-first-Kaggle-competition.md"
  },
  {
    "date": "2018-03-01",
    "title": "We came, we saw, we did a coding exercise",
    "subtitle": "How a seemingly simple coding exercise can reveal a lot about an engineering candidate",
    "author": "Ezra Freedman",
    "readTime": "3 min read",
    "file": "medium_posts/2018-03-01-We-came,-we-saw,-we-did-a-coding-exercise.md"
  },
  {
    "date": "2018-03-01",
    "title": "If nobody tells you you're winning, you're losing",
    "subtitle": "The most helpful sales advice I've ever received",
    "author": "Eric Silberstein",
    "readTime": "3 min read",
    "file": "medium_posts/2018-03-01-If-nobody-tells-you-you're-winning,-you're-losing.md"
  }
];

// Load and display an article
async function loadArticle(postIndex) {
    const post = blogPosts[postIndex];
    if (!post) return;

    try {
        const response = await fetch(post.file);
        const markdown = await response.text();

        currentView = 'article';
        currentArticle = postIndex;

        const date = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        let articleOutput = `<span class="text-cyan-400">▸ ${date}</span>\n`;
        articleOutput += `<span class="text-white font-bold text-xl">${post.title}</span>\n`;
        articleOutput += `<span class="text-gray-400">${post.subtitle}</span>\n`;
        articleOutput += `<span class="text-green-400">by ${post.author}</span> <span class="text-gray-500">· ${post.readTime}</span>\n\n`;
        articleOutput += `<span class="text-gray-500">─────────────────────────────────────</span>\n\n`;

        const content = markdownToTerminal(markdown);
        articleOutput += `<span class="text-gray-300">${content}</span>\n\n`;
        articleOutput += `<span class="text-gray-500">─────────────────────────────────────</span>\n`;
        articleOutput += `<span class="text-yellow-400"><a href="#" id="back-link" class="text-blue-400 hover:text-blue-300 underline cursor-pointer">[Back to posts]</a> or type /back</span>`;

        terminalOutput.innerHTML = articleOutput;
        terminalOutput.scrollTop = 0; // Scroll to top for article reading

        // Add click handler for the back link
        setTimeout(() => {
            const backLink = document.getElementById('back-link');
            if (backLink) {
                backLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    processCommand('/back');
                });
            }
        }, 100);

        // Update the canvas mask to hide the gradient overlay for articles
        updateCanvasMask();

        // Refocus the terminal input so cursor blinks and user can type commands
        terminalInput.focus();

    } catch (error) {
        terminalOutput.innerHTML = `<span class="text-red-400">Error loading article: ${error.message}</span>`;
    }
}

// Display blog list with clickable links
function displayBlogList() {
    let postsOutput = '<div style="line-height: 1.7;">';
    blogPosts.slice(0, 6).forEach((post, index) => {
        const date = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        // Alternate colors for visual interest
        const dateColor = index % 3 === 0 ? 'text-cyan-400' : index % 3 === 1 ? 'text-blue-400' : 'text-purple-400';
        const titleColor = 'text-white font-bold';
        const subtitleColor = 'text-gray-500 opacity-70';
        const authorColor = index % 2 === 0 ? 'text-green-400 opacity-60' : 'text-yellow-400 opacity-60';

        postsOutput += `<div style="margin-bottom: 3rem;">`;
        postsOutput += `<span class="${dateColor}">▸ ${date}</span>\n`;
        postsOutput += `<div class="article-link cursor-pointer group" data-article="${index}" style="display: inline-block;">`;
        postsOutput += `<span class="${titleColor} group-hover:text-blue-300 transition-colors">${post.title}</span>\n`;
        if (post.subtitle) {
            postsOutput += `<span class="${subtitleColor} group-hover:text-gray-400 transition-colors">${post.subtitle}</span>`;
        }
        postsOutput += `</div>\n`;
        postsOutput += `<span class="${authorColor}">by ${post.author}</span> <span class="text-gray-600 opacity-50">· ${post.readTime}</span>`;
        postsOutput += `</div>`;
    });
    postsOutput += '</div>';

    terminalOutput.innerHTML += postsOutput;

    // Add click handlers for article links
    setTimeout(() => {
        document.querySelectorAll('.article-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const articleIndex = parseInt(e.currentTarget.dataset.article);
                loadArticle(articleIndex);
            });
        });
    }, 100);

    // Update canvas mask for blog list view
    updateCanvasMask();
}