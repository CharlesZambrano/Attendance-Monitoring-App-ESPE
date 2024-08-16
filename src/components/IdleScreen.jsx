import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import fondo from '../assets/fondo.jpeg'; // Asegúrate de que la ruta de la imagen es correcta
import ModalResult from './ModalResult';

const IdleScreen = () => {
  const webcamRef = useRef(null);
  const [identity, setIdentity] = useState(null);
  const [isCameraVisible, setIsCameraVisible] = useState(false);

  const captureAndRecognize = async () => {
    setIsCameraVisible(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const video = webcamRef.current?.video;

    if (!video) {
      console.error("Video element is not ready yet");
      setIsCameraVisible(false);
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
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo blanco semitransparente
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0px 0px 10px rgba(0,0,0,0.5)'
        }}
      >
        <button
          onClick={captureAndRecognize}
          style={{
            padding: '10px 20px',
            fontSize: '18px',
            marginRight: '10px',
            cursor: 'pointer',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white'
          }}
        >
          REGISTRAR ASISTENCIA
        </button>

        <button
          onClick={toggleCameraVisibility}
          style={{
            padding: '10px 20px',
            fontSize: '18px',
            cursor: 'pointer',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white'
          }}
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
