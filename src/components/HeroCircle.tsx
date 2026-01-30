"use client";

import { useState } from "react";

export function HeroCircle() {
  const [showOverlay, setShowOverlay] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
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
      <a
        href="#story"
        id="circle-dark"
        onClick={handleClick}
        aria-label="Ir a la historia"
        className="hero-circle"
      >
      </a>

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
