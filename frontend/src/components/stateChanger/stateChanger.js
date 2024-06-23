import * as React from 'react';

export default function State({ status }) {
    let backgroundColor, textColor, text;

    switch (status) {
        case 'Ativo':
            backgroundColor = '#1765E0';
            textColor = 'white';
            text = 'Ativo';
            break;
        case 'Inativo':
            backgroundColor = '#EEF1F4';
            textColor = '#1765E0';
            text = 'Inativo';
            break;
        case 'Aprovado':
            backgroundColor = '#28A745';
            textColor = 'white';
            text = 'Aprovado';
            break;
        case 'Rejeitado':
            backgroundColor = '#DC3545';
            textColor = 'white';
            text = 'Rejeitado';
            break;
        case 'PorAprovar':
            backgroundColor = '#FFC107';
            textColor = 'white';
            text = 'Por Aprovar';
            break;
        default:
            backgroundColor = '#EEF1F4';
            textColor = '#1765E0';
            text = 'Desconhecido';
            break;
    }

    return (
        <div style={{
                backgroundColor,
                borderRadius: 24,
                textAlign: 'center',
                color: textColor,
                margin: 5,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
            }}
        >
            {text}
        </div>
    );
}
