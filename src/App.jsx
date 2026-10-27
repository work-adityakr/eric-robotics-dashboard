import React, { useState, useEffect, useCallback } from 'react';
import CameraFeed from './components/CameraFeed';
import MapViewer3D from './components/MapViewer3D';
import NavigationSidebar from './components/NavigationSidebar';
import TopHud from './components/TopHud';
import TeleopControls from './components/TeleopControls';

export default function App() {
  const [activeView, setActiveView] = useState('camera');
  const [mode, setMode] = useState('AUTO');
  const [isEStopActive, setIsEStopActive] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [robotPose, setRobotPose] = useState({ x: 0, y: 0, heading: 0 });

  const handleDrive = useCallback((direction) => {
    if (isEStopActive) return;

    setRobotPose((prev) => {
      let { x, y, heading } = prev;
      const step = 0.8;
      const turn = 0.15;

      switch (direction) {
        case 'FORWARD':
          x -= Math.sin(heading) * step;
          y -= Math.cos(heading) * step;
          break;
        case 'BACKWARD':
          x += Math.sin(heading) * step;
          y += Math.cos(heading) * step;
          break;
        case 'LEFT':
          heading += turn;
          break;
        case 'RIGHT':
          heading -= turn;
          break;
        default:
          break;
      }
      return { x, y, heading };
    });
  }, [isEStopActive]);

  useEffect(() => {
    const onKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || e.key === 'ArrowUp') handleDrive('FORWARD');
      if (key === 's' || e.key === 'ArrowDown') handleDrive('BACKWARD');
      if (key === 'a' || e.key === 'ArrowLeft') handleDrive('LEFT');
      if (key === 'd' || e.key === 'ArrowRight') handleDrive('RIGHT');
      if (e.code === 'Space') setIsEStopActive((prev) => !prev);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleDrive]);

  const toggleViews = () => {
    setActiveView((prev) => (prev === 'camera' ? 'map' : 'camera'));
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(Number((z + 0.2).toFixed(2)), 2.2));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(Number((z - 0.2).toFixed(2)), 0.6));

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-sans">
      <NavigationSidebar />

      <TopHud 
        activeView={activeView} 
        onViewToggle={toggleViews} 
        mode={mode} 
        setMode={setMode} 
      />

      {/* Main Viewport */}
      <main className="absolute inset-0 pl-16 z-10">
        {activeView === 'camera' ? (
          <CameraFeed />
        ) : (
          <MapViewer3D 
            robotPose={robotPose} 
            zoomLevel={zoomLevel} 
            isThumbnail={false} 
          />
        )}
      </main>

      {/* Floating Picture-in-Picture & Slider (Exact match to reference demo) */}
      <div className="absolute left-24 bottom-6 z-30 flex items-center gap-3">
        {/* Minimal Zoom Bar attached to left */}
        <div className="flex flex-col items-center gap-1 bg-[#1a202c]/80 backdrop-blur px-1.5 py-2 rounded-full border border-white/20 text-white shadow-lg">
          <button 
            onClick={handleZoomIn} 
            className="w-5 h-5 rounded-full hover:bg-white/20 text-xs font-bold flex items-center justify-center transition"
          >
            +
          </button>
          
          <div className="w-0.5 h-20 bg-white/30 relative flex items-center justify-center my-1 rounded-full">
            {/* Draggable-style node indicator */}
            <div 
              className="w-2.5 h-2.5 bg-black rounded-full border-2 border-white absolute shadow transition-all duration-150"
              style={{ bottom: `${((zoomLevel - 0.6) / 1.6) * 100}%` }}
            />
          </div>

          <button 
            onClick={handleZoomOut} 
            className="w-5 h-5 rounded-full hover:bg-white/20 text-xs font-bold flex items-center justify-center transition"
          >
            -
          </button>
        </div>

        {/* Thumbnail Card with grey rounded border */}
        <div 
          onClick={toggleViews}
          className="relative w-64 h-40 rounded-2xl overflow-hidden border-[3px] border-[#cbd5e1] shadow-2xl cursor-pointer group bg-[#d7d7d7] transition hover:scale-[1.02]"
        >
          {activeView === 'camera' ? (
            <MapViewer3D 
              robotPose={robotPose} 
              zoomLevel={zoomLevel} 
              isThumbnail={true} 
            />
          ) : (
            <CameraFeed />
          )}

          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <span className="bg-zinc-900/90 text-white text-[10px] font-semibold px-3 py-1 rounded-full border border-white/20 shadow">
              Click to enter {activeView === 'camera' ? 'map' : 'camera'} view
            </span>
          </div>
        </div>
      </div>

      <TeleopControls 
        onDrive={handleDrive} 
        onEStop={() => setIsEStopActive((prev) => !prev)} 
        isEStopActive={isEStopActive} 
      />
    </div>
  );
}