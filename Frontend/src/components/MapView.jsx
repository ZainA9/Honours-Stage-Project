// src/components/MapView.jsx
import React, { useEffect, useRef, useState } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';

export default function MapView({ userCoords, eventCoords }) {
  const mapRef = useRef();
  const navigate = useNavigate();

  // state for which event is currently “open”
  const [popupInfo, setPopupInfo] = useState(null);

  // fit map to include user + all events
  useEffect(() => {
    if (!mapRef.current || !userCoords || !eventCoords?.length) return;

    const bounds = [
      [userCoords.lng, userCoords.lat],
      ...eventCoords.map((ev) => [ev.lng, ev.lat]),
    ];

    mapRef.current.fitBounds(bounds, {
      padding: 60,
      duration: 1000,
    });
  }, [userCoords, eventCoords]);

  return (
    <div className="rounded-lg overflow-hidden shadow h-[400px]">
      {(!userCoords || !eventCoords?.length) ? (
        <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-500">
          Loading map...
        </div>
      ) : (
        <Map
          ref={mapRef}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          initialViewState={{
            longitude: userCoords.lng,
            latitude:  userCoords.lat,
            zoom:      10,
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        >
          <NavigationControl position="top-right" />

          {/* User marker */}
          <Marker
            longitude={userCoords.lng}
            latitude={userCoords.lat}
            color="blue"
          />

          {/* Event markers */}
          {eventCoords.map((ev) => (
            <Marker
              key={ev.id}
              longitude={ev.lng}
              latitude={ev.lat}
              anchor="bottom"
            >
              <button
                className="text-red-600 text-2xl"
                onClick={() => setPopupInfo(ev)}
              >
                📍
              </button>
            </Marker>
          ))}

          {/* Popup for selected event */}
          {popupInfo && (
            <Popup
              longitude={popupInfo.lng}
              latitude={popupInfo.lat}
              anchor="top"
              onClose={() => setPopupInfo(null)}
              closeOnClick={false}
            >
              <div className="p-2">
                <h4 className="font-semibold">{popupInfo.name}</h4>
                <button
                  onClick={() => navigate(`/event/${popupInfo.id}`)}
                  className="mt-1 text-indigo-600 hover:underline text-sm"
                >
                  View Details
                </button>
              </div>
            </Popup>
          )}
        </Map>
      )}
    </div>
  );
}
