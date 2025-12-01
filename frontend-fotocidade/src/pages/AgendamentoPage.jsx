// /src/pages/AgendamentoPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importa estrutura base
import './Agendamento.css'; // Importa NOSSO estilo (Preto e Branco)
import { 
    criarAgendamento, 
    buscarDatasAgendadas, 
    buscarAgendamentosPorData 
} from '../services/AgendamentoService';

// Utilitários de Data
const formatDateToISO = (date) => date.toISOString().split('T')[0];

const formatTime = (timeData) => {
    // Lida com Array [H, M, S] ou String "HH:MM"
    if (Array.isArray(timeData)) {
        const h = String(timeData[3]).padStart(2, '0');
        const m = String(timeData[4]).padStart(2, '0');
        return `${h}:${m}`;
    }
    if (typeof timeData === 'string') {
        return timeData.split('T')[1]?.substring(0, 5) || '';
    }
    return '--:--';
};

const AgendamentoPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [datasAgendadas, setDatasAgendadas] = useState([]); 
    const [agendamentosDoDia, setAgendamentosDoDia] = useState([]);
    const [feedback, setFeedback] = useState('');

    // Estado do Formulário
    const [form, setForm] = useState({
        nomecliente: '',
        horaInicio: '09:00', // Apenas horário agora, data vem do calendário
        horaFim: '10:00',
        situacaoPagamento: false
    });

    // 1. Carregar Datas com Agendamentos (Bolinhas Vermelhas)
    const carregarDatasBloqueadas = useCallback(async () => {
        try {
            const datas = await buscarDatasAgendadas();
            setDatasAgendadas(datas);
        } catch (error) {
            console.error(error);
        }
    }, []);

    // 2. Carregar Lista do Dia
    const carregarDoDia = useCallback(async (date) => {
        const isoDate = formatDateToISO(date);
        try {
            const lista = await buscarAgendamentosPorData(isoDate);
            setAgendamentosDoDia(lista);
        } catch (error) {
            setAgendamentosDoDia([]);
        }
    }, []);

    useEffect(() => {
        carregarDatasBloqueadas();
    }, [carregarDatasBloqueadas]);

    useEffect(() => {
        carregarDoDia(selectedDate);
    }, [selectedDate, carregarDoDia]);

    // 3. Renderiza Bolinha Vermelha
    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const iso = formatDateToISO(date);
            if (datasAgendadas.includes(iso)) {
                return <div className="dot-indicator"></div>;
            }
        }
        return null;
    };

    // 4. Envio do Formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback('');

        const dateIso = formatDateToISO(selectedDate);
        
        // Monta o payload combinando a Data Selecionada + Horas dos inputs
        const payload = {
            nomecliente: form.nomecliente,
            diaAgendamento: dateIso,
            horaInicio: `${dateIso}T${form.horaInicio}`,
            horaFim: `${dateIso}T${form.horaFim}`,
            situacaoPagamento: form.situacaoPagamento
        };

        try {
            await criarAgendamento(payload);
            setFeedback('✅ Agendado com sucesso!');
            setForm({ ...form, nomecliente: '' }); // Limpa nome
            carregarDatasBloqueadas(); // Atualiza bolinhas
            carregarDoDia(selectedDate); // Atualiza lista
        } catch (error) {
            setFeedback('❌ Erro: ' + error.message);
        }
    };

    return (
        <div className="page-container">
            <h1 style={{ fontSize: '48px', marginBottom: '40px' }}>Agendamento</h1>

            <div style={styles.gridContainer}>
                
                {/* --- COLUNA ESQUERDA: Calendário e Lista --- */}
                <div style={styles.leftColumn}>
                    <div style={styles.card}>
                        <Calendar 
                            onChange={setSelectedDate} 
                            value={selectedDate} 
                            tileContent={tileContent}
                            locale="pt-BR"
                        />
                    </div>

                    <div style={{ ...styles.card, marginTop: '20px', flex: 1 }}>
                        <h3 style={{ marginBottom: '15px' }}>
                            {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </h3>
                        
                        {agendamentosDoDia.length === 0 ? (
                            <p style={{ color: '#999', fontStyle: 'italic' }}>Nenhum horário marcado.</p>
                        ) : (
                            <div style={styles.listContainer}>
                                {agendamentosDoDia.map((ag) => (
                                    <div key={ag.idAgendamento} style={styles.listItem}>
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{ag.nomecliente}</div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>
                                                {formatTime(ag.horaInicio)} - {formatTime(ag.horaFim)}
                                            </div>
                                        </div>
                                        <div style={{ 
                                            padding: '4px 8px', 
                                            borderRadius: '4px', 
                                            fontSize: '12px',
                                            backgroundColor: ag.situacaoPagamento ? '#d4edda' : '#fff3cd',
                                            color: ag.situacaoPagamento ? '#155724' : '#856404'
                                        }}>
                                            {ag.situacaoPagamento ? 'Pago' : 'Pendente'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* --- COLUNA DIREITA: Formulário Novo --- */}
                <div style={styles.rightColumn}>
                    <div style={{ ...styles.card, height: '100%' }}>
                        <h2 style={{ marginBottom: '20px' }}>Novo Agendamento</h2>
                        
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            
                            <div>
                                <label style={styles.label}>Cliente</label>
                                <input 
                                    style={styles.input}
                                    value={form.nomecliente}
                                    onChange={e => setForm({...form, nomecliente: e.target.value})}
                                    placeholder="Nome completo"
                                    required
                                />
                            </div>

                            <div>
                                <label style={styles.label}>Data Selecionada</label>
                                <input 
                                    type="text"
                                    style={styles.input}
                                    value={selectedDate.toLocaleDateString('pt-BR')}
                                    onChange={e => setForm({...form, diaAgendamento: e.target.value})}
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={styles.label}>Início</label>
                                    <input 
                                        type="time" 
                                        style={styles.input}
                                        value={form.horaInicio}
                                        onChange={e => setForm({...form, horaInicio: e.target.value})}
                                        required
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={styles.label}>Fim</label>
                                    <input 
                                        type="time" 
                                        style={styles.input}
                                        value={form.horaFim}
                                        onChange={e => setForm({...form, horaFim: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input 
                                    type="checkbox"
                                    id="pago"
                                    checked={form.situacaoPagamento}
                                    onChange={e => setForm({...form, situacaoPagamento: e.target.checked})}
                                    style={{ width: '20px', height: '20px' }}
                                />
                                <label htmlFor="pago" style={{ cursor: 'pointer', fontSize: '14px' }}>Pagamento Confirmado</label>
                            </div>

                            {feedback && <p style={{ fontWeight: 'bold' }}>{feedback}</p>}

                            <button type="submit" className="btn-dark" style={{ marginTop: '10px' }}>
                                Confirmar Agendamento
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Estilos específicos de layout
const styles = {
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr', // Divide a tela ao meio
        gap: '40px',
        alignItems: 'start'
    },
    leftColumn: {
        display: 'flex',
        flexDirection: 'column',
    },
    rightColumn: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)', // Sombra suave
        border: '1px solid #f0f0f0'
    },
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        borderBottom: '1px solid #eee'
    },
    label: {
        display: 'block',
        fontSize: '12px',
        fontWeight: 'bold',
        marginBottom: '8px',
        color: '#333'
    },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px',
        backgroundColor: '#f9f9f9',
        boxSizing: 'border-box'
    }
};

export default AgendamentoPage;