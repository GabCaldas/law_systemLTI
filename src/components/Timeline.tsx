export const Timeline = ({ personData, onProcessClick }) => {
  return (
    <div className="flex-1 bg-midnight-green-light p-6 rounded shadow-md w-full md:w-3/4 overflow-x-auto">
      {/* Lista de elementos da timeline */}
      <ul className="timeline">
        {Object.keys(personData?.anos || {}) // Obtém os anos disponíveis em `personData.anos`
          .filter((ano) => parseInt(ano) >= 2019) // Filtra os anos maiores ou iguais a 2019
          .sort((a, b) => b - a) // Ordena os anos em ordem decrescente
          .map((ano) =>
            // Itera sobre cada processo do ano atual
            personData.anos[ano].map((processo, index) => (
              <li
                key={`${ano}-${index}`} // Gera uma chave única para cada item
                className="mb-4 hover:shadow-lg transition-shadow"
                onClick={() => onProcessClick(processo)} // Chama o callback ao clicar no item
              >
                <div>
                  {/* Exibe a data de admissão no formato local */}
                  <time className="tempo" dateTime={processo.dataAdmissao}>
                    {new Date(processo.dataAdmissao).toLocaleDateString()}
                  </time>
                  {/* Exibe a unidade orçamentária do processo */}
                  <h2 className="unidOrc">{processo.unidadeOrcamentaria}</h2>
                </div>
              </li>
            ))
          )}
      </ul>
    </div>
  );
};

export default Timeline;
