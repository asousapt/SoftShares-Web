import React from 'react';
import Modal from '@mui/material/Modal';
import CancelButton from '../../components/buttons/cancelButton';
import SubmitButton from '../../components/buttons/submitButton';

const ConfirmarAprov = ({ open, onClose, onConfirm, dados }) => {
    console.log(dados);

    const mudarRegisto = async () => {
        onConfirm(dados.id);
        onClose();
    }

    return (
        <Modal open={open} onClose={onClose}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px', overflow: 'auto' }}>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <h2 style={{ marginTop: 0, color: 'black', textAlign: 'center' }}>Deseja aprovar o comentário ?</h2>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <CancelButton onclick={onClose} caption='Cancelar' showIcon={false} />
                        <SubmitButton onclick={mudarRegisto} caption='Confirmar' showIcon={false} />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmarAprov;
