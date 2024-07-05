import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import { APIProvider, Map as VisMap, Marker } from '@vis.gl/react-google-maps';

const MapModal = ({ open, onClose }) => {
    const [markerPosition, setMarkerPosition] = useState(null);

    const handleMapClick = (event) => {
        console.log(event);
        if (event.detail && event.detail.latLng) {
            const lat = event.detail.latLng.lat;
            const lng = event.detail.latLng.lng;
            setMarkerPosition({ lat, lng });
        } else {
            console.error('event.detail.latLng is undefined');
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div style={{ width: '70vw', height: '70vh', position: 'fixed', top: '50%', left: '55%', transform: 'translate(-50%, -50%)', }}>
                <APIProvider apiKey={process.env.REACT_APP_GOOGLE_KEY}>
                    <VisMap
                        style={{ width: '100%', height: '100%' }}
                        defaultCenter={{ lat: 40.655414, lng: -7.913218 }}
                        defaultZoom={12} 
                        gestureHandling={'greedy'}
                        disableDefaultUI={true}
                        onClick={(event) => handleMapClick(event)}
                    >
                        {markerPosition && (
                            <Marker position={markerPosition} />
                        )}
                    </VisMap>
                </APIProvider>
            </div>
        </Modal>
    );
};

export default MapModal;
