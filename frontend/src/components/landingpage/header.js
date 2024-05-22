import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import LoginModal from '../../modals/login/loginModal';

const Header = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            SOFTSHARES
          </Typography>
          <Button color="inherit" onClick={handleOpen}>
            Entrar
          </Button>
        </Toolbar>
      </AppBar>
      <LoginModal open={open} handleClose={handleClose} />
    </>
  );
};

export default Header;
