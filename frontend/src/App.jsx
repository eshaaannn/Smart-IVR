import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VoiceInputPage from './pages/VoiceInputPage';
import ProcessingPage from './pages/ProcessingPage';
import ResultsPage from './pages/ResultsPage';
import ManualSelectionPage from './pages/ManualSelectionPage';
import { ROUTES } from './utils/constants';

function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<VoiceInputPage />} />
        <Route path={ROUTES.PROCESSING} element={<ProcessingPage />} />
        <Route path={ROUTES.RESULTS} element={<ResultsPage />} />
        <Route path={ROUTES.MANUAL_SELECTION} element={<ManualSelectionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
