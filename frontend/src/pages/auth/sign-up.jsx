import {
  Input,
  Button,
  Typography,
  Card,
  CardBody,
  CardHeader,
  Spinner,
} from "@material-tailwind/react";
import { FiUser, FiPhone, FiMail, FiLock, FiUserCheck } from "react-icons/fi";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
// import AuthContext from "../../../context/Authcontext";
// import GoogleRegisterComponent from "../google/GoogleRegisterComponent";

export function SignUp() {
  const [formData, setFormData] = useState({
    nomComplet: "",
    numero: "",
    email: ""
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // const { registerMutation } = useContext(AuthContext);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   registerMutation.mutate(formData);
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex flex-col lg:flex-row items-center justify-center p-1 gap-8 overflow-auto">
    {/* Formulaire de création de compte */}
    <Card className="w-full max-w-md shadow-xl overflow-hidden">
      <CardHeader
        floated={false}
        className="bg-orange-600 flex flex-col items-center justify-center py-4 gap-2"
      >
        <img
          src="/img/logo-senegal.jpg"
          alt="Logo Sénégal"
          className="h-12 w-auto"
        />
        <Typography variant="h5" color="white" className="font-bold">
          AarTangaay
        </Typography>
      </CardHeader>

      <CardBody className="p-2   md:p-8">
        <div className="text-center mb-8">
          <Typography variant="h5" className="font-bold text-orange-800">
            Créer un compte
          </Typography>
        </div>

        <form className="space-y-6">
          {/* Nom complet */}
          <Input
            icon={<FiUser />}
            name="nomComplet"
            label="Nom complet"
            value={formData.nomComplet}
            onChange={handleChange}
            required
          />

          {/* Numéro téléphone */}
          <div>
            <Typography variant="small" className="mb-2 block text-gray-700">
              Numéro de téléphone
            </Typography>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiPhone className="text-gray-400" />
              </div>
              <Input
                size="lg"
                placeholder="7XXXXXXXX"
                className="!border-gray-300 focus:!border-orange-500 pl-10"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Typography variant="small" className="mb-2 block text-gray-700">
              Email
            </Typography>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <Input
                size="lg"
                placeholder="votre@email.com"
                className="!border-gray-300 focus:!border-orange-500 pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <Typography variant="small" className="mb-2 block text-gray-700">
              Mot de passe
            </Typography>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <Input
                type="password"
                size="lg"
                placeholder="••••••••"
                className="!border-gray-300 focus:!border-orange-500 pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Bouton */}
          <Button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 w-full flex items-center justify-center gap-2"
          >
            Créer un compte
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Typography variant="small" className="text-gray-600">
            Vous avez déjà un compte ?{" "}
            <Link
              to="/auth/sign-in"
              className="font-medium text-orange-600 hover:underline"
            >
              Se connecter
            </Link>
          </Typography>
        </div>
      </CardBody>
    </Card>

    {/* Image de droite visible uniquement sur écran large */}
    <div className="hidden lg:flex flex-col items-center w-[400px] max-w-sm">
      <img
        src="/img/heatwave-senegal.jpg"
        alt="Vague de chaleur au Sénégal"
        className="w-full h-auto max-h-[600px] rounded-3xl shadow-md object-cover"
      />
      <Typography variant="small" className="text-center text-gray-600 mt-2">
        Plateforme éducative intelligente
      </Typography>
    </div>
  </div>
);

}

export default SignUp;
