import { useRef, useState } from 'react';
import styles from './results.module.css'; // Importação correta do CSS como módulo
import api from '../../service/api';

function Resultado() {
  const [resultado, setResultado] = useState([]);
  const candidateIdRef = useRef(null);

  // Função para buscar resultados
  async function getResults() {
    const candidateId = candidateIdRef.current.value;

    try {
        let response;

        if (candidateId) {
            // Se um candidate_id foi fornecido, buscar resultado específico
            response = await api.get(`/results/${candidateId}`);
            
            console.log('Resposta do backend:', response.data); // Log da resposta
            // Verifique se a resposta é um objeto e se possui a propriedade candidate_id
            if (response.data && response.data.candidate_id) {
                // Aqui, setamos o resultado diretamente como um array com um único objeto
                setResultado([response.data]); 
            } else {
                setResultado([]); // Atualiza para garantir que o array está vazio
                alert('Nenhum resultado encontrado.');
            }
        } else {
            // Se não, buscar resultados de todos os candidatos
            response = await api.get('/results');
            
            console.log('Resposta do backend:', response.data); // Log da resposta

            // Aqui, você precisa acessar results
            const results = response.data.results || []; // Usa um array vazio se results não existir

            console.log('Tipo da resposta:', Array.isArray(results)); // Verifica se é um array
            console.log('Tamanho da resposta:', results.length); // Verifica o tamanho

            if (Array.isArray(results) && results.length > 0) {
                setResultado(results);
            } else {
                setResultado([]); // Nenhum resultado encontrado
                alert('Nenhum resultado encontrado.');
            }
        }
    } catch (error) {
        console.error('Erro ao buscar resultados:', error);
        alert('Erro ao buscar resultados. Tente novamente.');
    }
}

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Resultados</h1>

      <input
        ref={candidateIdRef}
        type="text"
        placeholder="Buscar quantidade de votos por candidato"
        className={styles.input}
      />

      <button onClick={getResults} className={styles.button}>
        Buscar
      </button>

      <div className={styles.resultContainer}>
        {resultado.length > 0 ? (
          <ul className={styles.list}>
            {resultado.map((res, index) => (
              <li key={index} className={styles.listItem}>
                <span className={styles.votesCount}>{res.votes} votos</span>  - Candidato {res.candidate_id}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noResults}>Nenhum resultado encontrado.</p>
        )}
      </div>
    </div>
  );
}

export default Resultado;
