import React, { useState } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import BasicTextField from '../../components/textFields/basic';
import SubmitButton from '../../components/buttons/submitButton';

const ChangePasswordModal = ({ open, onClose, userId, setAlertOpen, setAlertProps }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [newPasswordError, setNewPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);

    const validateForm = () => {
        let errors = {};

        if (!newPassword) {
            errors.newPasswordError = true;
        }

        if (!confirmPassword || newPassword !== confirmPassword) {
            errors.confirmPasswordError = true;
        }

        return errors;
    };

    const handleChangePassword = async () => {
        const errors = validateForm();
        setNewPasswordError(errors.newPasswordError || false);
        setConfirmPasswordError(errors.confirmPasswordError || false);

        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            const token = sessionStorage.getItem('token');
            await axios.put(`${process.env.REACT_APP_API_URL}/utilizadores/alterarPass/${userId}`, {
                password: newPassword
            }, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json'
                },
            });
            console.log('Palavra-passe atualizada com sucesso!');
            onClose();
            setAlertProps({ title: 'Success', label: 'Palavra-passe atualizada com sucesso.', severity: 'success' });
            setAlertOpen(true);
        } catch (error) {
            console.error('Erro ao atualizar a palavra-passe:', error);
            setAlertProps({ title: 'Error', label: 'Erro ao atualizar a palavra-passe.', severity: 'error' });
            setAlertOpen(true);
        }
    };

    return (
        <Modal open={open}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', maxWidth: '80%', backgroundColor: '#1D5AA1', padding: '20px', borderRadius: '12px' }}>
                <h2 style={{ color: 'white' }}>Definir Palavra-passe</h2>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <BasicTextField caption='Nova palavra-passe' valor={newPassword} onchange={(e) => setNewPassword(e.target.value)} fullwidth={true} type="password" error={newPasswordError}
                            helperText={newPasswordError ? "Por favor coloque a nova palavra-passe!" : ""} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <BasicTextField caption='Confirme nova palavra-passe' valor={confirmPassword} onchange={(e) => setConfirmPassword(e.target.value)} fullwidth={true} type="password" error={confirmPasswordError}
                            helperText={confirmPasswordError ? "Palavras-passe não coincidem!" : ""} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                        <SubmitButton onclick={handleChangePassword} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ChangePasswordModal;
