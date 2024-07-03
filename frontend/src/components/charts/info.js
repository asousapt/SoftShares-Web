import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import axios from 'axios';

const ActivityCard = ({ title, subtitle, value }) => (
    <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <Box>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body2" color="textSecondary">
                {subtitle}
            </Typography>
        </Box>
        <Typography variant="h4">{value}</Typography>
    </Box>
);

const ActivityList = () => {
    const [activities, setActivities] = useState([
        { title: 'Total de Pontos Interesse', subtitle: 'Additional text goes here', value: 0 },
        { title: 'Total de Publicações', subtitle: 'Additional text goes here', value: 0 },
        { title: 'Total de Eventos', subtitle: 'Additional text goes here', value: 0 },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const [pontIntRes, pubsRes, eventosRes] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/pontointeresse/totalpontint`, {
                        headers: { Authorization: `${token}` },
                    }),
                    axios.get(`${process.env.REACT_APP_API_URL}/thread/totalpubs`, {
                        headers: { Authorization: `${token}` },
                    }),
                    axios.get(`${process.env.REACT_APP_API_URL}/evento/totaleventos`, {
                        headers: { Authorization: `${token}` },
                    }),
                ]);

                setActivities([
                    { title: 'Total de Pontos Interesse :', value: pontIntRes.data.data[0].pontointeresse },
                    { title: 'Total de Publicações :', value: pubsRes.data.data[0].threads },
                    { title: 'Total de Eventos :', value: eventosRes.data.data[0].eventos },
                ]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Box sx={{ width: '500px', height: '220px', border: '1px solid #ccc', borderRadius: 2, boxShadow: 2, p: 2 }}>
            {activities.map((activity, index) => (
                <React.Fragment key={index}>
                    <ActivityCard {...activity} />
                    {index < activities.length - 1 && <Divider />}
                </React.Fragment>
            ))}
        </Box>
    );
};

export default ActivityList;
