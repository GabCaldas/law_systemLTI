import { signOut } from "firebase/auth"; // Importa a função de logout do Firebase Authentication
import { useEffect } from "react"; // Hook do React para gerenciar efeitos colaterais
import { useNavigate } from "react-router-dom"; // Hook para navegação entre páginas
import database from "../../public/database.json"; // Importa o arquivo JSON com dados das prefeituras
import { auth } from "../auth/firebase"; // Importa a instância de autenticação configurada

const Header = ({
  prefeitura, // Nome da prefeitura selecionada
  setPrefeitura, // Função para atualizar a prefeitura selecionada
  pessoas, // Lista de pessoas carregadas
  selectedPerson, // Pessoa selecionada no momento
  setSelectedPerson, // Função para alterar a pessoa selecionada
  searchTerm, // Termo de busca digitado pelo usuário
  setSearchTerm, // Função para atualizar o termo de busca
  itemsPerPage, // Número de itens exibidos por página
  setItemsPerPage // Função para alterar o número de itens por página
}) => {
  const navigate = useNavigate(); // Hook para redirecionamento entre páginas

  // Define uma prefeitura padrão ao montar o componente
  useEffect(() => {
    if (!prefeitura) {
      setPrefeitura("Alagoa Grande"); // Define "Alagoa Grande" como prefeitura padrão
    }
  }, [prefeitura, setPrefeitura]);

  // Função para realizar logout do usuário
  const handleLogout = () => {
    signOut(auth) // Chama a função de logout do Firebase
      .then(() => {
        navigate("/"); // Redireciona o usuário para a página inicial após o logout
      })
      .catch((error) => {
        console.error("Erro ao deslogar:", error); // Loga erros em caso de falha no logout
      });
  };

  return (
    <header className="w-full bg-midnightGreen text-white p-4 flex justify-center">
      <div className="flex gap-4 items-center max-w-5xl w-full">
        {/* Dropdown para seleção de prefeitura */}
        <select
          className="flex-1 p-2 rounded bg-white text-gray-700"
          value={prefeitura || "Alagoa Grande"}
          onChange={(e) => {
            setPrefeitura(e.target.value); // Atualiza a prefeitura selecionada
            setSelectedPerson(""); // Limpa a pessoa selecionada
            setSearchTerm(""); // Reseta o termo de busca
          }}
        >
          <option value="">Selecione a Prefeitura</option>
          {/* Popula o dropdown com as prefeituras disponíveis no arquivo JSON */}
          {Object.keys(database).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>

        {/* Campo de busca para filtrar pessoas */}
        <input
          type="text"
          placeholder="Buscar Funcionário"
          className="flex-1 p-2 rounded bg-white text-gray-700"
          value={searchTerm} // Termo de busca atual
          onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o termo de busca ao digitar
          disabled={!prefeitura} // Desativa o campo se nenhuma prefeitura estiver selecionada
        />

        {/* Dropdown para seleção de uma pessoa específica */}
        <select
          className="flex-1 p-2 rounded bg-white text-gray-700"
          value={selectedPerson} // Pessoa atualmente selecionada
          onChange={(e) => setSelectedPerson(e.target.value)} // Atualiza a pessoa selecionada
          disabled={!prefeitura} // Desativa o campo se nenhuma prefeitura estiver selecionada
        >
          <option value="">Todas as Pessoas</option>
          {/* Popula o dropdown com as pessoas disponíveis */}
          {prefeitura &&
            Object.keys(pessoas).map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
        </select>

        {/* Dropdown para alterar o número de itens exibidos por página */}
        <select
          className="flex-1 p-2 rounded bg-white text-gray-700"
          value={itemsPerPage} // Número atual de itens por página
          onChange={(e) => setItemsPerPage(Number(e.target.value))} // Atualiza o número de itens por página
        >
          <option value={20}>20 Itens</option>
          <option value={50}>50 Itens</option>
          <option value={100}>100 Itens</option>
        </select>
      </div>

      {/* Botão para logout */}
      <button
        className="px-5 py-1 ml-5 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={handleLogout} // Chama a função de logout ao clicar
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
