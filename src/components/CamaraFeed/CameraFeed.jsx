import React, { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import API_ENDPOINTS from '../../routes/apiEndpoints'; // Ruta corregida

const CameraFeed = ({ onRecognize }) => {
  const webcamRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const captureFrame = useCallback(() => {
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

  useEffect(() => {
    if (isVideoReady) {
      const canvas = captureFrame();
      if (!canvas) return;

      canvas.toBlob((blob) => {
        const formData = new FormData();
        formData.append('image', blob);

        fetch(API_ENDPOINTS.DETECT, { method: 'POST', body: formData })
          .then(response => response.json())
          .then(data => {
            if (data.faces.length > 0) {
              const face = data.faces[0];
              formData.append('faces', JSON.stringify([face]));
              fetch(API_ENDPOINTS.RECOGNIZE, { method: 'POST', body: formData })
                .then(response => response.json())
                .then(result => {
                  onRecognize(result.identities[0]);
                });
            } else {
              console.log("No faces detected.");
            }
          }).catch(error => {
            console.error("Error during face detection: ", error);
          });
      });
    }
  }, [isVideoReady, captureFrame, onRecognize]);

  return (
    <div>
      <Webcam
        ref={webcamRef}
        audio={false}
        style={{ width: '100%' }}
        screenshotFormat="image/jpeg"
        onUserMedia={() => setIsVideoReady(true)}
      />
    </div>
  );
};

export default CameraFeed;
