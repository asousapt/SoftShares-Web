import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';

export default function BasicLineChart() {
    const [chartData, setChartData] = useState({
        xAxis: [],
        series: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/thread/threadsmes`, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                const data = response.data.data;

                const xAxisData = Array.from({length: 12}, (_, i) => i + 1);
                const seriesData = Array(12).fill(0);

                data.forEach(item => {
                    const month = parseInt(item.mes);
                    const threads = parseInt(item.threads);
                    seriesData[month - 1] = threads;
                });

                setChartData({
                    xAxis: [{ data: xAxisData }],
                    series: [{ data: seriesData }],
                });
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <Typography variant="h6" component="div" >
                Publicações por Mês:
            </Typography>
            <LineChart
                xAxis={chartData.xAxis}
                series={chartData.series}
                width={500}
                height={300}
            />
        </div>
    );
}
