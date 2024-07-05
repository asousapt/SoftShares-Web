import React from 'react';
import {
  TextField,
  IconButton,
  Button,
  Radio,
  Checkbox,
  Switch,
  FormControlLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Question = ({ question, handleTextChange, handleOptionChange, addOption, removeOption, handleRequiredChange, disabled }) => {
  const renderOptions = () => {
    return question.options.map((opt, idx) => (
      <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
        {question.type === 'ESCOLHA_MULTIPLA' && (
          <Radio disabled />
        )}
        {question.type === 'SELECAO' && (
          <Checkbox disabled />
        )}
        <TextField
          value={opt}
          onChange={(e) => handleOptionChange(question.id, idx, e.target.value)}
          variant="outlined"
          size="small"
          style={{ marginRight: '10px', flex: 1 }}
          disabled={disabled}
        />
        {disabled === false && (<IconButton onClick={() => removeOption(question.id, idx)}>
          <DeleteIcon />
        </IconButton>)}
      </div>
    ));
  };

  const renderQuestionInput = () => {
    switch (question.type) {
      case 'TEXTO':
        return (
          <TextField
            placeholder="Texto de resposta curta"
            value={question.text}
            onChange={(e) => handleTextChange(question.id, 'text', e.target.value)}
            variant="outlined"
            fullWidth
            disabled={disabled}
          />
        );
      case 'LOGICO':
        return (
          <TextField
            placeholder="Texto do campo lógico"
            value={question.text}
            onChange={(e) => handleTextChange(question.id, 'text', e.target.value)}
            variant="outlined"
            fullWidth
            disabled={disabled}
          />
        );
      case 'ESCOLHA_MULTIPLA':
      case 'SELECAO':
        return (
          <>
            <TextField
              value={question.text}
              onChange={(e) => handleTextChange(question.id, 'text', e.target.value)}
              variant="outlined"
              fullWidth
              placeholder="Texto da pergunta"
              style={{ marginBottom: '10px' }}
              disabled={disabled}
            />
            {renderOptions()}
            {disabled === false && (<Button variant="contained" onClick={() => addOption(question.id)} style={{marginTop: 5, marginRight: 20}}>
              Adicionar opção
            </Button>)}
          </>
        );
      case 'NUMERICO':
        return (
          <>
            <TextField
              value={question.text}
              onChange={(e) => handleTextChange(question.id, 'text', e.target.value)}
              variant="outlined"
              fullWidth
              placeholder="Texto da pergunta"
              style={{ marginBottom: '10px' }}
              disabled={disabled}
            />
            <TextField
              label="Valor mínimo"
              type="number"
              value={question.minValue || ''}
              onChange={(e) => handleTextChange(question.id, 'minValue', e.target.value)}
              variant="outlined"
              style={{ marginRight: '10px', width: '48%' }}
              disabled={disabled}
            />
            <TextField
              label="Valor máximo"
              type="number"
              value={question.maxValue || ''}
              onChange={(e) => handleTextChange(question.id, 'maxValue', e.target.value)}
              variant="outlined"
              style={{ width: '48%' }}
              disabled={disabled}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {renderQuestionInput()}
      <FormControlLabel
        control={
          <Switch
            checked={question.required}
            onChange={() => handleRequiredChange(question.id)}
            color="primary"
            disabled={disabled}
          />
        }
        label="Obrigatório"
        style={{ marginTop: '10px' }}
      />
    </div>
  );
};

export default Question;
