import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import database from "../../public/database.json";
import Header from "../components/Header";
import "../timeline.css";

const firebaseConfig = {
  apiKey: "AIzaSyA2sa3XQcZcrdYO5FbZOAR7agHsi9YyisY",
  authDomain: "law-system-5ecbc.firebaseapp.com",
  projectId: "law-system-5ecbc",
  storageBucket: "law-system-5ecbc.firebasestorage.app",
  messagingSenderId: "33639626350",
  appId: "1:33639626350:web:d77fc5ac8320695608187f"
};

// Inicialização do Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);

const ProcessPopup = ({ process, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-xl font-bold mb-4 text-gray-800">Detalhes do Processo</h2>
        
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-gray-700">Unidade Gestora:</p>
            <p className="text-gray-600">{process.unidadeGestora}</p>
          </div>
          
          <div>
            <p className="font-semibold text-gray-700">Unidade Orçamentária:</p>
            <p className="text-gray-600">{process.unidadeOrcamentaria}</p>
          </div>
          
          <div>
            <p className="font-semibold text-gray-700">Tipo de Cargo:</p>
            <p className="text-gray-600">{process.tipoCargo}</p>
          </div>
          
          <div>
            <p className="font-semibold text-gray-700">Data de Admissão:</p>
            <p className="text-gray-600">
              {new Date(process.dataAdmissao).toLocaleDateString()}
            </p>
          </div>
          
          <div>
            <p className="font-semibold text-gray-700">Matrícula:</p>
            <p className="text-gray-600">{process.matricula}</p>
          </div>
          
          <div>
            <p className="font-semibold text-gray-700 mb-2">Vantagens:</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-600">
                R$ {process.vantagens.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MainPage = () => {
  const [prefeitura, setPrefeitura] = useState("");
  const [pessoas, setPessoas] = useState({});
  const [selectedPerson, setSelectedPerson] = useState("");
  const [filteredProcessos, setFilteredProcessos] = useState({});
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [statuses, setStatuses] = useState({});

  // Função para atualizar status no Firestore
  const updateStatusInFirestore = async (personKey, newStatus) => {
    try {
      const statusRef = doc(firestore, 'status', personKey);
      await setDoc(statusRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
        prefeitura: prefeitura
      });
      console.log("Status atualizado com sucesso no Firestore");
    } catch (error) {
      console.error("Erro ao atualizar status no Firestore:", error);
    }
  };

  // Função para buscar status do Firestore
  const fetchStatusFromFirestore = async (personKey) => {
    try {
      const statusRef = doc(firestore, 'status', personKey);
      const statusDoc = await getDoc(statusRef);
      if (statusDoc.exists()) {
        return statusDoc.data().status;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar status do Firestore:", error);
      return null;
    }
  };

  // Gerenciar mudança de status
  const handleStatusChange = async (personKey, newStatus) => {
    setStatuses(prev => ({
      ...prev,
      [personKey]: newStatus
    }));
    await updateStatusInFirestore(personKey, newStatus);
  };

  // Buscar todos os status quando pessoas mudam
  useEffect(() => {
    const fetchAllStatuses = async () => {
      const newStatuses = {};
      for (const personKey of Object.keys(pessoas)) {
        const status = await fetchStatusFromFirestore(personKey);
        if (status) {
          newStatuses[personKey] = status;
        }
      }
      setStatuses(newStatuses);
    };

    if (Object.keys(pessoas).length > 0) {
      fetchAllStatuses();
    }
  }, [pessoas]);

  useEffect(() => {
    if (!prefeitura && Object.keys(database).length > 0) {
      setPrefeitura(Object.keys(database)[0]);
    }
  }, [prefeitura]);

  useEffect(() => {
    if (prefeitura) {
      const fileName = database[prefeitura];
      fetch(fileName)
        .then((res) => res.json())
        .then((data) => {
          setPessoas(data);
          setSearchTerm("");
          setSelectedPerson("");
        })
        .catch((error) => console.error("Erro ao carregar o arquivo JSON:", error));
    }
  }, [prefeitura]);

  useEffect(() => {
    if (prefeitura) {
      const processos = {};
      const filteredPeople = Object.keys(pessoas).filter((person) =>
        person.toLowerCase().includes(searchTerm.toLowerCase())
      );

      filteredPeople.forEach((person) => {
        processos[person] = pessoas[person].anos || {};
      });

      setFilteredProcessos(processos);
      setCurrentPage(1);
    }
  }, [pessoas, prefeitura, searchTerm]);

  const getPagedPeople = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return Object.keys(filteredProcessos).slice(startIndex, endIndex);
  };

  const changePage = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="flex flex-col min-h-screen bg-darkWhite">
     <Header
        prefeitura={prefeitura}
        setPrefeitura={setPrefeitura}
        pessoas={pessoas}
        selectedPerson={selectedPerson}
        setSelectedPerson={setSelectedPerson}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />
      <main className={`flex ${selectedPerson ? "justify-center" : "flex-wrap"} gap-8 items-start mt-6 w-full max-w-7xl mx-auto flex-1`}>
        {(selectedPerson ? [selectedPerson] : getPagedPeople()).map((personKey) => {
          const personData = pessoas[personKey];

          const currentYear = new Date().getFullYear();
          const allYears = Array.from(
            { length: currentYear - 2019 + 1 },
            (_, i) => (2019 + i).toString()
          );

          const displayedYears = allYears.reduce((acc, year) => {
            if (personData && personData.anos) {
              acc[year] = personData.anos[year] || [];
            } else {
              acc[year] = [];
            }
            return acc;
          }, {});

          const handleConsultButtonClick = () => {
            const searchUrl = `https://www.google.com/search?q=${personKey}`;
            window.open(searchUrl, "_blank");
          };

          return (
            <div key={personKey} className="w-full min-h-10 flex flex-wrap md:flex-nowrap gap-8 justify-center mb-8">
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
                    value={statuses[personKey] || ""}
                    onChange={(e) => handleStatusChange(personKey, e.target.value)}
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
                          onClick={() => setSelectedProcess(processo)}
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

                {selectedProcess && (
                  <ProcessPopup
                    process={selectedProcess}
                    onClose={() => setSelectedProcess(null)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </main>

      <footer className="w-full bg-midnightGreen p-4 flex justify-center sticky bottom-0 shadow-md z-10">
        <div className="flex gap-4">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded bg-white text-green-700 hover:bg-gray-600"
          >
            Anterior
          </button>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={
              currentPage * itemsPerPage >= Object.keys(filteredProcessos).length
            }
            className="p-2 rounded  bg-white text-green-700 hover:bg-gray-600"
          >
            Próximo
          </button>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;