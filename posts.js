// Links data - things we've built, written, or find interesting
const links = [
  {
    "title": "Klaviyo Subject Line Generator",
    "description": "We rolled this out to beta customers in late 2021 and saw immediate use and stickiness. It was powered by GPT-3 and was one of the first generative AI features in any software product out there.",
    "url": "https://help.klaviyo.com/hc/en-us/articles/5051278887835",
    "author": "Eric & Ezra"
  },
  {
    "title": "Simon Willison's Blog",
    "description": "One of the best blogs for keeping current on AI for coding. Willison was one of the creators of Django.",
    "url": "https://simonwillison.net/",
    "author": "Ezra"
  },
  {
    "title": "IQVIA Investigator Site Portal",
    "description": "Under a whole bunch of marketing you can still see a few screenshots from our original TrialNetworks product. Has been used on thousands of clinical trials.",
    "url": "https://www.iqvia.com/solutions/technologies/site-suite/investigator-site-portal",
    "author": "Eric & Ezra"
  },
  {
    "title": "WorldServer",
    "description": "The world's first Globalization Management System. Many others have been created but WorldServer is still in use by localization professionals and translators.",
    "url": "https://docs.rws.com/en-US/publications/worldserver?release=worldserver-11.8",
    "author": "Eric"
  },
  {
    "title": "Tracing the Transformer in Diagrams",
    "description": "Transformer is the 'T' in GPT and was invented by Google in 2017. In this blog post I traced exactly what you put in and what you get out with a tiny example so you can see all the numbers.",
    "url": "https://towardsdatascience.com/tracing-the-transformer-in-diagrams-95dbeb68160c/",
    "author": "Eric"
  },
  {
    "title": "Learn Nanochat",
    "description": "In October 2025 Andrej Karpathy released Nanochat, \"The best ChatGPT that $100 can buy.\" This repo contains 120 (and counting) jupyter notebooks I used to learn every line of what Karpathy created.",
    "url": "https://github.com/ericsilberstein1/learn-nanochat",
    "author": "Eric"
  },
  {
    "title": "GPT-4 for Coding: 16 Observations and Tips",
    "description": "In early 2023, just as people realized that GPT-4 could write code, I tried it out and recorded my chat transcript and observations. This is a reminder of how shocking it was not all that long ago.",
    "url": "https://klaviyo.tech/gpt-4-for-coding-16-observations-and-tips-40d5b9a6a061",
    "author": "Eric"
  },
  {
    "title": "App Tracking Transparency and eCommerce Ads",
    "description": "A few years ago the thing everyone in online advertising was talking about was how Apple's ATT had made ads less effective. This post was me trying to understand what ATT was all about at a technical level.",
    "url": "https://klaviyo.tech/app-tracking-transparency-and-ecommerce-ads-4af3139a3916",
    "author": "Ezra"
  },
  {
    "title": "Trying out DALL·E 2",
    "description": "Image generation has come a long way. We got early access to OpenAI DALL·E 2 and this post has a bunch of generated images and thoughts from April 2022. Similar to the coding stuff in early 2023, we forget just how shocking it was that a computer could do this.",
    "url": "https://klaviyo.tech/trying-out-dall-e-2-657fecb60923",
    "author": "Eric"
  },
  {
    "title": "Novels",
    "description": "Link to my author site with info on my two novels: The Insecure Mind of Sergei Kraev and In Berlin.",
    "url": "https://ericsilberstein.com/",
    "author": "Eric"
  },
  {
    "title": "How we temporarily made it to first place in our first Kaggle competition",
    "description": "",
    "url": "https://medium.com/random-string/how-we-temporarily-made-it-to-first-place-in-our-first-kaggle-competition-c43338d0c067",
    "author": "Eric & Ezra"
  },
  {
    "title": "Two Truths and a Lie at Klaviyo",
    "description": "",
    "url": "https://klaviyo.tech/two-truths-and-a-lie-at-klaviyo-513903c8abac",
    "author": "Eric & Ezra"
  },
  {
    "title": "When to pivot",
    "description": "One of the hardest things in entrepreneurship or really any aspect of life is knowing when to stay the course and when to pivot. Here's why we pivoted and renamed our startup nine months in.",
    "url": "https://medium.com/random-string/when-to-pivot-2afe48367a05",
    "author": "Eric"
  }
];

// Display links list
function displayLinksList() {
    // Replace terminal content entirely with padded container
    let output = '<div style="line-height: 1.7; padding-top: 2rem;">';
    output += '<span class="text-gray-400">> /links</span>\n\n';
    output += '<span class="text-white font-bold text-lg">Things we\'ve built, written, or find interesting.</span>\n\n';

    links.forEach((link, index) => {
        // Styling
        const descColor = 'text-gray-300';
        const authorColors = {
            'Eric': 'text-green-400 opacity-70',
            'Ezra': 'text-blue-400 opacity-70',
            'Eric & Ezra': 'text-purple-400 opacity-70'
        };
        const authorColor = authorColors[link.author] || 'text-gray-400 opacity-70';

        output += `<div style="margin-bottom: 2.5rem;">`;

        if (link.url) {
            output += `<a href="${link.url}" target="_blank" class="font-bold text-cyan-400 visited:text-purple-400 hover:text-cyan-300 transition-colors underline">${link.title}</a>`;
        } else {
            output += `<span class="text-white font-bold">${link.title}</span>`;
        }

        if (link.description) {
            output += `\n<span class="${descColor}">${link.description}</span>`;
        }
        output += `\n<span class="${authorColor}">— ${link.author}</span>`;
        output += `</div>`;
    });

    output += '</div>';
    terminalOutput.innerHTML = output;

    // Scroll to top after render
    setTimeout(() => {
        terminalOutput.scrollTop = 0;
    }, 0);

    // Update canvas mask for list view
    updateCanvasMask();
}
