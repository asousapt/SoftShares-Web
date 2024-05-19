import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Button,
  Box
} from '@mui/material';
import QuestionTypes from './QuestionTypes';
import Question from './Question';

const FormBuilder = () => {
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState(null);

  const addQuestion = (type) => {
    const newQuestion = {
      id: questions.length + 1,
      type,
      text: '',
      options: type === 'multipleChoice' ? ['Opção 1'] : [],
      required: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleTextChange = (id, text) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
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
      <Typography variant="h4" gutterBottom>Formulário sem título</Typography>
      <Typography variant="subtitle1" gutterBottom>Descrição do formulário</Typography>
      <QuestionTypes addQuestion={addQuestion} />
      <div>
        {questions.map((q) => (
          <Paper key={q.id} style={{ padding: '20px', marginBottom: '20px' }}>
            <Question
              question={q}
              handleTextChange={handleTextChange}
              handleOptionChange={handleOptionChange}
              addOption={addOption}
              removeOption={removeOption}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={q.required}
                  onChange={() => setQuestions(questions.map(quest => quest.id === q.id ? { ...quest, required: !quest.required } : quest))}
                />
              }
              label="Obrigatório"
            />
          </Paper>
        ))}
      </div>
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={generateJSON}>
          Gerar JSON
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
