// Importações necessárias para inicializar o Firebase, manipular autenticação, banco de dados, e outros componentes.
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import database from "../../public/database.json";
import Header from "../components/Header";
import { Pagination } from "../components/Pagination";
import { PersonCard } from "../components/PersonCard";
import { ProcessPopup } from "../components/PopUp";
import { Timeline } from "../components/Timeline";
import "../timeline.css";

// Configuração do Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyA2sa3XQcZcrdYO5FbZOAR7agHsi9YyisY",
  authDomain: "law-system-5ecbc.firebaseapp.com",
  projectId: "law-system-5ecbc",
  storageBucket: "law-system-5ecbc.firebasestorage.app",
  messagingSenderId: "33639626350",
  appId: "1:33639626350:web:d77fc5ac8320695608187f"
};

// Inicialização do Firebase e serviços necessários.
const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

// Componente principal da página.
const MainPage = () => {
  // Estados para armazenar dados e gerenciar interações.
  const [prefeitura, setPrefeitura] = useState(""); // Cidade atual selecionada.
  const [pessoas, setPessoas] = useState({}); // Dados das pessoas da cidade.
  const [selectedPerson, setSelectedPerson] = useState(""); // Pessoa selecionada.
  const [filteredProcessos, setFilteredProcessos] = useState({}); // Processos filtrados.
  const [itemsPerPage, setItemsPerPage] = useState(20); // Itens por página para paginação.
  const [currentPage, setCurrentPage] = useState(1); // Página atual.
  const [searchTerm, setSearchTerm] = useState(""); // Termo de busca.
  const [selectedProcess, setSelectedProcess] = useState(null); // Processo selecionado para exibição.
  const [statuses, setStatuses] = useState({}); // Status de cada pessoa.

  const navigate = useNavigate(); // Navegação entre páginas.

  // Função para atualizar o Firestore quando o status de uma pessoa é alterado.
  const updateFirestoreOnStatusChange = async (city, personKey, personData, newStatus) => {
    try {
      const currentUser = auth.currentUser; // Usuário autenticado.
      if (!currentUser) {
        console.error("Nenhum usuário logado");
        return;
      }

      const documentData = {
        Nome: personKey,
        Cidade: city,
        Cpf: personData.cpf || "",
        Status: newStatus,
        "Atualizado por": currentUser.email,
        "Data da atualização": new Date().toLocaleString('pt-BR')
      };

      const personRef = doc(firestore, city, personKey);
      await setDoc(personRef, documentData, { merge: true }); // Atualização dos dados no Firestore.

      console.log(`Status atualizado para ${personKey} na cidade ${city}. Novo status: ${newStatus}`);
    } catch (error) {
      console.error(`Erro ao atualizar o Firestore para ${personKey} na cidade ${city}:`, error);
    }
  };

  // Hook para ouvir alterações no Firestore e atualizar os status em tempo real.
  useEffect(() => {
    if (!prefeitura) return;

    const unsubscribe = onSnapshot(
      collection(firestore, prefeitura),
      (snapshot) => {
        const updatedStatuses = {};
        snapshot.forEach(doc => {
          updatedStatuses[doc.id] = doc.data().Status || ""; // Atualização do estado com novos status.
        });
        setStatuses(updatedStatuses);
      },
      (error) => {
        console.error("Erro ao ouvir alterações no Firestore:", error);
      }
    );

    return () => unsubscribe();
  }, [prefeitura]);

  // Busca o status de uma pessoa específica no Firestore.
  const fetchStatusFromFirestore = async (cidade, personKey) => {
    try {
      const statusRef = doc(firestore, cidade, personKey);
      const statusDoc = await getDoc(statusRef);
      if (statusDoc.exists()) {
        return statusDoc.data().Status || "";
      }
      return "";
    } catch (error) {
      console.error("Erro ao buscar status do Firestore:", error);
      return "";
    }
  };

  // Função para manipular a mudança de status.
  const handleStatusChange = async (personKey, newStatus) => {
    const personData = pessoas[personKey];

    setStatuses((prev) => ({
      ...prev,
      [personKey]: newStatus,
    }));

    await updateFirestoreOnStatusChange(prefeitura, personKey, personData, newStatus);
  };

  // Hook para buscar todos os status no Firestore ao carregar os dados de pessoas.
  useEffect(() => {
    const fetchAllStatuses = async () => {
      const newStatuses = {};
      for (const personKey of Object.keys(pessoas)) {
        const status = await fetchStatusFromFirestore(prefeitura, personKey);
        newStatuses[personKey] = status;
      }
      setStatuses(newStatuses);
    };

    if (Object.keys(pessoas).length > 0 && prefeitura) {
      fetchAllStatuses();
    }
  }, [pessoas, prefeitura]);

  // Hook para carregar dados JSON baseados na cidade selecionada.
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

  // Hook para filtrar processos baseados no termo de busca.
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
      setCurrentPage(1); // Reinicia a paginação ao buscar.
    }
  }, [pessoas, prefeitura, searchTerm]);

  // Retorna os itens paginados.
  const getPagedPeople = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return Object.keys(filteredProcessos).slice(startIndex, endIndex);
  };

  // Obtém o ano atual.
  const getCurrentYear = () => new Date().getFullYear();

  // Gera os anos a serem exibidos para uma pessoa com base em seus dados.
  const getDisplayedYears = (personData) => {
    const currentYear = getCurrentYear();
    const allYears = Array.from(
      { length: currentYear - 2019 + 1 },
      (_, i) => (2019 + i).toString()
    );

    return allYears.reduce((acc, year) => {
      if (personData && personData.anos) {
        acc[year] = personData.anos[year] || [];
      } else {
        acc[year] = [];
      }
      return acc;
    }, {});
  };

  // Renderização do componente principal.
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
          const displayedYears = getDisplayedYears(personData);

          return (
            <div key={personKey} className="w-full min-h-10 flex flex-wrap md:flex-nowrap gap-8 justify-center mb-8">
              <PersonCard
                personKey={personKey}
                personData={personData}
                displayedYears={displayedYears}
                status={statuses[personKey]}
                onStatusChange={handleStatusChange}
              />

              <Timeline
                personData={personData}
                onProcessClick={setSelectedProcess}
              />
            </div>
          );
        })}
      </main>

      {selectedProcess && (
        <ProcessPopup
          process={selectedProcess}
          onClose={() => setSelectedProcess(null)}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalItems={Object.keys(filteredProcessos).length}
        itemsPerPage={itemsPerPage}
        onPageChange={(newPage) => setCurrentPage(newPage)}
      />
    </div>
  );
};

export default MainPage;
