import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import { APIProvider, Map as VisMap, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';

const MapModal = ({ open, onClose, onSave }) => {
    const [markerPosition, setMarkerPosition] = useState(null);
    const [infoWindowOpen, setInfoWindowOpen] = useState(false);

    const handleMapClick = (event) => {
        if (event.detail && event.detail.latLng) {
            const lat = event.detail.latLng.lat;
            const lng = event.detail.latLng.lng;
            setMarkerPosition({ lat, lng });
            setInfoWindowOpen(true);
        } else {
            console.error('event.detail.latLng is undefined');
        }
    };

    const handleInfoWindowClose = () => {
        setInfoWindowOpen(false);
    };

    const handleSave = () => {
        if (markerPosition) {
            onSave(markerPosition);
        }
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div style={{ position: 'fixed', top: '50%', left: '55%', transform: 'translate(-50%, -50%)', width: '70vw', height: '74vh', backgroundColor: '#1D5AA1', padding: '30px', overflow: 'auto' }}>
                <div style={{ width: '70vw', height: '70vh', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', borderRadius: '12px', paddingLeft: 10, paddingRight: 10, paddingBottom: 50, paddingTop: 10 }}>
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
                                <>
                                    <Marker position={markerPosition} />
                                    {infoWindowOpen && (
                                        <InfoWindow position={markerPosition} onCloseClick={handleInfoWindowClose}>
                                            <div>
                                                <h4>Novo Ponto de Interesse</h4>
                                                <p>Lat: {markerPosition.lat.toFixed(6)}</p>
                                                <p>Long: {markerPosition.lng.toFixed(6)}</p>
                                            </div>
                                        </InfoWindow>
                                    )}
                                </>
                            )}
                        </VisMap>
                    </APIProvider>
                    <div style={{ marginBottom: 5 }}></div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <CancelButton onclick={onClose} caption='Cancelar' />
                        <SubmitButton onclick={handleSave} caption='Guardar' /> 
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default MapModal;
