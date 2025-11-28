import React, {useState, useEffect, useCallback} from "react";
import { useNavigate } from "react-router-dom";
import { criarProdutoEstoque } from "../services/EstoqueService";
import { atualizarProdutoEstoque } from "../services/EstoqueService";
import { listarTodosProdutos } from "../services/EstoqueService";

function EstoquePage() {
    const navigate = useNavigate();
    const [produtos, setProdutos] = useState([]);
    const [novoProduto, setNovoProduto] = useState({
        nomeProd: '',
        descricao: '',
        quantidade: 0,
        valorProd: 0.0
    });
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- Carregar Produtos do Estoque ---
    const carregarProdutos = useCallback(async () => {
        setLoading(true);
        try {
            const dadosEstoque = await listarTodosProdutos();
            setProdutos(dadosEstoque);
        } catch (err) {
            setFeedback('Erro ao carregar produtos do estoque.');
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        carregarProdutos();
    }, [carregarProdutos]);

    // --- Manipuladores de Formulário ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNovoProduto(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleCriarProduto = async (e) => {
    e.preventDefault();
    setFeedback(null);

    // 1. Tenta encontrar um produto existente pelo nomeProd
    const produtoExistente = produtos.find(
        (p) => p.nomeProd.toLowerCase() === novoProduto.nomeProd.toLowerCase()
    );

    if (produtoExistente) {
        // Lógica de SOMA/ATUALIZAÇÃO (PUT)
        
        // Converte a quantidade do formulário para número e soma
        const quantidadeParaSomar = Number(novoProduto.quantidade);
        const novaQuantidade = Number(produtoExistente.quantidade) + quantidadeParaSomar;

        try {
            // Prepara os dados de atualização. Assumindo que a API PUT espera o objeto completo
            const dadosAtualizados = {
                nomeProd: produtoExistente.nomeProd,
                descricao: produtoExistente.descricao,
                // A quantidade é o campo que queremos somar/atualizar
                quantidade: novaQuantidade, 
                valorProd: produtoExistente.valorProd,
            };
            
            await handleAtualizarProduto(produtoExistente.idEstoque, dadosAtualizados);
            setFeedback(`Quantidade do produto "${produtoExistente.nomeProd}" atualizada para ${novaQuantidade}!`);

        } catch (err) {
            setFeedback('Erro ao somar e atualizar produto.');
        }

    } else {
        // Lógica de CRIAÇÃO (POST)
        try {
            // Garante que quantidade e valorProd sejam convertidos para número antes de enviar
            const produtoParaEnviar = {
                ...novoProduto,
                quantidade: Number(novoProduto.quantidade),
                valorProd: Number(novoProduto.valorProd)
            };

            await criarProdutoEstoque(produtoParaEnviar);
            setFeedback('Produto criado com sucesso!');

        } catch (err) {
            setFeedback('Erro ao criar novo produto.');
        }
    }
    
    // Limpa o formulário e recarrega os dados (ou apenas limpa e atualiza o estado local)
    setNovoProduto({ nomeProd: '', descricao: '', quantidade: 0, valorProd: 0.0 });
    carregarProdutos(); // Garante que a lista esteja sincronizada com o backend
};
    const handleAtualizarProduto = async (idEstoque, updatedData) => {
        setFeedback(null);  
        try {
            await atualizarProdutoEstoque(idEstoque, updatedData);
            setFeedback('Produto atualizado com sucesso!');
            carregarProdutos();
        } catch (err) {
            setFeedback('Erro ao atualizar produto.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>📦 Gestão de Estoque</h2>
            {feedback && <div style={{ marginBottom: '15px', color: feedback.includes('Erro') ? 'red' : 'green' }}>{feedback}</div>}
            
            {/* Formulário para Criar Novo Produto */}
            <form onSubmit={handleCriarProduto} style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                <h3>Criar Novo Produto</h3>
                <input
                    type="text"
                    name="nomeProd"
                    placeholder="Nome do Produto"
                    value={novoProduto.nomeProd}
                    onChange={handleInputChange}
                    required
                    style={{ marginRight: '10px' }}
                />
                <input
                    type="text"
                    name="categoria"
                    placeholder="Categoria"
                    value={novoProduto.categoria}
                    onChange={handleInputChange}
                    required
                    style={{ marginRight: '10px' }}
                />
                <input
                    type="number"
                    name="quantidade"
                    placeholder="Quantidade"
                    value={novoProduto.quantidade}
                    onChange={handleInputChange}
                    required
                    style={{ marginRight: '10px', width: '100px' }}
                />
                <input
                    type="number"
                    name="valorProd"
                    placeholder="Preço"
                    step="0.01"
                    value={novoProduto.valorProd}
                    onChange={handleInputChange}
                    required
                    style={{ marginRight: '10px', width: '100px' }}
                />
                <button type="submit">Adicionar Produto</button>
            </form>
            {/* Lista de Produtos no Estoque */}
            {loading ? (
                <div>Carregando produtos...</div>
            ) : (
                <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Categoria</th>
                            <th>Quantidade</th>
                            <th>Preço</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.map(produto => (
                            <tr key={produto.idEstoque}>
                                <td>{produto.idEstoque}</td>
                                <td>{produto.nomeProd}</td>
                                <td>{produto.categoria}</td>
                                <td>{produto.quantidade}</td>
                                <td>R$ {produto.valorProd}</td>
                                <td>
                                    <button onClick={() => {  
                                        const novoNome = prompt('Novo nome:', produto.nomeProd);
                                        const novaCategoria = prompt('Nova categoria:', produto.categoria);
                                        const novaQuantidade = parseInt(prompt('Nova quantidade:', produto.quantidade), 10);
                                        const novoPreco = parseFloat(prompt('Novo preço:', produto.valorProd));
                                        if (novoNome && novaCategoria && !isNaN(novaQuantidade) && !isNaN(novoPreco)) {
                                            handleAtualizarProduto(produto.idEstoque, {
                                                nome: novoNome,
                                                categoria: novaCategoria,
                                                quantidade: novaQuantidade,
                                                preco: novoPreco
                                            });
                                        }
                                    }}>Editar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}


export default EstoquePage;