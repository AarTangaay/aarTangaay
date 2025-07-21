import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import APIURL from "../utils/apiUrl";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem("token");
    return stored ? JSON.parse(stored) : null;
  });

  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("token");
    try {
      return stored ? jwtDecode(JSON.parse(stored).token) : null;
    } catch (e) {
      console.error("Erreur de décodage du token :", e);
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Dans AuthProvider
    const registerUser = async (formData) => {
    try {
        const response = await fetch(`${APIURL}/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Erreur lors de l'inscription");

        Swal.fire("Inscription réussie 🎉", "Vous pouvez maintenant vous connecter", "success");
        navigate("/login"); // Redirection vers la page de connexion
    } catch (err) {
        Swal.fire("Erreur", err.message, "error");
    }
    };

  // ✅ Fonction de login avec fetch
  const loginUser = async (email, password) => {
    try {
      const response = await fetch(`${APIURL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Erreur de connexion");

      const tokenObject = { token: data.token };
      localStorage.setItem("token", JSON.stringify(tokenObject));
      setToken(tokenObject);
      setUser(jwtDecode(data.token));

      Swal.fire("Connexion réussie ✅", "", "success");
      navigate("/dashboard/home"); // Redirection vers la page d'accueil
    } catch (err) {
      Swal.fire("Erreur", err.message, "error");
    }
  };

  // ✅ Déconnexion
  const logoutUser = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    Swal.fire("Déconnecté 🫡", "", "success");
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser,registerUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
