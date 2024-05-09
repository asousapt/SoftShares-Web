import React, { useState, useEffect } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './header.css'

export default function Header({caption}){
    return(
    <div className="header">
        <h1 className="title">{caption}</h1>
        <div className="user-options">
            <NotificationsIcon /* onClick={handleNotificationsClick} */ style={{color: 'white'}} />
            <AccountCircleIcon /* onClick={handleAccountClick} */ style={{color: 'white'}} />
        </div>
    </div>
    );
}