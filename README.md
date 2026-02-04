# FRACK AT HOME™

A realistic, interactive fracking simulation with a modern, humorous twist. Built with React, Vite, and Tailwind CSS.

## Features

- **Ultra-Realistic Visualization**: Dual-view system showing both underground cross-section and surface drilling platform
- **Interactive Drilling**: Click to start a complete drilling operation with realistic stages
- **Real-Time Monitoring**: Live gauges for drill depth, pressure, and oil extraction
- **Professional Design**: Modern, clean interface with subtle animations
- **No Emojis**: Serious industrial aesthetic with satirical messaging

## The Experience

1. Click "START FRACKING OPERATION"
2. Watch the drill descend through geological layers
3. See pressure build in the underground formation
4. Observe oil extraction and storage
5. Track your total operations

## Installation

### Prerequisites
- Node.js (LTS version) from https://nodejs.org/

### Setup

1. **Extract the files** to your project folder
2. **Open terminal** in the project directory
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Run development server:**
   ```bash
   npm run dev
   ```
5. **Open browser** to http://localhost:5173

## Building for Production

```bash
npm run build
```

The `dist` folder will contain your production-ready files.

## Deploy to Render

1. Push code to GitHub
2. Create new Static Site on Render.com
3. Connect your repository
4. Set build command: `npm install && npm run build`
5. Set publish directory: `dist`
6. Deploy!

## Technology Stack

- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Space Grotesk** - Professional typography

## Customization

### Change Slogans
Edit the `slogans` array in `src/App.jsx`

### Adjust Animation Speed
Modify the interval timings in the `startDrilling` function

### Colors
Tailwind classes can be customized in the component

## Project Structure

```
frack-at-home/
├── src/
│   ├── App.jsx          # Main application
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── tailwind.config.js   # Tailwind configuration
```

## The Humor

This is a parody of home improvement infomercials meets industrial oil extraction. The juxtaposition of bringing heavy industrial processes into domestic spaces is the joke - presented with professional polish and technical accuracy.

## License

This is satire. Please don't actually frack your home.

---

Made with 😂 and React | © 2026
