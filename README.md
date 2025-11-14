# randomstring

An interactive physics-based string animation with a minimalist terminal interface.

## Overview

randomstring is a single-page web application featuring:

- **Interactive String Physics**: Click to spawn string segments that drift, collide, and automatically connect when endpoints meet
- **Verlet Integration**: Smooth, realistic physics simulation with constraint-based dynamics
- **Dynamic Masking**: Strings float behind the terminal UI with adaptive canvas clipping
- **Terminal Interface**: Simple command-line interface with autocomplete support
- **Responsive Design**: String length scales with screen size for optimal experience on any device

## Features

### String Simulation
- Click anywhere to spawn new string segments
- Drag string endpoints to manipulate them (cursor changes to indicate draggable points)
- Strings automatically join when endpoints get close
- Realistic physics with friction, bounce, and momentum
- Responsive string length scales with screen size (8% of smaller dimension, min 30px)
- Smart click detection prevents accidental spawns during drag operations

### Terminal Commands
- `/help` - Show available commands
- `/contact` - Display contact information
- `/ls` - List recent blog posts
- `/clear` - Clear terminal output

### UI/UX
- **Smart Cursor Feedback**: Default cursor, grab cursor on hover, grabbing cursor while dragging
- **Terminal Autocomplete**: Ghost text hints with Tab completion for commands
- **Dynamic Canvas Masking**: Strings seamlessly hide behind terminal area as it expands
- **Gradient Overlay**: Smooth fade effect when terminal content is scrollable
- **Minimalist Design**: Dark theme with Inter font and clean interface
- **Mobile-Friendly**: Responsive string length and touch-compatible interactions

## Technology

Built with vanilla JavaScript and HTML5 Canvas. No frameworks, no build process - just open `index.html` in a browser.

- **Physics Engine**: Custom Verlet integration
- **Styling**: Tailwind CSS (via CDN)
- **Font**: Inter (Google Fonts)

## Live Demo

Visit: [https://ezra-freedman.github.io/randomstring/](https://ezra-freedman.github.io/randomstring/)

## Local Development

Simply open `index.html` in your browser. No installation or build steps required.

## License

MIT
