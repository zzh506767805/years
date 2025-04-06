import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import TimelinePage from './pages/TimelinePage';
import YearEventsPage from './pages/YearEventsPage';
import AgeEventsPage from './pages/AgeEventsPage';
import ImportPage from './pages/ImportPage';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/years_new" element={<HomePage />} />
          <Route path="/timeline/:id" element={<TimelinePage />} />
          <Route path="/year/:year" element={<YearEventsPage />} />
          <Route path="/age/:age" element={<AgeEventsPage />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 