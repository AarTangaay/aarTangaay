import {
  Input,
  Button,
  Typography,
  Card,
  CardBody,
  CardHeader,
  Spinner
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { FiPhone, FiLock, FiAlertCircle, FiMail } from "react-icons/fi";
import { useContext, useState } from "react";
import AuthContext from "@/context/authContext";

export function SignIn() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
  email: "",
  password: ""
});

const { loginUser } = useContext(AuthContext);
  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(formData.email, formData.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl overflow-hidden">
        <CardHeader
          floated={false}
          className="bg-blue-600 flex items-center justify-center py-4 gap-2"
        >
          <img
            src="/img/logo-senegal.jpg"
            alt="Logo Sénégal"
            className="h-12"
          />
          <Typography variant="h5" color="white" className="font-bold">
            AarTangaay
          </Typography>
        </CardHeader>

        <CardBody className="p-8">
          <div className="text-center mb-8">
            <Typography variant="h5" className="font-bold text-blue-800">
              Se Connecter
            </Typography>
            <Typography variant="small" className="text-gray-600 mt-2">
              Rejoignez la plateforme de surveillance des vagues de chaleur
            </Typography>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-lg mb-4">
              <FiAlertCircle className="text-lg" />
              <Typography variant="small">{error}</Typography>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Typography variant="small" className="mb-2 block text-gray-700">
                Email
              </Typography>
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
            </div>

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
                  name="password"
                  size="lg"
                  placeholder="••••••••"
                  className="!border-gray-300 focus:!border-blue-500 pl-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 w-full flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Création du compte...
                </>
              ) : (
                "S'inscrire"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Typography variant="small" className="text-gray-600">
              Vous n'avez pas un compte ?{" "}
              <Link
                to="/auth/sign-up"
                className="font-medium text-blue-600 hover:underline"
              >
                Cree un compte
              </Link>
            </Typography>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default SignIn;
