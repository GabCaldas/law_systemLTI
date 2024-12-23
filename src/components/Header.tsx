import database from "../../public/database.json";
// Header Component
const Header = ({ 
  prefeitura, 
  setPrefeitura, 
  pessoas, 
  selectedPerson, 
  setSelectedPerson, 
  searchTerm, 
  setSearchTerm, 
  itemsPerPage, 
  setItemsPerPage
}) => {
  return (
    <header className="w-full bg-midnightGreen text-white p-4 flex justify-center">
      <div className="flex gap-4 items-center max-w-5xl w-full">
        <select
          className="flex-1 p-2 rounded bg-white text-gray-700"
          value={prefeitura}
          onChange={(e) => {
            setPrefeitura(e.target.value);
            setSelectedPerson("");
            setSearchTerm("");
          }}
        >
          <option value="">Selecione a Prefeitura</option>
          {Object.keys(database).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Buscar Funcionário"
          className="flex-1 p-2 rounded bg-white text-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={!prefeitura}
        />

        <select
          className="flex-1 p-2 rounded bg-white text-gray-700"
          value={selectedPerson}
          onChange={(e) => setSelectedPerson(e.target.value)}
          disabled={!prefeitura}
        >
          <option value="">Todas as Pessoas</option>
          {prefeitura &&
            Object.keys(pessoas).map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
        </select>

        <select
          className="flex-1 p-2 rounded bg-white text-gray-700"
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
        >
          <option value={20}>20 Itens</option>
          <option value={50}>50 Itens</option>
          <option value={100}>100 Itens</option>
        </select>
      </div>
    </header>
  );
};


export default Header;