import React, { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

const CameraFeed = ({ onRecognize }) => {
  const webcamRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const captureFrame = useCallback(() => {
    if (!webcamRef.current) {
      console.error("webcamRef.current is null");
      return null;
    }

    const video = webcamRef.current.video;
    if (!video) {
      console.error("Video element is not ready yet");
      return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    return canvas;
  }, []);

  const detectMotion = useCallback(() => {
    const canvas = captureFrame();
    if (!canvas) return;

    const context = canvas.getContext('2d');
    const currentFrame = context.getImageData(0, 0, canvas.width, canvas.height);

    if (webcamRef.current.prevFrame) {
      const diff = calculateFrameDifference(webcamRef.current.prevFrame, currentFrame);
      console.log("Motion difference detected: ", diff);
      if (diff > 10000) {  // Umbral de detección de movimiento
        setIsVideoReady(true);
      }
    }

    webcamRef.current.prevFrame = currentFrame;
  }, [captureFrame]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isVideoReady) {
        detectMotion();
      }
    }, 200);  // Comprobar movimiento cada 200ms

    return () => clearInterval(interval);
  }, [isVideoReady, detectMotion]);

  const calculateFrameDifference = (prevFrame, currentFrame) => {
    let diff = 0;
    for (let i = 0; i < prevFrame.data.length; i += 4) {
      diff += Math.abs(prevFrame.data[i] - currentFrame.data[i]);
    }
    return diff;
  };

  useEffect(() => {
    if (isVideoReady) {
      console.log("Camera feed is active. Starting frame capture...");
      const interval = setInterval(() => {
        const canvas = captureFrame();
        if (!canvas) return;

        canvas.toBlob((blob) => {
          const formData = new FormData();
          formData.append('image', blob);
          console.log("Sending frame to backend for face detection...");

          fetch('http://localhost:5000/detect', { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
              if (data.faces.length > 0) {
                console.log("Faces detected: ", data.faces);
                const face = data.faces[0];
                formData.append('faces', JSON.stringify([face]));
                fetch('http://localhost:5000/recognize', { method: 'POST', body: formData })
                  .then(response => response.json())
                  .then(result => {
                    console.log("Recognition result: ", result.identities[0]);
                    onRecognize(result.identities[0]);
                  });
              } else {
                console.log("No faces detected.");
              }
            }).catch(error => {
              console.error("Error during face detection: ", error);
            });
        });
      }, 2000); // Enviar cada 2 segundos cuando hay movimiento

      return () => clearInterval(interval);
    }
  }, [isVideoReady, captureFrame, onRecognize]);

  return (
    <div>
      <Webcam
        ref={webcamRef}
        audio={false}
        style={{ width: '100%' }}
        screenshotFormat="image/jpeg"
        onUserMedia={() => setIsVideoReady(true)}  // Indicamos cuando el video esté listo
      />
    </div>
  );
};

export default CameraFeed;
