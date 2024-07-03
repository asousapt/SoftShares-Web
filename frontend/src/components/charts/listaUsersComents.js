import React, { useEffect, useState } from 'react';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography, Box } from '@mui/material';
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
            width={250}
            height={250}
            overflow="auto"
        >
            <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
                Top Comentários por Utilizador:
            </Typography>
            <List>
                {users.map((user, index) => (
                    <ListItem key={index}>
                        <ListItemAvatar>
                            <Avatar src={user.image} alt={user.nome} />
                        </ListItemAvatar>
                        <ListItemText primary={user.nome} secondary={`${user.comentarios} comentários`} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

const ListUsers = () => {
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const fetchDataUsers = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/utilizadores/utilizadorescoment`, {
                    headers: {
                        Authorization: token
                    }
                });

                const users = await Promise.all(response.data.data.map(async (user) => {
                    if (user.image) {
                        const base64String = await getBase64FromUrl(user.image);
                        return { ...user, image: base64String };
                    } else {
                        return user;
                    }
                }));

                setUserData(users);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchDataUsers();
    }, []);

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

    return (
        <div>
            <UserList users={userData} />
        </div>
    );
};

export default ListUsers;
