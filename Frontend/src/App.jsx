import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react'
import Home from './pages/Home';
import Login from './pages/Login'; 
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails'; 
import Explore from './pages/Explore';
import UserProfile from './pages/UserProfile';
import MyEvents from './pages/MyEvents';
import Categories from './pages/Categories';
import CalendarView from './pages/CalendarView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>}/>
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/calendar" element={<CalendarView />} />
      </Routes>
    </Router>
  );
}

export default App;
