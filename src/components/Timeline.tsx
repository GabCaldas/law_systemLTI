export const Timeline = ({ personData, onProcessClick }) => {
  return (
    <div className="flex-1 bg-midnight-green-light p-6 rounded shadow-md w-full md:w-3/4 overflow-x-auto">
      <ul className="timeline">
        {Object.keys(personData?.anos || {})
          .filter((ano) => parseInt(ano) >= 2019)
          .sort((a, b) => b - a)
          .map((ano) =>
            personData.anos[ano].map((processo, index) => (
              <li
                key={`${ano}-${index}`}
                className="mb-4 hover:shadow-lg transition-shadow"
                onClick={() => onProcessClick(processo)}
              >
                <div>
                  <time className="tempo" dateTime={processo.dataAdmissao}>
                    {new Date(processo.dataAdmissao).toLocaleDateString()}
                  </time>
                  <h2 className="unidOrc">
                    {processo.unidadeOrcamentaria}
                  </h2>
                </div>
              </li>
            ))
          )}
      </ul>
    </div>
  );
};
export default Timeline;