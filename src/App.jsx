import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TimelinePage from './pages/TimelinePage';
import YearEventsPage from './pages/YearEventsPage';
import AgeEventsPage from './pages/AgeEventsPage';
import ImportPage from './pages/ImportPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/years_new" element={<HomePage />} />
          <Route path="/timeline/:id" element={<TimelinePage />} />
          <Route path="/year/:year" element={<YearEventsPage />} />
          <Route path="/age/:age" element={<AgeEventsPage />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 