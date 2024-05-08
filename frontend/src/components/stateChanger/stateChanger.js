import * as React from 'react';


export default function State({ status }) {
    return (
        <div>
            {status === 'Ativo' ? (
                <div style={{
                        backgroundColor: '#1765E0', 
                        borderRadius: 24, 
                        textAlign: 'center', 
                        color: 'white',
                        margin: 5,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    Ativo
                </div>
            ) : (
                <div style={{
                        backgroundColor: '#EEF1F4', 
                        borderRadius: 24, 
                        textAlign: 'center', 
                        color: '#1765E0',
                        margin: 5,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    Inativo
                </div>
            )}
        </div>
    );
}