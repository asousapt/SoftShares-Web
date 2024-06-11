import React from 'react';
import { MenuItem, Select } from '@mui/material';

const QuestionTypes = ({ onChange, idPergunta, valor }) => {
  const questionTypes = [
    { type: 'TEXTO', label: 'Texto' },
    { type: 'LOGICO', label: 'Lógico' },
    { type: 'NUMERICO', label: 'Numérico' },
    { type: 'ESCOLHA_MULTIPLA', label: 'Escolha múltipla' },
    { type: 'SELECAO', label: 'Caixas de Seleção' }
  ];

  return (
    <Select
      defaultValue=""
      onChange={(e) => onChange(idPergunta, e.target.value)}
      style={{ marginBottom: '10px' }}
      value={valor}
    >
      <MenuItem value="" disabled>Adicionar pergunta</MenuItem>
      {questionTypes.map((qt) => (
        <MenuItem key={qt.type} value={qt.type}>
          {qt.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default QuestionTypes;
