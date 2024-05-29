import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// const data = [
//   { value: 26 , label: 'Viseu' },
//   { value: 25, label: 'Lisboa' },
//   { value: 15, label: 'Porto' },
//   { value: 10, label: 'Tomar'},
// ];

const chartSize = {
  width: 340,  
  height: 300, 
};

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
}));

const SecondLineText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 48,
  fontWeight: 'bold',
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2.3}>
      {children}
    </StyledText>
  );
}

export default function ChartPieUsers() {
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
        try {
            const token = 'tokenFixo';
  
            const polosResponse = await axios.get('http://localhost:8000/utilizadores/totalpolo', {
                headers: {
                    Authorization: `${token}`
                }
            });
            const polosCount = polosResponse.data.data;
            console.log(polosCount);
            
            setTotal(polosCount.reduce((acc, polo) => acc + parseFloat(polo.value), 0));
            console.log(total);
              const formattedData = polosCount.map((polo) => ({
                value: Math.round((parseFloat(polo.value) / parseFloat(total)) * 100),
                label: polo.label
              }));
            
              setData(formattedData);
        } catch (error) {
            setError(error);
        }
    };
  
    fetchData();
  }, [total]);

  useEffect(() => {
    console.log('data:', data);
  }, [data]); 

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      p={2}
      border={1} 
      borderRadius={2} 
      borderColor="#ccc"
      width={340}
      height={530}  
    >
      <Box
        sx={{
          transform: 'translateX(50px)',
        }}
      >
      
      <PieChart
        series={[{ data, innerRadius: 80, outerRadius: 120, colors: data.map(d => d.color) }]}
        width={chartSize.width}
        height={chartSize.height}
        slotProps={{
          legend: {
            hidden: true,
          },
        }}
      >
        <PieCenterLabel>Utilizadores</PieCenterLabel>
        <SecondLineText x={chartSize.width / 2.8} y={chartSize.height / 1.8}> {total} </SecondLineText>
      </PieChart>
      </Box>
      <Box mt={5} width={chartSize.width} textAlign="left">
        {data.map((item, index) => (
          <React.Fragment key={item.label}>
            <Box key={item.label} display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
              <Box display="flex" alignItems="center">
                <Box width={12} height={12} bgcolor={item.color} borderRadius="50%" mr={1} />
                <Typography variant="body1" mr={2}>
                  {item.label}
                </Typography>
              </Box>
              <Typography variant="body1">{item.value}%</Typography>
            </Box>
            {index < data.length - 1 && (
              <Box
                height={0.01}
                bgcolor={`#ccc`} // 80 significa 50% de opacidade
                mb={2}
              />
            )}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}
