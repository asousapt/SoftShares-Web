import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  Paper,
  Button
} from '@mui/material';
import DeleteButton from '../buttons/deleteButton';
import QuestionTypes from './QuestionTypes';
import Question from './Question';

const FormBuilder = forwardRef((props, ref) => {
  const { initialQuestions } = props;
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      const newQuestions = initialQuestions.map((question, index) => ({
        id: question.id || index + 1, 
        type: question.type || 'TEXTO',
        text: question.text || '',
        options: question.options || [],
        required: question.required || false,
        order: question.order || index + 1,
        minValue: question.minValue || 0,
        maxValue: question.maxValue || 0
      }));
      setQuestions(newQuestions);
    }
  }, [initialQuestions]);

  const addQuestion = (type) => {
    const newQuestion = {
      id: questions.length + 1,
      type: 'TEXTO',
      text: '',
      options: [],
      required: false,
      order: questions.length + 1,
      minValue: 0,
      maxValue: 0
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleTextChange = (id, field, value) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
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

  const handleRequiredChange = (id) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, required: !q.required } : q));
  };

  useImperativeHandle(ref, () => ({
    generateJSON() {
      const data = questions.map(q => ({
        id: q.id,
        type: q.type,
        text: q.text,
        options: q.options,
        required: q.required,
        order: q.order,
        minValue: parseFloat(q.minValue),
        maxValue: parseFloat(q.maxValue)
      })); 
      if (typeof props.onFormSubmit === 'function') {
        props.onFormSubmit(JSON.stringify(data));
      }
    }
  }));

  return (
    <div>
      <div>
        {questions.map((q) => (
          <Paper key={q.id} style={{ padding: '10px', margin: 5, marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', gap: 10, marginTop: 10 }}>
              <QuestionTypes onChange={handleTypeChange} idPergunta={q.id} valor={q.type} />
              <DeleteButton onclick={() => handleRemoveQuestion(q.id)} caption='Remover Pergunta'/>
            </div>
            
            <Question
              question={q}
              handleTextChange={handleTextChange}
              handleOptionChange={handleOptionChange}
              addOption={addOption}
              removeOption={removeOption}
              handleRequiredChange={handleRequiredChange}
            />
          </Paper>
        ))}
      </div>

      <Button variant="contained" color="primary" onClick={addQuestion}>
        Adicionar uma pergunta
      </Button>
    </div>
  );
});

export default FormBuilder;
