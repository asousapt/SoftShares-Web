import React, { useEffect, useState } from 'react';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography, Box  } from '@mui/material';
import axios from 'axios';

const UserList = ({ users }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="left"
            p={2}
            border={1}
            borderRadius={2}
            borderColor="#ccc"
            width={340}
            height={530}
            overflow="auto"
        >
            <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
                Denúncias por Utilizador:
            </Typography>
            <List>
                {users.map((user, index) => (
                    <ListItem key={index}>
                        <ListItemAvatar>
                            <Avatar src={user.image} alt={user.name} />
                        </ListItemAvatar>
                        <ListItemText primary={user.name} secondary={`${user.complaints} denuncias`} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

const ListUsers = () => {
    const [userData, setUserData] = useState([]);
    const [userImage, setUserImage] = useState('');
    
    useEffect(() => {
        const fetchDataUsers = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/utilizadores/utilizadoresden`, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                const users = response.data.data.map(user => ({
                    name: user.nome,
                    complaints: user.denuncias,
                    image: user.image
                }));
                setUserData(users);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchDataUsers();
    }, []);

    return (
        <div>
            <UserList users={userData} />
        </div>
    );
};

export default ListUsers;
