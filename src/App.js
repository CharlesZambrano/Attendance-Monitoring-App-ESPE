import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'; // Usamos Routes en lugar de Switch
import ClassScheduleContainer from './containers/ClassSchedule/ClassScheduleContainer';
import IdleScreen from './containers/IdleScreen/IdleScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IdleScreen />} />
        <Route path="/class-schedule" element={<ClassScheduleContainer />} />
      </Routes>
    </Router>
  );
}

export default App;
