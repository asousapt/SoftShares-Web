import React from 'react';
import {
  TextField,
  Typography,
  IconButton,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  MenuItem,
  Select
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Question = ({ question, handleTextChange, handleOptionChange, addOption, removeOption }) => {
  const renderOptions = () => {
    return question.options.map((opt, idx) => (
      <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
        {question.type === 'multipleChoice' && (
          <Radio disabled />
        )}
        {question.type === 'checkboxes' && (
          <Checkbox disabled />
        )}
        <TextField
          value={opt}
          onChange={(e) => handleOptionChange(question.id, idx, e.target.value)}
          variant="outlined"
          size="small"
          style={{ marginRight: '10px', flex: 1 }}
        />
        <IconButton onClick={() => removeOption(question.id, idx)}>
          <DeleteIcon />
        </IconButton>
      </div>
    ));
  };

  const renderQuestionInput = () => {
    switch (question.type) {
      case 'shortAnswer':
        return (
          <TextField
            placeholder="Texto de resposta curta"
            value={question.text}
            onChange={(e) => handleTextChange(question.id, e.target.value)}
            variant="outlined"
            fullWidth
          />
        );
      case 'paragraph':
        return (
          <TextField
            placeholder="Parágrafo"
            value={question.text}
            onChange={(e) => handleTextChange(question.id, e.target.value)}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
          />
        );
      case 'multipleChoice':
      case 'checkboxes':
        return (
          <>
            <TextField
              value={question.text}
              onChange={(e) => handleTextChange(question.id, e.target.value)}
              variant="outlined"
              fullWidth
              placeholder="Texto da pergunta"
              style={{ marginBottom: '10px' }}
            />
            {renderOptions()}
            <Button variant="contained" onClick={() => addOption(question.id)}>
              Adicionar opção
            </Button>
          </>
        );
      // Adicione mais casos conforme necessário
      default:
        return null;
    }
  };

  return (
    <div>
      {renderQuestionInput()}
    </div>
  );
};

export default Question;
