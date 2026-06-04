import React from "react";

function BackgroundParticles() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Ambient gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-sk-purple/[0.06] blur-[120px]" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-sk-pink/[0.04] blur-[100px]" />
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-indigo-500/[0.03] blur-[80px]" />
    </div>
  );
}

export default React.memo(BackgroundParticles);
