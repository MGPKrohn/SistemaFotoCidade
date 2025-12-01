import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram } from 'lucide-react';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={{ fontSize: '64px', marginBottom: '40px' }}>Foto Cidade</h1>
                
                <div style={{ display: 'flex', gap: '20px' }}>
                    <button onClick={() => navigate('/agendamentos')} className="btn-light">
                        Agendamento
                    </button>
                    <button onClick={() => navigate('/produtos')} className="btn-dark">
                        Produtos
                    </button>
                </div>
            </div>

            <div style={styles.footer}>
                <Instagram size={24} />
            </div>
        </div>
    );
};

const styles = {
    container: { height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F9F9' },
    content: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    footer: { position: 'absolute', bottom: '40px', left: '40px' }
};

export default HomePage;