export default function CameraFeed() {
  const videoSrc = `${import.meta.env.BASE_URL}driving.mp4`;

  return (
    <div className="w-full h-full relative overflow-hidden bg-black select-none">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover filter brightness-90 contrast-105"
        src={videoSrc}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Target Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-32 border border-cyan-400/40 rounded pointer-events-none flex items-center justify-center">
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
        <span className="absolute -top-5 left-0 text-[10px] tracking-wider text-cyan-400 font-mono">
          YOLO_LIDAR_FUSION: ACTIVE
        </span>
      </div>
    </div>  
  );
}