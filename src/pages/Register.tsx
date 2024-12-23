import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../auth/firebase";

const Register = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const togglePasswordView = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordView = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Cadastro realizado com sucesso!");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Erro ao realizar cadastro.");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-[90%] max-w-sm md:max-w-md lg:max-w-md p-5 bg-midnightGreen flex-col flex items-center gap-3 rounded-xl shadow-slate-800 shadow-lg">
        <img src="/logo.png" alt="logo" className="w-12 md:w-14" />
        <h1 className="text-lg md:text-xl font-semibold text-white">Cadastro</h1>

        <form onSubmit={handleRegister} className="w-full flex flex-col gap-3">
          <div className="w-full flex items-center gap-2 bg-gray-700 p-2 rounded-xl">
            <MdAlternateEmail className="text-white" />
            <input
              type="email"
              placeholder="Email"
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="w-full flex items-center gap-2 bg-gray-700 p-2 rounded-xl relative">
            <FaFingerprint className="text-white" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {showPassword ? (
              <FaRegEyeSlash
                className="absolute right-5 cursor-pointer text-white"
                onClick={togglePasswordView}
              />
            ) : (
              <FaRegEye
                className="absolute right-5 cursor-pointer text-white"
                onClick={togglePasswordView}
              />
            )}
          </div>

          <div className="w-full flex items-center gap-2 bg-gray-700 p-2 rounded-xl relative">
            <FaFingerprint className="text-white" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirme a Senha"
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-white"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {showConfirmPassword ? (
              <FaRegEyeSlash
                className="absolute right-5 cursor-pointer text-white"
                onClick={toggleConfirmPasswordView}
              />
            ) : (
              <FaRegEye
                className="absolute right-5 cursor-pointer text-white"
                onClick={toggleConfirmPasswordView}
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-white rounded-xl mt-3 hover:bg-amber-100 text-sm md:text-base"
          >
            <p className="text-green-600">Cadastrar</p>
          </button>
        </form>

        <div className="relative w-full flex items-center justify-center py-3">
          <div className="w-2/5 h-[2px] bg-slate-200"></div>
          <h3 className="font-lora text-xs md:text-sm px-4 text-slate-200">
            Ou
          </h3>
          <div className="w-2/5 h-[2px] bg-slate-200"></div>
        </div>

        <p className="text-xs md:text-sm text-slate-200 text-center">
          Já tem uma conta? <Link to="/" className="text-white">Faça login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
