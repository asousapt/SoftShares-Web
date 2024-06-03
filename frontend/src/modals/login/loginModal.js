import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Checkbox, FormControlLabel, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Google, Facebook } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px',
};

const LoginModal = ({ open, handleClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    // lógica de autenticação
    // se o login for bem sucedido, redirecionar para a dashboard
    navigate('/dashboard');
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          SOFTSHARES
        </Typography>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Entrar na tua conta
        </Typography>
        <Typography variant="subtitle1" textAlign="center" gutterBottom>
          Bem vindo de volta, introduz os teus dados!
        </Typography>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <FormControlLabel control={<Checkbox />} label="Lembrar-me" />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Entrar
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Google />}
          fullWidth
          sx={{ mt: 2 }}
        >
          Entrar com o Google
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Facebook />}
          fullWidth
          sx={{ mt: 2 }}
        >
          Entrar com o Facebook
        </Button>
      </Box>
    </Modal>
  );
};

export default LoginModal;
