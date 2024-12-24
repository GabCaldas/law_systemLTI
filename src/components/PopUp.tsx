import { X } from "lucide-react";

export const ProcessPopup = ({ process, onClose }) => {
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

export default ProcessPopup;