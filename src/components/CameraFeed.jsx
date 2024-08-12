import React, { useEffect, useRef, useState } from 'react';
import useMotionDetection from '../hooks/useMotionDetection';
import ModalResult from './ModalResult';

const CameraFeed = () => {
  const videoRef = useRef(null);
  const [motionDetected, setMotionDetected] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState(null);

  // Hook personalizado para la detección de movimiento
  useMotionDetection(videoRef, setMotionDetected);

  useEffect(() => {
    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error("Error accessing webcam: ", err);
        });
    };
    startVideo();
  }, []);

  useEffect(() => {
    if (motionDetected) {
      // Capturar un fotograma y enviarlo al backend para detección
      const captureFrame = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/png');
      };

      const frameData = captureFrame();

      fetch('/detect', {
        method: 'POST',
        body: new FormData().append('image', frameData)
      })
        .then(response => response.json())
        .then(data => {
          if (data.faces.length > 0) {
            const faceData = data.faces[0];  // Usar el primer rostro detectado
            const formData = new FormData();
            formData.append('image', frameData);
            formData.append('faces', JSON.stringify([faceData]));

            return fetch('/recognize', {
              method: 'POST',
              body: formData
            });
          } else {
            throw new Error("No faces detected");
          }
        })
        .then(response => response.json())
        .then(result => {
          setRecognitionResult(result.identities[0]);
        })
        .catch(err => {
          console.error("Recognition failed: ", err);
        });
    }
  }, [motionDetected]);

  return (
    <div>
      <video ref={videoRef} autoPlay muted style={{ display: motionDetected ? 'block' : 'none' }} />
      {recognitionResult && <ModalResult result={recognitionResult} />}
    </div>
  );
};

export default CameraFeed;