import { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}

export function TypewriterText({ 
  text, 
  speed = 30, 
  delay = 200, 
  className = '' 
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);

    if (!text) return;

    let index = 0;
    let timeoutId: NodeJS.Timeout;

    const type = () => {
      if (index < text.length) {
        setDisplayedText(text.substring(0, index + 1));
        index++;
        timeoutId = setTimeout(type, speed);
      } else {
        setIsComplete(true);
      }
    };

    // Pequeño delay antes de empezar a escribir
    const startDelay = setTimeout(type, delay);

    return () => {
      clearTimeout(startDelay);
      clearTimeout(timeoutId);
    };
  }, [text, speed, delay]);

  return <span className={className}>{displayedText}</span>;
}
