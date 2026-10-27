# Insight.IO Dashboard — ERIC Robotics

A fully interactive robotics operator dashboard built with **React + Vite + Three.js**, featuring real-time camera feed visualization, 3D LiDAR point cloud map rendering, and teleoperation controls.

---

## 📸 Dashboard Preview

![Dashboard Screenshot](./docs/dashboard-preview.mp4)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Setup & Run

```bash
# 1. Clone the repository
git clone https://github.com/<work-adityakr>/eric-robotics-dashboard.git
cd eric-robotics-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The dashboard will be available at **http://localhost:5173**

### Production Build

```bash
npm run build
npm run preview
```

---

## 🏗️ Architecture & Design Decisions

### Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | Component-based UI framework |
| **Vite 8** | Fast bundler with HMR for development |
| **Three.js** | 3D rendering engine for point cloud and robot visualization |
| **Tailwind CSS 4** | Utility-first CSS for rapid UI styling |
| **Lucide React** | Lightweight icon library for UI elements |

### Component Architecture

```
src/
├── App.jsx                    # Root layout, state management, keyboard bindings
├── components/
│   ├── CameraFeed.jsx         # Video player with HUD overlays (sensor status, crosshair)
│   ├── MapViewer3D.jsx        # Three.js scene: PCD loader, robot model, orbit controls
│   ├── NavigationSidebar.jsx  # Left icon sidebar with navigation actions
│   ├── TopHud.jsx             # Top bar: mission status, health diagnostics, mode switcher
│   └── TeleopControls.jsx     # D-pad joystick + emergency stop button
├── main.jsx                   # React entry point
└── index.css                  # Global Tailwind base styles
```

### Key Design Decisions

1. **Camera View**: Uses a local MP4 driving video (`/public/driving.mp4`) rendered with `<video>` element. HUD overlays display sensor metadata (camera ID, resolution, FPS, latency) and a YOLO/LiDAR fusion crosshair — matching the operational feel of a real robotics control station.

2. **3D Map View**: Built entirely with Three.js:
   - **PCD Loader** ingests a real `.pcd` LiDAR point cloud file with NaN sanitization (handles dirty sensor data gracefully)
   - **Floor plan** with grid overlay and volumetric obstacle boxes simulate a warehouse environment
   - **Robot model** is a multi-part 3D object (chassis, LiDAR dome, heading arrow, 4 wheels) that responds to teleoperation commands
   - **OrbitControls** allow the user to rotate, zoom, and pan the 3D scene freely

3. **Picture-in-Picture**: The secondary view (camera or map) renders as a floating thumbnail in the bottom-left corner. Clicking it swaps the main and PiP views — providing seamless context switching without losing situational awareness.

4. **Teleoperation**: WASD/Arrow keys drive the robot in the 3D scene. The circular D-pad in the bottom-right provides click-based controls. Spacebar toggles the emergency stop.

5. **State Management**: All state is managed via React hooks (`useState`, `useEffect`, `useCallback`) in the root `App.jsx` — no external state library needed given the component count. Robot pose updates use refs (`useRef`) to avoid unnecessary re-renders in the Three.js animation loop.

6. **Zoom Control**: A vertical slider next to the PiP thumbnail controls the camera distance in the 3D view, with a draggable-style visual indicator.

### Responsiveness

The dashboard uses a full-viewport layout optimized for desktop operator stations (the primary use-case for robotics dashboards). On smaller viewports, controls and panels scale proportionally via relative positioning and viewport units.

---

## 🎮 Controls

| Input | Action |
|-------|--------|
| `W` / `↑` | Drive forward |
| `S` / `↓` | Drive backward |
| `A` / `←` | Turn left |
| `D` / `→` | Turn right |
| `Space` | Toggle emergency stop |
| Click D-pad arrows | Drive in clicked direction |
| Click PiP thumbnail | Swap main/secondary view |
| `+` / `-` buttons | Zoom in/out on 3D map |
| Mouse drag (map view) | Orbit the 3D camera |
| Scroll wheel (map view) | Zoom in/out |

---

## 📁 Project Structure

```
eric-robotics-dashboard/
├── public/
│   ├── driving.mp4        # Camera feed video (autonomous driving footage)
│   ├── sample.pcd          # LiDAR point cloud data file
│   ├── favicon.svg         # Dashboard favicon
│   └── icons.svg           # Icon sprite sheet
├── src/                    # React source code (see Architecture above)
├── docs/                   # Screenshots and documentation assets
├── index.html              # HTML entry point
├── vite.config.js          # Vite + React + Tailwind configuration
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

---

## 🛠️ Tools & Libraries

- **[Three.js](https://threejs.org/)** — 3D rendering, point cloud visualization, OrbitControls
- **[PCDLoader](https://threejs.org/docs/#examples/en/loaders/PCDLoader)** — Point Cloud Data file parser (Three.js addon)
- **[React](https://react.dev/)** — UI component framework
- **[Vite](https://vite.dev/)** — Development server and build tool
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility CSS framework
- **[Lucide React](https://lucide.dev/)** — Icon library

---
## Details

Full Name - ADITYA KUMAR

Contact Number - 9110074175

Email ID - work.adityakr@gmail.com

## 📝 License

This project was built as an assignment submission for ERIC Robotics.
