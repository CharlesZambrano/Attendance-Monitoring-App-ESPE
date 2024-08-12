import { useEffect } from 'react';

const useMotionDetection = (videoRef, setMotionDetected) => {
  useEffect(() => {
    const detectMotion = () => {
      const context = document.createElement('canvas').getContext('2d');

      const checkForMotion = () => {
        if (!videoRef.current) return;

        context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
        const frame = context.getImageData(0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);

        // Aquí puedes implementar una lógica simple de detección de movimiento, como comparar con el fotograma anterior
        // Por simplicidad, estamos marcando movimiento detectado cada 5 segundos (esto se puede mejorar).
        setTimeout(() => {
          setMotionDetected(true);
        }, 5000);
      };

      const intervalId = setInterval(checkForMotion, 1000);

      return () => clearInterval(intervalId);
    };

    detectMotion();
  }, [videoRef, setMotionDetected]);
};

export default useMotionDetection;