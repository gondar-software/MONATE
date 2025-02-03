import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function SlideViewer(props: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  
  useEffect(() => {
    if (!paused) {
      const interval = setInterval(() => {
        nextSlide();
      }, 500);
      return () => clearInterval(interval);
    }
  }, [currentIndex, paused]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % props.slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className="relative w-full h-full mx-auto overflow-hidden rounded-lg bg-gray-400"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full h-full flex items-center justify-center"
      >
        {props.slides[currentIndex].type === "image" ? (
          <img src={props.slides[currentIndex].src} alt="slide" className="w-full h-full object-cover" />
        ) : (
          <video
            src={props.slides[currentIndex].src}
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
            controlsList="nodownload nofullscreen noremote"
          />
        )}
      </motion.div>
      
      {props.slidingButton && <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {props.slides.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${currentIndex === index ? "bg-white" : "bg-gray-400"}`}
          />
        ))}
      </div>}
    </div>
  );
}

export default SlideViewer;