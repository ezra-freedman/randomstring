# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a single-page interactive web application called "randomstring" that features an animated physics-based string simulation. The entire application is contained in `index.html` with no build process or external dependencies beyond CDN-loaded libraries.

## Architecture

**Single-File Application**: All HTML, CSS, and JavaScript are in `index.html`. The application uses:
- Tailwind CSS (via CDN) for styling
- Vanilla JavaScript for the string physics simulation
- HTML5 Canvas for rendering

**Core Components**:

1. **Physics Engine** (lines 106-283): Verlet integration-based simulation with:
   - `Point` class: Particles with position, velocity (implicit via oldx/oldy), and cluster membership
   - `Stick` class: Distance constraints between points
   - `StringCluster` class: Groups of connected points/sticks
   - Core simulation loop: `updatePoints()` → `constrainPoints()` → `updateSticks()` → `checkCollisions()` → `draw()`

2. **UI Layers**:
   - Canvas (z-index: 0): Full-screen background for animation
   - UI overlay (z-index: 10): Header, footer, and terminal with `pointer-events: none` on container, selectively enabled on interactive elements

3. **Terminal System**: Command processor with autocomplete supporting `/help`, `/contact`, `/ls`, and `/clear`
   - Ghost text autocomplete hints
   - Tab completion
   - Dynamic terminal output with gradient overlay when scrollable

4. **Canvas Masking System**: Dynamic clip-path updates based on terminal content height
   - MutationObserver watches terminal changes
   - Uses `offsetHeight` for visible terminal area (not `scrollHeight`)
   - Recalculates on window resize

5. **Cursor System**: Context-aware cursor states
   - Default cursor for empty space
   - Grab cursor when hovering near draggable endpoints (within `DRAG_RADIUS`)
   - Grabbing cursor during active drag

## Key Simulation Logic

- **String Creation**: Click spawns new string segments (2 points + 1 stick)
- **Dragging**: Drag string endpoints to move them; releasing near another endpoint joins clusters
  - `isDragging` only set to true when actually dragging a point (not just mouse movement)
  - Prevents accidental spawn blocking
- **Auto-joining**: Endpoints within `JOIN_THRESHOLD` (20px) automatically connect
- **Collision/Joining**: When clusters join, a new stick is created, points are merged into one cluster, and joined endpoints lose their `isEndpoint` status

## Configuration Constants

- `MIN_STICK_LENGTH`: Minimum segment length (30px)
- `STICK_LENGTH`: Dynamic segment length calculated as 8% of smaller screen dimension (min 30px)
- `DRAG_RADIUS`: Click detection radius (15px)
- `JOIN_THRESHOLD`: Auto-join distance (20px)
- `FRICTION`, `BOUNCE`, `MAX_SPEED`: Physics parameters

The `calculateStickLength()` function recalculates string length on resize for responsive scaling.

## Development

Since this is a static HTML file with no build process:
- Open `index.html` directly in a browser to test
- No installation, compilation, or server required
- Changes to HTML/CSS/JS are immediately visible on refresh

## Styling Approach

Uses Tailwind utility classes for UI elements and custom CSS for canvas/container positioning. The Inter font is loaded from Google Fonts.
