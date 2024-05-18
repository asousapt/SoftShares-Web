import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const data = [
  { value: 50, label: 'Viseu', color: '#7cb342' },
  { value: 25, label: 'Lisboa', color: '#ffca28' },
  { value: 15, label: 'Porto', color: '#ff7043' },
  { value: 10, label: 'Tomar', color: '#ab47bc' },
];

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
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      p={2}
      border={1} 
      borderRadius={2} 
      borderColor="#ccc"
      width={340}  // Tamanho da Box ajustado para acomodar o gráfico
      height={530}  // Mantém a altura da Box constante
    >
      <Box
        sx={{
          transform: 'translateX(40px)', // Move o gráfico 20px para a direita
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
        <SecondLineText x={chartSize.width / 2.8} y={chartSize.height / 1.8}>351</SecondLineText>
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
            {index < data.length - 1 && ( // Adiciona a linha entre os itens, exceto para o último item
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
