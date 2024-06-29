import React, { useState } from 'react';
import axios from 'axios';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const getBase64FromUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/utilizadores/email/${email}`);

      const utilizador = response.data.data;
      if (password !== utilizador.passwd) {
        alert('Palavra-passe errada!');
        return;
      }

      if (utilizador.perfil.descricao === 'User') {
        alert('Sem acesso a backoffice!');
        return;
      }
      console.log(utilizador);

      sessionStorage.setItem('userid', utilizador.utilizadorid);
      sessionStorage.setItem('nome', utilizador.pnome + ' ' + utilizador.unome);
      sessionStorage.setItem('perfil', utilizador.perfil.descricao);

      if (utilizador.imagem === undefined) {
        sessionStorage.setItem('image', '');
      }
      else {
        if (utilizador.imagem.url === '' || utilizador.imagem.url === null) {
          sessionStorage.setItem('image', '');
        } else {
          const base64String = await getBase64FromUrl(utilizador.imagem.url);
          sessionStorage.setItem('image', base64String);
        }
      }

      if (utilizador.administrador_polos.length > 0) {
        sessionStorage.setItem('poloid', utilizador.administrador_polos[0].poloid);
        sessionStorage.setItem('descpolo', utilizador.administrador_polos[0].polo.descricao);
        sessionStorage.setItem('adm poloid', utilizador.administrador_polos[0].administrador_poloid);
      } else {
        console.warn('Utilizador não tem um poloid associado.');
        sessionStorage.setItem('poloid', '');
        sessionStorage.setItem('adm poloid', '');
      }

      const tokenResponse = await axios.get(`http://localhost:8000/utilizadores/token/${utilizador.utilizadorid}`);
      sessionStorage.setItem('token', tokenResponse.data);
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert('Utilizador não encontrado');
      } else {
        console.error('Erro ao fazer login:', error);
      }
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h4" textAlign="center" gutterBottom> SOFTSHARES </Typography>
        <Typography variant="h5" textAlign="center" gutterBottom> Entrar na tua conta </Typography>
        <Typography variant="subtitle1" textAlign="center" gutterBottom> Bem vindo de volta, introduz os teus dados! </Typography>
        <TextField label="Email" fullWidth margin="normal" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type={showPassword ? 'text' : 'password'} fullWidth margin="normal" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)}
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
