import { Search } from "lucide-react";

export const PersonCard = ({
  personKey,
  personData,
  displayedYears,
  status,
  onStatusChange
}) => {
  // Abrir link de consulta ao clicar no botão
  const handleConsultButtonClick = () => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(personKey)}`;
    window.open(searchUrl, "_blank");
  };

  // Manipulador para mudança de status
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    if (onStatusChange) {
      onStatusChange(personKey, newStatus);
    }
  };

  return (
    <div className="w-full md:w-1/4 bg-midnightGreen text-white p-6 rounded shadow-md">
      {/* Cabeçalho com chave e CPF */}
      <h2 className="text-sm text-center font-bold mb-4">
        <p className="text-lg">{personKey}</p>
        <p className="text-gray-200 text-xs opacity-50">
          CPF: {personData?.cpf || "Não disponível"}
        </p>
      </h2>

      {/* Vantagens por ano */}
      <div className="flex flex-col gap-2">
        {Object.keys(displayedYears)
          .sort((a, b) => b - a)
          .map((ano) => {
            const vantagens = displayedYears[ano]?.reduce(
              (total, mes) => total + (mes.vantagens || 0),
              0
            ) || 0;

            return (
              <div key={ano} className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    vantagens > 0 ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm">{ano}</span>
                  <span className="text-sm">
                    R$ {vantagens.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
      </div>

      {/* Seção de alteração de status */}
      <div className="text-center align-center mt-4">
        <p className="font-semibold text-white">Status</p>
        <select
          className="p-2 mt-2 rounded text-black w-full"
          value={status || ""}
          onChange={handleStatusChange}
        >
          <option value="">Selecione o Status</option>
          <option value="Não Contactado">Não Contactado</option>
          <option value="Contactado">Contactado</option>
          <option value="Em Andamento">Em Andamento</option>
          <option value="Rejeitou">Rejeitou</option>
        </select>
      </div>

      {/* Botão de consulta */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleConsultButtonClick}
          className="p-2 text-white flex mr-2 items-center gap-2 rounded border-solid border-2"
        >
          <Search size={16} />
          Consultar
        </button>
      </div>
    </div>
  );
};

export default PersonCard;