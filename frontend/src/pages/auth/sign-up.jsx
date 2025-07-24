import {
  Input,
  Button,
  Typography,
  Card,
  CardBody,
  CardHeader,
} from "@material-tailwind/react";
import { FiUser, FiPhone, FiMail, FiLock } from "react-icons/fi";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/authContext";
import Swal from "sweetalert2";

export function SignUp() {
  const [formData, setFormData] = useState({
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  password: "",
  role: "USER",
});

const { registerUser } = useContext(AuthContext);
  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser(formData); // appel de la fonction du contexte
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-2">
        <Card className="w-full max-w-md max-h-[95vh] overflow-auto shadow-none border border-gray-200">
          <CardHeader floated={false} shadow={false} className="text-center py-4">
            <Typography variant="h4" className="font-bold text-blue-800">
              Créer un compte
            </Typography>
            <Typography variant="small" className="text-gray-600">
              Rejoignez notre plateforme de surveillance
            </Typography>
          </CardHeader>

          <CardBody className="p-4 md:p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Nom de famille (last_name) */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <Input
                  size="lg"
                  name="last_name"
                  placeholder="Nom de famille"
                  className="!border-gray-300 focus:!border-blue-500 pl-10"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Prénom (first_name) */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <Input
                  size="lg"
                  name="first_name"
                  placeholder="Prénom"
                  className="!border-gray-300 focus:!border-blue-500 pl-10"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>

              {/* Téléphone */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="text-gray-400" />
                </div>
                <Input
                  size="lg"
                  name="phone_number"
                  placeholder="Téléphone (7XXXXXXXX)"
                  className="!border-gray-300 focus:!border-blue-500 pl-10"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <Input
                  type="email"
                  size="lg"
                  name="email"
                  placeholder="Adresse email"
                  className="!border-gray-300 focus:!border-blue-500 pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Mot de passe */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <Input
                  type="password"
                  size="lg"
                  name="password"
                  placeholder="••••••••"
                  className="!border-gray-300 focus:!border-blue-500 pl-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full mt-2">
                S'inscrire
              </Button>
            </form>

            <Typography variant="small" className="text-center mt-4 text-gray-600">
              Déjà inscrit ?{" "}
              <Link to="/auth/sign-in" className="text-blue-600 font-medium">
                Se connecter
              </Link>
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* Partie image */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 items-center justify-center p-6 overflow-hidden max-h-screen">
        <div className="text-center text-white max-w-md">
          <img
            src="/img/logo-senegal.jpg"
            alt="Logo Sénégal"
            className="h-20 mx-auto mb-4"
          />
          <Typography variant="h4" className="font-bold mb-2">
            Système d'Alerte Vagues de Chaleur
          </Typography>
          <Typography variant="lead" className="mb-6">
            Protégez votre communauté contre les risques climatiques
          </Typography>
          <img
            src="/img/heatwave-senegal.jpg"
            alt="Vague de chaleur"
            className="rounded-lg shadow-xl border-4 border-white max-h-[300px] object-cover w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default SignUp;
