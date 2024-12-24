// pages/MainPage.jsx
import { initializeApp } from "firebase/app";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import database from "../../public/database.json";
import { auth } from "../auth/firebase.js";
import Header from "../components/Header";
import { Pagination } from "../components/Pagination";
import { PersonCard } from "../components/PersonCard";
import { ProcessPopup } from "../components/PopUp";
import { Timeline } from "../components/Timeline";
import "../timeline.css";

const firebaseConfig = {
  apiKey: "AIzaSyA2sa3XQcZcrdYO5FbZOAR7agHsi9YyisY",
  authDomain: "law-system-5ecbc.firebaseapp.com",
  projectId: "law-system-5ecbc",
  storageBucket: "law-system-5ecbc.firebasestorage.app",
  messagingSenderId: "33639626350",
  appId: "1:33639626350:web:d77fc5ac8320695608187f"
};

const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);

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

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Redireciona para a página de login se não estiver autenticado
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);


  // Firebase functions...
  const updateStatusInFirestore = async (cidade, personKey, newStatus) => {
    try {
      // Verifica se o status é válido
      if (!newStatus) {
        console.error("Status inválido:", newStatus);
        newStatus = "Não contactado";  // Define o status padrão
      }
  
      // A coleção será nomeada com a cidade, e o documento será o nome da pessoa
      const statusRef = doc(firestore, cidade, personKey);  // Usando a cidade como nome da coleção e o nome da pessoa como documento
      await setDoc(statusRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
        prefeitura: cidade
      });
      console.log("Status atualizado com sucesso no Firestore");
    } catch (error) {
      console.error("Erro ao atualizar status no Firestore:", error);
    }
  };
  
  useEffect(() => {
    if (!prefeitura) return;
  
    const unsubscribe = onSnapshot(
      collection(firestore, prefeitura),  // Escutando a coleção específica da cidade
      (snapshot) => {
        const updatedStatuses = {};
        snapshot.forEach(doc => {
          updatedStatuses[doc.id] = doc.data().status || "Não contactado";  // Define "Não contactado" se o status não existir
        });
        setStatuses(updatedStatuses);
      },
      (error) => {
        console.error("Erro ao ouvir alterações no Firestore:", error);
      }
    );
  
    return () => unsubscribe();
  }, [prefeitura]);
  
  
  
  const fetchStatusFromFirestore = async (cidade, personKey) => {
    try {
      const statusRef = doc(firestore, cidade, personKey);  // Agora a coleção é pela cidade e o documento é a pessoa
      const statusDoc = await getDoc(statusRef);
      if (statusDoc.exists()) {
        return statusDoc.data().status || "Não contactado";  // Retorna "Não contactado" se não houver status
      }
      return "Não contactado";  // Retorna "Não contactado" caso o status não exista
    } catch (error) {
      console.error("Erro ao buscar status do Firestore:", error);
      return "Não contactado";  // Se ocorrer erro, retorna "Não contactado"
    }
  };
  

  const handleStatusChange = async (personKey, newStatus) => {
    setStatuses(prev => ({
      ...prev,
      [personKey]: newStatus
    }));
    await updateStatusInFirestore(prefeitura, personKey, newStatus); // Passando o nome da cidade
  };
  

  // Effects...
  useEffect(() => {
    const fetchAllStatuses = async () => {
      const newStatuses = {};
      for (const personKey of Object.keys(pessoas)) {
        const status = await fetchStatusFromFirestore(prefeitura, personKey); // Passando o nome da cidade
        newStatuses[personKey] = status;
      }
      setStatuses(newStatuses);
    };
  
    if (Object.keys(pessoas).length > 0 && prefeitura) {
      fetchAllStatuses();
    }
  }, [pessoas, prefeitura]);
  

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

  const getCurrentYear = () => new Date().getFullYear();
  
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
