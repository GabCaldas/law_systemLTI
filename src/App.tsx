// src/App.tsx
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import Login from './pages/Login';
import MainPage from './pages/MainPage';
import ProtectedRoute from './pages/ProtectedRoute';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota de Login */}
        <Route path="/" element={<Login />} />

        {/* Rota de Cadastro */}
        <Route path="/register" element={<Register />} />

        {/* Rota protegida para a MainPage */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          } 
        />
      </Routes>

      {/* O ToastContainer é necessário para mostrar os toasts */}
      <ToastContainer />
    </Router>
  );
}

export default App;
