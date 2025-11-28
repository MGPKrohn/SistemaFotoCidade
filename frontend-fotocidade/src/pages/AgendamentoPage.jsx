// /src/pages/AgendamentoPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import { 
    criarAgendamento, 
    buscarDatasAgendadas, 
    buscarAgendamentosPorData 
} from '../services/AgendamentoService';

// Função auxiliar para formatar datas no padrão YYYY-MM-DD
const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

function AgendamentoPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [datasAgendadas, setDatasAgendadas] = useState([]); // Set<String> de datas (YYYY-MM-DD)
    const [agendamentosDoDia, setAgendamentosDoDia] = useState([]);
    const [feedback, setFeedback] = useState('');
    const [loadingDates, setLoadingDates] = useState(true);

    // Estado do formulário refletindo a sua Model
    const [form, setForm] = useState({
        nomecliente: '',
        // Data e Hora de Início (Ex: 2025-11-27T10:00)
        horaInicio: formatDate(new Date()) + 'T10:00', 
        // Data e Hora de Fim (Ex: 2025-11-27T11:00)
        horaFim: formatDate(new Date()) + 'T11:00', 
        situacaoPagamento: false // Padrão: Não pago
    });

    // =========================================================
    // EFEITO: CARREGAR DATAS AGENDADAS (Para as bolinhas vermelhas)
    // =========================================================
    const fetchDatasAgendadas = useCallback(async () => {
        setLoadingDates(true);
        try {
            const datas = await buscarDatasAgendadas(); 
            setDatasAgendadas(datas);
        } catch (error) {
            console.error("Erro ao carregar datas agendadas:", error);
        } finally {
            setLoadingDates(false);
        }
    }, []);
    
    useEffect(() => {
        fetchDatasAgendadas();
    }, [fetchDatasAgendadas]);

    // =========================================================
    // EFEITO: CARREGAR AGENDAMENTOS DO DIA SELECIONADO
    // =========================================================
    const carregarAgendamentosDoDia = useCallback(async (data) => {
        const dataFormatada = formatDate(data);
        try {
            const agendamentos = await buscarAgendamentosPorData(dataFormatada);
            setAgendamentosDoDia(agendamentos);
        } catch (error) {
            setAgendamentosDoDia([]);
            // Este erro é comum se o backend estiver vazio, apenas logar.
            console.warn(`Nenhum agendamento para ${dataFormatada} encontrado.`);
        }
    }, []);
    
    // Dispara a carga sempre que a data selecionada mudar
    useEffect(() => {
        carregarAgendamentosDoDia(selectedDate);
    }, [selectedDate, carregarAgendamentosDoDia]);

    // =========================================================
    // LÓGICA DO CALENDÁRIO: MARCAÇÃO COM BOLINHA VERMELHA
    // =========================================================
    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateString = formatDate(date);
            // Verifica se a data atual (YYYY-MM-DD) está no Set<String> retornado pelo backend
            if (datasAgendadas.includes(dateString)) {
                return <div style={styles.dot}></div>; 
            }
        }
        return null;
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        // Atualiza a data do formulário para o dia selecionado
        const dataFormatada = formatDate(date);
        setForm(prevForm => ({
             ...prevForm,
             horaInicio: dataFormatada + prevForm.horaInicio.substring(10), // Mantém a hora
             horaFim: dataFormatada + prevForm.horaFim.substring(10) // Mantém a hora
        }));
    };


    // =========================================================
    // LÓGICA DO FORMULÁRIO
    // =========================================================
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ 
            ...form, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFeedback('');

        // 🚨 VALIDAÇÃO BÁSICA: O campo dataAgendamento é criado a partir do horaInicio/horaFim no submit
       const diaAgendamento = form.horaInicio.substring(0, 10);

try {
    const agendamentoParaAPI = {
        nomecliente: form.nomecliente,
        // Garante que o campo que o backend valida (dataAgendamento) está presente
        diaAgendamento: diaAgendamento, 
        horaInicio: form.horaInicio,
        horaFim: form.horaFim,
        situacaoPagamento: form.situacaoPagamento
    };

    // DEBUG: Logue o objeto antes de enviar para conferir a estrutura
    console.log("Payload enviado:", agendamentoParaAPI); 

    await criarAgendamento(agendamentoParaAPI);
            
            // Sucesso:
            setFeedback('✅ Agendamento criado com sucesso!');
            setForm(prevForm => ({ // Limpa o nome do cliente
                ...prevForm,
                nomecliente: '',
            }));
            
            // Recarrega os dados
            fetchDatasAgendadas();
            carregarAgendamentosDoDia(selectedDate);

        } catch (error) {
            setFeedback(`❌ Erro ao agendar: ${error.message}`);
        }
    };


  const formatTime = (localDateTimeData) => {
    // 1. Verifica se o dado é nulo, undefined ou se é um Array (típico de LocalDateTime)
    if (!localDateTimeData || !Array.isArray(localDateTimeData)) {
        return '';
    }

    // A hora é o 4º elemento (índice 3) e o minuto é o 5º elemento (índice 4)
    const hour = String(localDateTimeData[3]).padStart(2, '0');
    const minute = String(localDateTimeData[4]).padStart(2, '0');
    
    return `${hour}:${minute}`; 
};

    return (
        <div style={styles.container}>
            <h2>📅 Gestão de Agendamentos</h2>
            
            <div style={styles.layout}>
                
                {/* COLUNA DA ESQUERDA: CALENDÁRIO E LISTA DO DIA */}
                <div style={styles.calendarPanel}>
                    <h3>Selecione a Data</h3>
                    {loadingDates && <p>Carregando datas...</p>}
                    <Calendar 
                        onChange={handleDateChange}
                        value={selectedDate}
                        tileContent={tileContent}
                        locale="pt-BR"
                    />

                    <div style={styles.dailyAppointments}>
                        <h4>Agendamentos para {selectedDate.toLocaleDateString('pt-BR')}</h4>
                        {agendamentosDoDia.length > 0 ? (
                            agendamentosDoDia.map((ag, index) => (
                                <div key={index} style={styles.appointmentItem}>
                                    <p><strong>Cliente:</strong> {ag.nomecliente}</p>
                                    <p>
                                        {/* Use o operador de encadeamento opcional (?) se for React moderno */}
                                        <strong>Horário:</strong> {formatTime(ag.horaInicio)} - {formatTime(ag.horaFim)}
                                        
                                    </p>
                                    <p style={{ color: ag.situacaoPagamento ? 'green' : 'red' }}>
                                        Pagamento: {ag.situacaoPagamento ? 'Pago' : 'Pendente'}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p>Nenhum agendamento para este dia.</p>
                        )}
                    </div>
                </div>

                {/* COLUNA DA DIREITA: FORMULÁRIO DE CRIAÇÃO */}
                <div style={styles.formPanel}>
                    <h3>Novo Agendamento</h3>
                    <form onSubmit={handleFormSubmit}>
                        
                        <div>
                            <label>Data do Agendamento:</label>
                            <input 
                                type="date" 
                                name="diaAgendamento" // Nome do campo na Model
                                value={formatDate(selectedDate)} 
                                onChange={(e) => {
                                    const novaData = new Date(e.target.value);
                                    handleDateChange(novaData);
                                }
                                }
                                required
                                style={{ ...styles.input, marginTop: '5px', marginBottom: '15px' }}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label>Início (Data e Hora):</label>
                            <input 
                                type="datetime-local" 
                                name="horaInicio" // Nome do campo na Model
                                value={form.horaInicio} 
                                onChange={handleFormChange}
                                required
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label>Fim (Data e Hora):</label>
                            <input 
                                type="datetime-local" 
                                name="horaFim" // Nome do campo na Model
                                value={form.horaFim} 
                                onChange={handleFormChange}
                                required
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label>Nome do Cliente:</label>
                            <input 
                                type="text" 
                                name="nomecliente" // Nome do campo na Model
                                value={form.nomecliente} 
                                onChange={handleFormChange}
                                required
                                style={styles.input}
                            />
                        </div>

                        
                        <div style={styles.formGroup}>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="situacaoPagamento" // Nome do campo na Model
                                    checked={form.situacaoPagamento} 
                                    onChange={handleFormChange}
                                    style={{ marginRight: '10px' }}
                                />
                                Pagamento Confirmado (Situação Pagamento)
                            </label>
                        </div>


                        {feedback && (
                            <div style={{ color: feedback.startsWith('✅') ? 'green' : 'red', fontWeight: 'bold', margin: '15px 0' }}>
                                {feedback}
                            </div>
                        )}

                        <button type="submit" style={styles.buttonSubmit}>
                            Cadastrar Agendamento
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Estilos CSS-in-JS (Os mesmos do componente anterior)
const styles = {
    container: { padding: '40px', fontFamily: 'Arial, sans-serif' },
    layout: { display: 'flex', gap: '40px', marginTop: '20px' },
    calendarPanel: { flex: 1, minWidth: '400px' },
    formPanel: { flex: 1, padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' },
    dot: { 
        height: '6px', 
        width: '6px', 
        backgroundColor: 'red', 
        borderRadius: '50%', 
        display: 'block', 
        margin: '2px auto 0',
    },
    dailyAppointments: {
        marginTop: '30px',
        padding: '15px',
        border: '1px solid #eee',
        borderRadius: '5px',
        maxHeight: '300px',
        overflowY: 'auto'
    },
    appointmentItem: {
        borderBottom: '1px dashed #ddd',
        padding: '10px 0',
        marginBottom: '5px'
    },
    formGroup: { marginBottom: '15px' },
    input: { width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', marginTop: '5px' },
    buttonSubmit: { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' }
};

export default AgendamentoPage;