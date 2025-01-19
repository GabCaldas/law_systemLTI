import { Search } from "lucide-react"; // Importa o ícone de busca do Lucide React

export const PersonCard = ({
  personKey, // Chave única da pessoa (ex: nome ou identificador)
  personData, // Dados detalhados da pessoa
  displayedYears, // Anos com informações para exibição
  status, // Status atual da pessoa
  onStatusChange // Função callback para atualizar o status
}) => {
  // Função para abrir um link de consulta no Google com o `personKey`
  const handleConsultButtonClick = () => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(personKey)}`;
    window.open(searchUrl, "_blank"); // Abre a consulta em uma nova aba
  };

  // Função para tratar mudanças no status
  const handleStatusChange = (e) => {
    const newStatus = e.target.value; // Novo valor selecionado
    if (onStatusChange) {
      onStatusChange(personKey, newStatus); // Chama o callback para atualizar o status
    }
  };

  return (
    <div className="w-full md:w-1/4 bg-midnightGreen text-white p-6 rounded shadow-md">
      {/* Cabeçalho que exibe a chave e o CPF da pessoa */}
      <h2 className="text-sm text-center font-bold mb-4">
        <p className="text-lg">{personKey}</p>
        <p className="text-gray-200 text-xs opacity-50">
          CPF: {personData?.cpf || "Não disponível"} {/* Mostra o CPF, se disponível */}
        </p>
      </h2>

      {/* Exibição das vantagens acumuladas por ano */}
      <div className="flex flex-col gap-2">
        {/* Itera pelos anos em ordem decrescente */}
        {Object.keys(displayedYears)
          .sort((a, b) => b - a) // Ordena os anos em ordem decrescente
          .map((ano) => {
            // Calcula o total de vantagens para o ano atual
            const vantagens = 
              displayedYears[ano]?.reduce(
                (total, mes) => total + (mes.vantagens || 0), // Soma as vantagens de todos os meses
                0
              ) || 0;

            return (
              <div key={ano} className="flex items-center gap-2">
                {/* Indicador de cor com base nas vantagens */}
                <div
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    vantagens > 0 ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                {/* Exibição do ano e do total de vantagens */}
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm">{ano}</span>
                  <span className="text-sm">
                    R$ {vantagens.toFixed(2)} {/* Formata o valor das vantagens */}
                  </span>
                </div>
              </div>
            );
          })}
      </div>

      {/* Seção para alteração do status da pessoa */}
      <div className="text-center align-center mt-4">
        <p className="font-semibold text-white">Status</p>
        <select
          className="p-2 mt-2 rounded text-black w-full"
          value={status || ""} // Status selecionado no momento
          onChange={handleStatusChange} // Chama a função ao mudar o status
        >
          <option value="">Selecione o Status</option>
          <option value="Não Contactado">Não Contactado</option>
          <option value="Contactado">Contactado</option>
          <option value="Em Andamento">Em Andamento</option>
          <option value="Rejeitou">Rejeitou</option>
        </select>
      </div>

      {/* Botão para realizar consulta no Google */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleConsultButtonClick} // Chama a função ao clicar
          className="p-2 text-white flex mr-2 items-center gap-2 rounded border-solid border-2"
        >
          <Search size={16} /> {/* Ícone de busca */}
          Consultar
        </button>
      </div>
    </div>
  );
};

export default PersonCard;
