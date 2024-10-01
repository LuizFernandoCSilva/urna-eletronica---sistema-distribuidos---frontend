import { useRef, useState } from 'react';
import styles from './votacao.module.css'; // Importação do CSS Module
import api from '../../service/api';
import urnaSound from '../../sounds/Urna Eletrônica.mp3'; // Importa o som da urna

function Votar() {
  const candidate = useRef();
  const inputTitle = useRef();
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  function playSound() {
    const audio = new Audio(urnaSound); // Cria um novo objeto de áudio
    audio.play(); // Toca o som
  }

  // Função para validar se o valor é numérico
  function isNumeric(value) {
    return /^\d+$/.test(value);
  }

  async function createVote() {
    const candidateValue = candidate.current.value;
    const titleValue = inputTitle.current.value;

    // Validação para garantir que ambos os campos sejam numéricos
    if (!isNumeric(candidateValue)) {
      alert('O número do candidato deve conter apenas dígitos.');
      return;
    }

    if (!isNumeric(titleValue)) {
      alert('O título de eleitor deve conter apenas dígitos.');
      return;
    }

    try {
      const response = await api.post('/vote', {
        candidate_id: candidateValue,
        numTitle: titleValue,
      });

      setMessage(response.data.message);
      setError(false);
      
      // Chama a função playSound apenas se o voto for computado com sucesso
      playSound();

    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.error);
      } else {
        setMessage('Erro desconhecido ao tentar votar.');
      }
      setError(true);
    }

    // Limpa os campos de entrada
    candidate.current.value = '';
    inputTitle.current.value = '';

    // Reseta a mensagem após 4 segundos
    setTimeout(() => {
      setMessage('');
    }, 4000);
  }

  return (
    <div className={styles.container}>
      <div className={styles.register}>
        <h1>Votação</h1>
        <form>
          <input
            type="text" // Use "text" para capturar os números com a validação
            placeholder="Informe o número do seu candidato"
            ref={candidate}
            className={styles.input}
          />
          <input
            type="text" // Use "text" para capturar os números com a validação
            placeholder="Informe seu título de eleitor"
            ref={inputTitle}
            className={styles.input}
          />
          <button
            type="button"
            onClick={createVote} // Chama a função para votar
            className={styles.button}
          >
            Votar
          </button>
        </form>

        {message && (
          <div className={error ? styles.error : styles.success}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Votar;
