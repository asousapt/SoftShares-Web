import React, { useState } from 'react';

const Formulario = () => {
    
    const [campos, setCampos] = useState([]);

    const adicionarCampo = (tipo) => {
        setCampos([...campos, { tipo, valor: '' }]);
    };

    const removerCampo = (indice) => {
        const novosCampos = campos.filter((campo, index) => index !== indice);
        setCampos(novosCampos);
    };

    const atualizarValorCampo = (indice, valor) => {
        const novosCampos = [...campos];
        novosCampos[indice].valor = valor;
        setCampos(novosCampos);
    };

    const renderizarCampo = (campo, indice) => {
        switch (campo.tipo) {
            case 'combox':
                return (
                    <div key={indice}>
                        <select
                            value={campo.valor}
                            onChange={(e) => atualizarValorCampo(indice, e.target.value)}>
                            <option value="opcao1">Opção 1</option>
                            <option value="opcao2">Opção 2</option>
                            <option value="opcao3">Opção 3</option>
                        </select>
                        <button onClick={() => removerCampo(indice)}>Remover</button>
                    </div>
                );
            case 'checklist':
                return (
                    <div key={indice}>
                        <input
                            type="checkbox"
                            value="opcao1"
                            checked={campo.valor.includes('opcao1')}
                            onChange={(e) => {
                                const isChecked = e.target.checked;
                                const novoValor = isChecked
                                    ? [...campo.valor, 'opcao1']
                                    : campo.valor.filter((valor) => valor !== 'opcao1');
                                atualizarValorCampo(indice, novoValor);
                            }}
                        />
                        <label>Opção 1</label>
                        <input
                            type="checkbox"
                            value="opcao2"
                            checked={campo.valor.includes('opcao2')}
                            onChange={(e) => {
                                const isChecked = e.target.checked;
                                const novoValor = isChecked
                                    ? [...campo.valor, 'opcao2']
                                    : campo.valor.filter((valor) => valor !== 'opcao2');
                                atualizarValorCampo(indice, novoValor);
                            }}
                        />
                        <label>Opção 2</label>
                        <input
                            type="checkbox"
                            value="opcao3"
                            checked={campo.valor.includes('opcao3')}
                            onChange={(e) => {
                                const isChecked = e.target.checked;
                                const novoValor = isChecked
                                    ? [...campo.valor, 'opcao3']
                                    : campo.valor.filter((valor) => valor !== 'opcao3');
                                atualizarValorCampo(indice, novoValor);
                            }}
                        />
                        <label>Opção 3</label>
                        <button onClick={() => removerCampo(indice)}>Remover</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <button onClick={() => adicionarCampo('combox')}>Adicionar Combox</button>
            <button onClick={() => adicionarCampo('checklist')}>Adicionar Checklist</button>

            {campos.map((campo, indice) => (<div key={indice}>{renderizarCampo(campo, indice)}</div>))}

            <button>Enviar</button>
        </div>
    );
};

export default Formulario;
