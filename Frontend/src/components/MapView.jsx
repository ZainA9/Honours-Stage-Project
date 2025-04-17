import React, { useEffect, useRef } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapView = ({ userCoords, eventCoords }) => {
  const mapRef = useRef();

  // ✅ Safely useEffect - always called
  useEffect(() => {
    if (!mapRef.current || !userCoords || !eventCoords?.length) return;

    const bounds = [
      [userCoords.lng, userCoords.lat],
      ...eventCoords.map(ev => [ev.lng, ev.lat]),
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
            latitude: userCoords.lat,
            zoom: 10,
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        >
          <NavigationControl position="top-right" />

          {/* User marker */}
          <Marker longitude={userCoords.lng} latitude={userCoords.lat} color="blue" />

          {/* Event markers */}
          {eventCoords.map((ev, i) => (
            <Marker key={i} longitude={ev.lng} latitude={ev.lat} color="red" />
          ))}
        </Map>
      )}
    </div>
  );
};

export default MapView;
