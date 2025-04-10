import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login'; 
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import CreateEvent from './pages/CreateEvent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>}/>
      </Routes>
    </Router>
  );
}

export default App;
