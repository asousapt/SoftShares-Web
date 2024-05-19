import React from 'react';
import { Button, MenuItem, Select } from '@mui/material';

const QuestionTypes = ({ addQuestion }) => {
  const questionTypes = [
    { type: 'shortAnswer', label: 'Resposta curta' },
    { type: 'paragraph', label: 'Parágrafo' },
    { type: 'multipleChoice', label: 'Escolha múltipla' },
    { type: 'checkboxes', label: 'Caixas de verificação' },
  ];

  return (
    <Select
      defaultValue=""
      displayEmpty
      onChange={(e) => addQuestion(e.target.value)}
      style={{ marginBottom: '20px' }}
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
