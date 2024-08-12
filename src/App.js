import React, { useState } from 'react';
import CameraFeed from './components/CameraFeed';
import ModalResult from './components/ModalResult';

function App() {
  const [identity, setIdentity] = useState(null);

  const handleRecognize = (identity) => {
    setIdentity(identity);
  };

  const closeModal = () => {
    setIdentity(null);
  };

  return (
    <div>
      <h1>Real-Time Face Recognition</h1>
      <CameraFeed onRecognize={handleRecognize} />
      {identity && <ModalResult identity={identity} onClose={closeModal} />}
    </div>
  );
}

export default App;