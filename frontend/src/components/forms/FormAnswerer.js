import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Paper, Typography } from '@mui/material';
import QuestionAnswerer from './QuestionAnswer';

const FormAnswerer = forwardRef((props, ref) => {
    const { initialQuestions, disabled = false } = props;
    const [questions, setQuestions] = useState([]);
    console.log(initialQuestions);

    useEffect(() => {
        if (initialQuestions && initialQuestions.length >= 0) {
            const newQuestions = initialQuestions.map((question, index) => ({
                id: question.id || index + 1, 
                type: question.type || 'TEXTO',
                label: question.label || '',
                text: question.text || '',
                options: question.options || [{}],
                required: question.required || false,
                minValue: question.minValue || 0,
                maxValue: question.maxValue || 0,
                error: question.error || ''
            }));
            setQuestions(newQuestions);
        }
    }, [initialQuestions]);

    const handleTextChange = (id, field, value) => {
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    const handleOptionChange = (id, optionIndex, isChecked) => {
        setQuestions(prev => prev.map(q => {
            if (q.id === id) {
                let updatedOptions;
                if (q.type === 'ESCOLHA_MULTIPLA') {
                    updatedOptions = q.options.map((opt, idx) => ({
                        ...opt,
                        selected: idx === optionIndex ? isChecked : false
                    }));
                } else if (q.type === 'SELECAO') {
                    updatedOptions = q.options.map((opt, idx) => ({
                        ...opt,
                        selected: idx === optionIndex ? isChecked : opt.selected,
                    }));
                }
                return { ...q, options: updatedOptions };
            }
            return { ...q };
        }));
    };

    useImperativeHandle(ref, () => ({
        generateJSON() {
            let isValid = true;
            const errors = [];

            questions.forEach((question, index) => {
                if (question.required === true && !question.text.trim() && question.type === 'NUMERICO') {
                    isValid = false;
                    errors.push({ id: question.id, message: 'Este campo é obrigatório' });
                }
                if (question.type === 'NUMERICO') {
                    const value = parseFloat(question.text) || 0;
                    const max = parseFloat(question.maxValue);
                    const min = parseFloat(question.minValue);
                    if ((max === 0 && min === 0)|| (min === null && max === null)){
                    } else if (value < min || value > max) {
                        isValid = false;
                        errors.push({ id: question.id, message: `Este valor tem de estar entre ${min} e ${max}` });
                    }
                }
                if (question.type === 'ESCOLHA_MULTIPLA' && question.required === true) {
                    console.log('teste',question.options);
                    const selectedOptions = question.options.filter(opt => opt.selected);
                    if (selectedOptions.length !== 1) {
                        isValid = false;
                        errors.push({ id: question.id, message: 'Selecione uma opção' });
                    }
                }
                if (question.type === 'SELECAO' && question.required === true) {
                    const selectedOptions = question.options.filter(opt => opt.selected);
                    if (selectedOptions.length === 0) {
                        isValid = false;
                        errors.push({ id: question.id, message: 'Selecione pelo menos uma opção' });
                    }
                }
            });

            const data = questions.map(q => ({
                id: q.id,
                type: q.type,
                text: q.text,
                options: q.options,
                required: q.required,
                minValue: parseFloat(q.minValue),
                maxValue: parseFloat(q.maxValue)
            })); 

            if (!isValid) {
                props.onFormSubmit(JSON.stringify(data), errors);
                return;
            }

            if (typeof props.onFormSubmit === 'function') {
                props.onFormSubmit(JSON.stringify(data), null);
            }
        }
    }));

    return (
        <div>
            {questions.map(q => (
                <Paper key={q.id} style={{ padding: '10px', margin: 5, marginBottom: '20px' }}>
                    <Typography variant="h6">{q.label}</Typography>
                    <QuestionAnswerer
                        question={q}
                        handleTextChange={handleTextChange}
                        handleOptionChange={handleOptionChange}
                        disabled={disabled}
                    />
                    {q.error && <Typography color="error">{q.error}</Typography>}
                </Paper>
            ))}
        </div>
    );
});

export default FormAnswerer;
