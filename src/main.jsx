import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Import components
import App from './App';
import MQTT from './component/mqtt';
import MedicineForm1 from './component/MedicineForm1';
import MedicineForm2 from './component/MedicineForm2';

import NavBar from "./component/nav"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
        <NavBar></NavBar>
      <Routes>
        <Route path="/" element={<App />} /> {/* หน้าแรก */}
        <Route path="/mqtt" element={<MQTT />} /> {/* หน้า MQTT */}
        <Route path="/medicine-form1" element={<MedicineForm1 />} /> {/* หน้า MedicineForm1 */}
        <Route path="/medicine-form2" element={<MedicineForm2 />} /> {/* หน้า MedicineForm1 */}

      </Routes>
    </Router>
  </StrictMode>,
);
