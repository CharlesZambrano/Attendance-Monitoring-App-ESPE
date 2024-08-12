import { useEffect, useRef, useState } from 'react';

const useMotionDetection = (videoRef, onMotionDetected) => {
  const [isMotionDetected, setIsMotionDetected] = useState(false);
  const prevFrameRef = useRef(null);

  useEffect(() => {
    const detectMotion = () => {
      const video = videoRef.current;
      if (!video) {
        console.error("Video element not found for motion detection");
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const currentFrame = context.getImageData(0, 0, canvas.width, canvas.height);
      if (prevFrameRef.current) {
        const diff = calculateFrameDifference(prevFrameRef.current, currentFrame);
        console.log("Motion difference detected: ", diff);
        if (diff > 10000) {  // Umbral de detección de movimiento
          setIsMotionDetected(true);
          onMotionDetected();
        }
      }

      prevFrameRef.current = currentFrame;
      setTimeout(detectMotion, 100);  // Verifica cada 100ms
    };

    if (videoRef.current) {
      detectMotion();
    } else {
      console.error("videoRef.current is null during motion detection setup.");
    }
  }, [videoRef, onMotionDetected]);

  const calculateFrameDifference = (prevFrame, currentFrame) => {
    let diff = 0;
    for (let i = 0; i < prevFrame.data.length; i += 4) {
      diff += Math.abs(prevFrame.data[i] - currentFrame.data[i]);
    }
    return diff;
  };

  return isMotionDetected;
};

export default useMotionDetection;
