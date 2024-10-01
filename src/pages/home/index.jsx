import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css'; // Importação do CSS Module
import api from '../../service/api';

function Home() {
  const inputName = useRef();
  const inputCpf = useRef();
  const inputEmail = useRef();
  const navigate = useNavigate();

  // Função para validar o e-mail
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Função para validar o nome (somente letras e espaços)
  function isValidName(name) {
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    return nameRegex.test(name);
  }

  // Função para validar o CPF no formato "123.456.789-12"
  function isValidCpf(cpf) {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(cpf);
  }

  async function createVoter() {
    const name = inputName.current.value;
    const cpf = inputCpf.current.value;
    const email = inputEmail.current.value;

    // Validações antes de enviar os dados
    if (!isValidName(name)) {
      alert('O nome deve conter apenas letras e espaços.');
      return;
    }

    if (!isValidCpf(cpf)) {
      alert('O CPF deve estar no formato correto: 123.456.789-12.');
      return;
    }

    if (!isValidEmail(email)) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    try {
      const response = await api.post('/', {
        name,
        cpf,
        email,
      });
      alert(response.data.message);

      // Limpar campos após o cadastro
      inputName.current.value = '';
      inputCpf.current.value = '';
      inputEmail.current.value = '';
    } catch (error) {
      console.error('Erro ao cadastrar eleitor:', error);
      if (error.response) {
        alert(error.response.data.error);
      } else {
        alert('Erro ao registrar eleitor.');
      }
    }
  }

  function handleVoteButton() {
    navigate('/vote');
  }

  return (
    <div className={styles.container}>
      <div className={styles.register}>
        <h1>
          Registro de <span>eleitor</span>
        </h1>
        <form>
          <input
            type="text"
            placeholder="Informe seu nome"
            ref={inputName}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Informe seu CPF (formato: 123.456.789-12)"
            ref={inputCpf}
            className={styles.input}
          />
          <input
            type="email"
            placeholder="Informe seu e-mail"
            ref={inputEmail}
            className={styles.input}
          />
          <div className={styles.buttons}>
            <button type="button" onClick={createVoter} className={styles.button}>
              Cadastrar
            </button>
            <button type="button" onClick={handleVoteButton} className={styles.button}>
              Votar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Home;
