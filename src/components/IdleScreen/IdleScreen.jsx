import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import fondo from '../../assets/fondo.jpeg';
import API_ENDPOINTS from '../../routes/apiEndpoints';
import ModalResult from '../ModalResult/ModalResult';
import './IdleScreen.scss';

const IdleScreen = () => {
  const webcamRef = useRef(null);
  const [identity, setIdentity] = useState(null);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false); // Eliminado isHovering

  const captureAndRecognize = async () => {
    setIsCameraVisible(true);
    setIsCapturing(true);

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
        const detectResponse = await fetch(API_ENDPOINTS.DETECT, {
          method: 'POST',
          body: formData
        });
        const detectData = await detectResponse.json();

        if (detectData.faces && detectData.faces.length > 0) {
          const face = detectData.faces[0];
          formData.append('faces', JSON.stringify([face]));

          const recognizeResponse = await fetch(API_ENDPOINTS.RECOGNIZE, {
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
    <div className="idle-screen" style={{ backgroundImage: `url(${fondo})` }}>
      <div className="centered-box">
        <button
          onClick={captureAndRecognize}
          className="button"
          disabled={isCapturing} // Desactivar el botón mientras se está capturando
        >
          {isCapturing ? 'Capturando...' : 'REGISTRAR ASISTENCIA'}
        </button>

        <button
          onClick={toggleCameraVisibility}
          className="button"
          disabled={isCapturing} // Desactivar el botón mientras se está capturando
        >
          {isCameraVisible ? 'OCULTAR CÁMARA' : 'VER CÁMARA'}
        </button>
      </div>

      {isCameraVisible && (
        <Webcam
          ref={webcamRef}
          audio={false}
          className="webcam"
          screenshotFormat="image/jpeg"
        />
      )}

      {identity && <ModalResult identity={identity} onClose={closeModal} />}
    </div>
  );
};

export default IdleScreen;
