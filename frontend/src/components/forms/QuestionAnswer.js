import React, {useState, useEffect} from 'react';
import {
    TextField,
    Radio,
    Checkbox,
} from '@mui/material';

const QuestionAnswerer = ({ question, handleTextChange, handleOptionChange }) => {
    const [selectedOption, setSelectedOption] = useState(-1); 
    
    useEffect(() => {
        if (question.text !== '' && question.type === 'ESCOLHA_MULTIPLA') {
            const idx = question.options.findIndex(opt => opt.selected);
            setSelectedOption(idx !== -1 ? idx : -1);
        }
    }, [question]);

    const handleRadioChange = (idx) => {
        setSelectedOption(idx);
        handleOptionChange(question.id, idx, true); 
    };

    const renderOptions = () => {
        return question.options.map((opt, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                {question.type === 'ESCOLHA_MULTIPLA' && (
                    <Radio
                        checked={selectedOption === idx}
                        onChange={() => handleRadioChange(idx)}
                    />
                )}
                {question.type === 'SELECAO' && (
                    <Checkbox
                        checked={opt.selected}
                        onChange={(e) => handleOptionChange(question.id, idx, e.target.checked)}
                    />
                )}
                <TextField
                    value={opt.opcao}
                    variant="outlined"
                    size="small"
                    style={{ marginRight: '10px', flex: 1 }}
                    disabled={true}
                />
            </div>
        ));
    };
    const renderQuestionInput = () => {
        switch (question.type) {
            case 'TEXTO':
                return (
                    <TextField
                        placeholder="Resposta"
                        value={question.text}
                        onChange={(e) => handleTextChange(question.id, 'text', e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                );
            case 'LOGICO':
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Checkbox checked={question.text} onChange={(e) => handleTextChange(question.id, 'text', e.target.checked)} />
                        <TextField
                            value={question.label}
                            variant="outlined"
                            disabled={true}
                            fullWidth
                        />
                    </div>
                );
            case 'ESCOLHA_MULTIPLA':
            case 'SELECAO':
                return (
                    <>
                        {renderOptions()}
                    </>
                );
            case 'NUMERICO':
                return (
                    <TextField
                        placeholder="Resposta"
                        value={question.text}
                        onChange={(e) => handleTextChange(question.id, 'text', e.target.value)}
                        variant="outlined"
                        fullWidth
                        type='number'
                    />
                );
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

export default QuestionAnswerer;
