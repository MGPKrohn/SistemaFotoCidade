// /src/services/AgendamentoService.js (AJUSTADO)

const API_BASE_URL = 'http://localhost:8080';

// 1. Cria um novo agendamento
export const criarAgendamento = async (agendamentoData) => {
    // agendamentoData deve conter: dataAgendamento, horaInicio, horaFim, nomecliente, situacaoPagamento
    const url = `${API_BASE_URL}/agendamento`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(agendamentoData)
    });

    if (!response.ok) {
        // Tenta ler a mensagem de erro do backend, se disponível
        const errorText = await response.text();
        throw new Error(errorText || 'Falha ao criar agendamento.');
    }
    return await response.json();
};

// 2. Busca todas as datas que possuem agendamentos (Endpoint /agendamento/datas retorna Set<String>)
export const buscarDatasAgendadas = async () => {
    const url = `${API_BASE_URL}/agendamento/datas`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Falha ao buscar datas agendadas.');
    }
    return await response.json();
};

// 3. Busca detalhes dos agendamentos para uma data específica
export const buscarAgendamentosPorData = async (data) => {
    // data deve estar no formato YYYY-MM-DD
    const url = `${API_BASE_URL}/agendamento/data/${data}`; 
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Falha ao buscar agendamentos por data.');
    }
    return await response.json();
};