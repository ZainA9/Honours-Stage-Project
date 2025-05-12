// src/pages/CalendarView.jsx
import React, { useEffect, useState } from 'react';
import {
  Calendar as BigCalendar,
  dateFnsLocalizer
} from 'react-big-calendar';
import format       from 'date-fns/format';
import parse        from 'date-fns/parse';
import startOfWeek  from 'date-fns/startOfWeek';
import getDay       from 'date-fns/getDay';
import enUS         from 'date-fns/locale/en-US';
import axios        from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar       from '../components/Navbar';
import Footer       from '../components/Footer';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5154/api/events')
      .then(res => {
        const mapped = res.data.map(evt => ({
          id:    evt.id,
          title: evt.name,
          start: new Date(evt.date),
          end:   new Date(evt.date),
        }));
        setEvents(mapped);
      })
      .catch(err => console.error('Calendar fetch error:', err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6">Event Calendar</h2>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}

          //controlled view & date:
          view={currentView}
          onView={view => setCurrentView(view)}
          date={currentDate}
          onNavigate={date => setCurrentDate(date)}

          //available views & default:
          views={['month', 'week', 'day', 'agenda']}
          defaultView="month"

          //click an event to go to its detail page
          onSelectEvent={evt => navigate(`/event/${evt.id}`)}
        />
      </div>
      <Footer />
    </div>
  );
}
