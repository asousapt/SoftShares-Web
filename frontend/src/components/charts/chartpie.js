import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

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
  const lines = React.Children.toArray(children).map((child, index) => (
    <tspan x={left + width / 2} dy={index === 0 ? 0 : "1.2em"} key={index}>
      {child}
    </tspan>
  ));
  return (
    <StyledText x={left + width / 2} y={top + height / 2.3}>
      {lines}
    </StyledText>
  );
}

export default function ChartPie({ chartData, total, label }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const coloredData = chartData.map((item, index) => {
      // Gera um número base e converte para hexadecimal
      const baseColor = ((index + 1) * 100000).toString(16).padStart(6, '0');
      // Divide a string em componentes R, G, B
      const r = parseInt(baseColor.substring(0, 2), 16);
      const g = parseInt(baseColor.substring(2, 4), 16);
      const b = parseInt(baseColor.substring(4, 6), 16);
      // Aplica um fator de escuridão
      const darkenFactor = 0.8;
      const darkR = Math.floor(r * darkenFactor).toString(16).padStart(2, '0');
      const darkG = Math.floor(g * darkenFactor).toString(16).padStart(2, '0');
      const darkB = Math.floor(b * darkenFactor).toString(16).padStart(2, '0');
      // Constrói a cor final em formato hexadecimal
      const darkColor = `#${darkR}${darkG}${darkB}`;
      return {
        ...item,
        color: darkColor,
      };
    });
    setData(coloredData);
  }, [chartData]);

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
      <Box sx={{ transform: 'translateX(50px)' }}>
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
          <PieCenterLabel>
            {label.split('\n').map((line, index) => (
              <tspan key={index} x={chartSize.width / 2.7} dy={index === 0 ? -20 : "1.2em"}>{line}</tspan>
            ))}
          </PieCenterLabel>
          <SecondLineText x={chartSize.width / 2.8} y={chartSize.height / 1.8}>
            {' '}
            {total}{' '}
          </SecondLineText>
        </PieChart>
      </Box>
      <Box mt={5} width={chartSize.width} textAlign="left" height={200} overflow="auto">
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
            {index < data.length - 1 && <Box height={0.01} bgcolor={`#ccc`} mb={2} />}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}
