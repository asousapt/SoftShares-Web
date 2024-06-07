import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box
} from '@mui/material';
import DeleteButton from '../buttons/deleteButton';
import DeleteIcon from '@mui/icons-material/Delete';
import QuestionTypes from './QuestionTypes';
import Question from './Question';

const FormBuilder = () => {
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState(null);

  const addQuestion = (type) => {
    const newQuestion = {
      id: questions.length + 1,
      type: 'shortAnswer',
      text: '',
      options: [],
      required: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleTextChange = (id, text) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
  };

  const handleTypeChange = (id, type) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, type, options: type === 'multipleChoice' ? [] : q.options } : q));
  };

  const handleOptionChange = (id, optionIndex, optionText) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        const options = q.options.map((opt, idx) => idx === optionIndex ? optionText : opt);
        return { ...q, options };
      }
      return q;
    }));
  };

  const addOption = (id) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, options: [...q.options, `Opção ${q.options.length + 1}`] } : q));
  };

  const removeOption = (id, optionIndex) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        const options = q.options.filter((opt, idx) => idx !== optionIndex);
        return { ...q, options };
      }
      return q;
    }));
  };

  const handleRemoveQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const generateJSON = () => {
    const data = questions.map(q => ({
      id: q.id,
      type: q.type,
      text: q.text,
      options: q.options,
      required: q.required
    }));
    setFormData(JSON.stringify(data, null, 2));
  };

  return (
    <Container>
      <div>
        {questions.map((q) => (
          <Paper key={q.id} style={{ padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: 10 }}>
              <QuestionTypes onChange={handleTypeChange} idPergunta={q.id} valor={q.type} />
              <DeleteButton onclick={() => handleRemoveQuestion(q.id)} caption='Remover Pergunta'/>
            </div>
            
            <Question
              question={q}
              handleTextChange={handleTextChange}
              handleOptionChange={handleOptionChange}
              addOption={addOption}
              removeOption={removeOption}
            />
          </Paper>
        ))}
      </div>
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={generateJSON}>
          Gerar JSON
        </Button>
        <Button variant="contained" color="primary" onClick={addQuestion}>
          Adicionar uma pergunta
        </Button>
      </Box>
      {formData && (
        <Box mt={2}>
          <Typography variant="h6">JSON Gerado:</Typography>
          <pre>{formData}</pre>
        </Box>
      )}
    </Container>
  );
};

export default FormBuilder;
