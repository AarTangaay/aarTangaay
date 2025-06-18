import {
  Input,
  Button,
  Typography,
  Card,
  CardBody,
  CardHeader,
} from "@material-tailwind/react";
import { FiUser, FiPhone, FiMail, FiLock } from "react-icons/fi";
import { useState } from "react";
import { Link } from "react-router-dom";

export function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col lg:flex-row">
      {/* Partie formulaire */}
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
            <form className="space-y-4">
               <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <Input
                  size="lg"
                  placeholder="Votre nom complet"
                  className="!border-gray-300 focus:!border-blue-500 pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

               <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="text-gray-400" />
                </div>
                <Input
                  size="lg"
                  placeholder="7XXXXXXXX"
                  className="!border-gray-300 focus:!border-blue-500 pl-10"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <Input
                  size="lg"
                  placeholder="email@domain.com"
                  className="!border-gray-300 focus:!border-blue-500 pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <Input
                  type="password"
                  size="lg"
                  placeholder="••••••••"
                  className="!border-gray-300 focus:!border-blue-500 pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 w-full mt-2"
              >
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
