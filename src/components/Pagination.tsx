export const Pagination = ({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange 
}) => {
  return (
    <footer className="w-full bg-midnightGreen p-4 flex justify-center sticky bottom-0 shadow-md z-10">
      <div className="flex gap-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded bg-white text-green-700 hover:bg-gray-600"
        >
          Anterior
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage * itemsPerPage >= totalItems}
          className="p-2 rounded bg-white text-green-700 hover:bg-gray-600"
        >
          Próximo
        </button>
      </div>
    </footer>
  );
};
