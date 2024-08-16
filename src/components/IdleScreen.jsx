import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import fondo from '../assets/fondo.jpeg';
import ModalResult from './ModalResult';

const buttonStyle = {
  marginBottom: '10px',
  marginRight: '10px',
  backgroundColor: '#00713d',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '1em',
  transition: 'background-color 0.3s ease',
};

const buttonHoverStyle = {
  backgroundColor: '#ffb220',
};

const IdleScreen = () => {
  const webcamRef = useRef(null);
  const [identity, setIdentity] = useState(null);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const captureAndRecognize = async () => {
    setIsCameraVisible(true);
    setIsCapturing(true);

    // Esperar unos segundos para que la cámara tenga tiempo de enfocar
    await new Promise(resolve => setTimeout(resolve, 3000));

    const video = webcamRef.current?.video;

    if (!video) {
      console.error("Video element is not ready yet");
      setIsCameraVisible(false);
      setIsCapturing(false);
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('image', blob);

      try {
        const detectResponse = await fetch('http://localhost:5000/detect', {
          method: 'POST',
          body: formData
        });
        const detectData = await detectResponse.json();

        if (detectData.faces && detectData.faces.length > 0) {
          const face = detectData.faces[0];
          formData.append('faces', JSON.stringify([face]));

          const recognizeResponse = await fetch('http://localhost:5000/recognize', {
            method: 'POST',
            body: formData
          });
          const recognizeData = await recognizeResponse.json();

          setIdentity(recognizeData.identities[0]);
        } else {
          console.log("No faces detected.");
          setIdentity("Desconocido");
        }
      } catch (error) {
        console.error("Error during face detection: ", error);
        setIdentity("Error");
      } finally {
        setIsCameraVisible(false);
        setIsCapturing(false);
      }
    });
  };

  const closeModal = () => {
    setIdentity(null);
  };

  const toggleCameraVisibility = () => {
    setIsCameraVisible(prevState => !prevState);
  };

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0px 0px 10px rgba(0,0,0,0.5)',
          textAlign: 'center'
        }}
      >
        <button
          onClick={captureAndRecognize}
          style={isHovering ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          disabled={isCapturing} // Desactivar el botón mientras se está capturando
        >
          {isCapturing ? 'Capturando...' : 'REGISTRAR ASISTENCIA'}
        </button>

        <button
          onClick={toggleCameraVisibility}
          style={isHovering ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          disabled={isCapturing} // Desactivar el botón mientras se está capturando
        >
          {isCameraVisible ? 'OCULTAR CÁMARA' : 'VER CÁMARA'}
        </button>
      </div>

      {isCameraVisible && (
        <Webcam
          ref={webcamRef}
          audio={false}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            marginTop: '20px'
          }}
          screenshotFormat="image/jpeg"
        />
      )}

      {identity && <ModalResult identity={identity} onClose={closeModal} />}
    </div>
  );
};

export default IdleScreen;
