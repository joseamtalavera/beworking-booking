import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Box, Typography } from '@mui/material';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MapPreview = ({ rooms }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }
    if (!MAPBOX_TOKEN) {
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-3.70379, 40.41678],
      zoom: 4.6
    });
  }, []);

  useEffect(() => {
    if (!mapRef.current || !rooms?.length) {
      return;
    }

    const map = mapRef.current;
    const markers = rooms.map((room) => {
      const el = document.createElement('div');
      el.className = 'beworking-map-marker';
      el.style.cssText = 'width:18px;height:18px;border-radius:50%;background:#2563eb;box-shadow:0 0 0 4px rgba(37,99,235,0.2);';

      return new mapboxgl.Marker(el)
        .setLngLat(room.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 12 }).setHTML(
            `<strong>${room.name}</strong><br/>${room.centro}<br/>From ${room.priceFrom} ${room.currency}/hr`
          )
        )
        .addTo(map);
    });

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [rooms]);

  if (!MAPBOX_TOKEN) {
    return (
      <Box
        sx={{
          borderRadius: 3,
          bgcolor: '#e2e8f0',
          p: 4,
          height: '100%',
          minHeight: 360,
          display: 'grid',
          placeItems: 'center'
        }}
      >
        <Typography variant="body2" sx={{ color: '#475569' }}>
          Configure `VITE_MAPBOX_TOKEN` to enable the interactive map.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={mapContainerRef}
      sx={{
        borderRadius: 3,
        width: '100%',
        height: '100%',
        minHeight: 360,
        overflow: 'hidden'
      }}
    />
  );
};

export default MapPreview;
