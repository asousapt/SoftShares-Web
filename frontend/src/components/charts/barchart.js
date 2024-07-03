import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import Typography from '@mui/material/Typography';
import axios from 'axios';

const valueFormatter = (value) => `${value} threads`;

const chartSetting = {
    yAxis: [
        {
            label: 'Threads',
        },
    ],
    height: 300,
    sx: {
        [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
            transform: 'translateX(-10px)',
        },
    },
};

export default function TickPlacementBars() {
    const [dataset, setDataset] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/thread/threadscat`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                const data = response.data.data.map(item => ({
                    valor: item.valorpt,
                    seoul: parseInt(item.threads, 10),
                }));
                setDataset(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ width: '100%' }}>
            <Typography variant="h6" component="div" >
                Publicações por Categoria:
            </Typography>
            <BarChart
                dataset={dataset}
                xAxis={[
                    { scaleType: 'band', dataKey: 'valor'},
                ]}
                series={[{ dataKey: 'seoul', valueFormatter }]}
                {...chartSetting}
            />
        </div>
    );
}
