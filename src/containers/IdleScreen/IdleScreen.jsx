import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para la navegación
import Webcam from 'react-webcam';
import fondo from '../../assets/fondo.jpeg';
import Button from '../../components/Common/Button';
import ModalResult from '../../components/ModalResult/ModalResult';
import API_ENDPOINTS from '../../routes/apiEndpoints';
import './IdleScreen.scss';

const IdleScreen = () => {
  const webcamRef = useRef(null);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [professorInfo, setProfessorInfo] = useState(null);

  const navigate = useNavigate(); // Creamos una instancia de useNavigate

  const captureAndRecognize = async () => {
    setIsCameraVisible(true);
    setIsCapturing(true);
    setErrorMessage('');
    setProfessorInfo(null);

    await new Promise(resolve => setTimeout(resolve, 1500));

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

          if (recognizeData.identities && recognizeData.identities.length > 0) {
            const idCard = recognizeData.identities[0];
            const professorResponse = await fetch(`${API_ENDPOINTS.GET_PROFESSOR_BY_ID_CARD}/${idCard}`);
            const professorData = await professorResponse.json();

            if (professorResponse.ok) {
              setProfessorInfo(professorData);
            } else {
              setErrorMessage(professorData.error || "Error al obtener la información del profesor.");
            }
          } else {
            setErrorMessage("Desconocido");
          }
        } else {
          setErrorMessage("No se detectaron rostros válidos.");
        }
      } catch (error) {
        console.error("Error durante el reconocimiento facial: ", error);
        setErrorMessage("Error durante el reconocimiento facial.");
      } finally {
        setIsCameraVisible(false);
        setIsCapturing(false);
      }
    });
  };

  const closeModal = () => {
    setErrorMessage('');
    setProfessorInfo(null);
  };

  const handleContinue = () => {
    if (professorInfo) {
      navigate('/class-schedule', { state: { professorId: professorInfo.PROFESSOR_ID } });
    }
  };

  const toggleCameraVisibility = () => {
    setIsCameraVisible(prevState => !prevState);
  };

  return (
    <div className="idle-screen" style={{ backgroundImage: `url(${fondo})` }}>
      <div className="centered-box">
        <Button
          onClick={() => console.log('Registro Asistencia Horario Laboral')}
          disabled={isCapturing}
        >
          REGISTRO ASISTENCIA HORARIO LABORAL
        </Button>
        <Button
          onClick={captureAndRecognize}
          disabled={isCapturing}
        >
          REGISTRO ASISTENCIA HORARIO CLASES
        </Button>
        <Button
          onClick={toggleCameraVisibility}
          disabled={isCapturing}
        >
          {isCameraVisible ? 'OCULTAR CÁMARA' : 'VER CÁMARA'}
        </Button>
      </div>

      {isCameraVisible && (
        <Webcam
          ref={webcamRef}
          audio={false}
          className="webcam"
          screenshotFormat="image/jpeg"
        />
      )}

      {professorInfo || errorMessage ? (
        <ModalResult
          professorInfo={professorInfo}
          errorMessage={errorMessage}
          onClose={closeModal}
          onContinue={handleContinue} // Pasamos handleContinue a ModalResult
        />
      ) : null}
    </div>
  );
};

export default IdleScreen;
