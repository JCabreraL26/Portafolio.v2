import { useState } from "react";
import RotatingEarth from "./ui/wireframe-dotted-globe";

export function InteractiveGlobe() {
  const [showOverlay, setShowOverlay] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setShowOverlay(true);
    
    setTimeout(() => {
      const storySection = document.getElementById('story');
      if (storySection) {
        storySection.scrollIntoView({ behavior: 'smooth' });
      }
      
      setTimeout(() => {
        setShowOverlay(false);
      }, 500);
    }, 2500);
  };

  return (
    <>
      <RotatingEarth 
        width={400} 
        height={400}
        onClick={handleClick}
        showControls={false}
        className="w-full max-w-[min(90vw,400px)] aspect-square mx-auto"
      />

      {showOverlay && (
        <div className="overlay-dark active">
          <p className="overlay-quote">
            "El hombre es un dios cuando sueña y un mendigo cuando reflexiona"
            <span>— Friedrich Hölderlin</span>
          </p>
        </div>
      )}
    </>
  );
}
