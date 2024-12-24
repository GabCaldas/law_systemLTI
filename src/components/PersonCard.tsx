import { Search } from "lucide-react";

export const PersonCard = ({ 
  personKey, 
  personData, 
  displayedYears, 
  status, 
  onStatusChange 
}) => {
  const handleConsultButtonClick = () => {
    const searchUrl = `https://www.google.com/search?q=${personKey}`;
    window.open(searchUrl, "_blank");
  };

  return (
    <div className="w-full md:w-1/4 bg-midnightGreen text-white p-6 rounded shadow-md">
      <h2 className="text-sm text-center font-bold mb-4">
        <p className="text-lg">{personKey}</p>
        <p className="text-gray-200 text-xs opacity-50">
          CPF: {personData?.cpf}
        </p>
      </h2>
      <div className="flex flex-col gap-2">
        {Object.keys(displayedYears)
          .sort((a, b) => b - a)
          .map((ano) => {
            const vantagens =
              displayedYears[ano].reduce(
                (total, mes) => total + mes.vantagens,
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
      <div className="text-center">
        <p className="font-semibold text-white">Status</p>
        <select
          className="p-2 mt-2 rounded text-black w-full"
          value={status || ""}
          onChange={(e) => onStatusChange(personKey, e.target.value)}
        >
          <option value="">Selecione o Status</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
          <option value="ausente">Ausente</option>
        </select>
      </div>

      <div className="items-center">
        <button
          onClick={handleConsultButtonClick}
          className="p-2 mt-4 text-white flex items-center gap-2"
        >
          <Search size={16} />
          Consultar
        </button>
      </div>
    </div>
  );
};

export default PersonCard;