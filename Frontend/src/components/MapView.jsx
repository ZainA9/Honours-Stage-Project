import React, { useState } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapView = ({ userCoords, eventCoords }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  if (!userCoords || !eventCoords || eventCoords.length === 0) {
    return (
      <div className="w-full h-[300px] bg-gray-200 rounded flex items-center justify-center text-gray-500">
        Loading map...
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden shadow h-[400px]">
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={{
          longitude: userCoords?.lng || -0.12,
          latitude: userCoords?.lat || 51.5,
          zoom: 10,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        <NavigationControl position="top-right" />

        {/* User Marker */}
        <Marker longitude={userCoords.lng} latitude={userCoords.lat} color="blue" />

        {/* Event Markers */}
        {eventCoords?.map((ev, index) => (
          <Marker
            key={index}
            longitude={ev.lng}
            latitude={ev.lat}
            color="red"
            onClick={() => setSelectedEvent(ev)}
          />
        ))}

        {/* Popup for selected event */}
        {selectedEvent && (
          <Popup
            longitude={selectedEvent.lng}
            latitude={selectedEvent.lat}
            closeOnClick={false}
            onClose={() => setSelectedEvent(null)}
            anchor="top"
          >
            <div className="text-sm">
              <p className="font-semibold">{selectedEvent.name}</p>
              <a
                href={`/event/${selectedEvent.id}`}
                className="text-indigo-600 hover:underline text-xs"
              >
                View Event
              </a>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapView;
