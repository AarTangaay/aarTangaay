import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Avatar,
  Button,
  IconButton,
  Input,
  Textarea,
  Select,
  Option,
  Tooltip,
  Chip
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  LockClosedIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  FireIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/solid";

export function Profile() {
  const [editMode, setEditMode] = React.useState(false);
  const [userData, setUserData] = React.useState({
    fullName: "Omar Diop",
    phone: "+221 77 123 45 67",
    email: "omar.diop@example.com",
    address: {
      street: "123 Rue de la Canicule",
      city: "Dakar",
      postalCode: "12500",
      region: "Dakar"
    },
    role: "Responsable Régional",
    status: "Actif"
  });

  const regions = ["Dakar", "Thiès", "Saint-Louis", "Ziguinchor", "Matam"];
  const alertStats = {
    alertsIssued: 24,
    regionsCovered: 5,
    responseRate: "92%"
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-4 md:p-8">
      {/* Header with Alert Stats */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-md">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-red-100 text-red-500">
              <FireIcon className="h-6 w-6" />
            </div>
            <div>
              <Typography variant="h6" color="blue-gray">
                Alertes émises
              </Typography>
              <Typography variant="h3" className="font-bold">
                {alertStats.alertsIssued}
              </Typography>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-white shadow-md">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-orange-100 text-orange-500">
              <MapPinIcon className="h-6 w-6" />
            </div>
            <div>
              <Typography variant="h6" color="blue-gray">
                Régions couvertes
              </Typography>
              <Typography variant="h3" className="font-bold">
                {alertStats.regionsCovered}
              </Typography>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-white shadow-md">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100 text-green-500">
              <ExclamationTriangleIcon className="h-6 w-6" />
            </div>
            <div>
              <Typography variant="h6" color="blue-gray">
                Taux de réponse
              </Typography>
              <Typography variant="h3" className="font-bold">
                {alertStats.responseRate}
              </Typography>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Profile Card */}
      <Card className="shadow-xl border border-gray-100 overflow-hidden">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6 pb-0"
        >
          <Typography variant="h4" color="blue-gray">
            Profil Utilisateur
          </Typography>
          {editMode ? (
            <div className="flex gap-2">
              <IconButton
                color="green"
                onClick={() => setEditMode(false)}
              >
                <CheckIcon className="h-5 w-5" />
              </IconButton>
              <IconButton
                color="red"
                onClick={() => setEditMode(false)}
              >
                <XMarkIcon className="h-5 w-5" />
              </IconButton>
            </div>
          ) : (
            <Tooltip content="Modifier le profil">
              <IconButton
                variant="outlined"
                onClick={() => setEditMode(true)}
              >
                <PencilIcon className="h-5 w-5" />
              </IconButton>
            </Tooltip>
          )}
        </CardHeader>

        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Avatar and Basic Info */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <Avatar
                src="/img/logo-senegal.jpg"
                alt="Profile"
                size="xxl"
                className="border-4 border-white shadow-lg mb-4"
              />
              
              <Typography variant="h5" className="text-center mb-2">
                {userData.fullName}
              </Typography>
              
              <Chip
                value={userData.role}
                color="blue"
                className="rounded-full mb-6"
              />
              
              <div className="w-full space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-500">
                    <UserCircleIcon className="h-5 w-5" />
                  </div>
                  <Typography>
                    {userData.status}
                  </Typography>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100 text-green-500">
                    <PhoneIcon className="h-5 w-5" />
                  </div>
                  <Typography>
                    {userData.phone}
                  </Typography>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-amber-100 text-amber-500">
                    <EnvelopeIcon className="h-5 w-5" />
                  </div>
                  <Typography>
                    {userData.email}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Right Column - Detailed Info */}
            <div className="w-full md:w-2/3">
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Informations Personnelles
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {editMode ? (
                  <>
                    <Input
                      label="Nom complet"
                      name="fullName"
                      value={userData.fullName}
                      onChange={handleInputChange}
                      icon={<UserCircleIcon className="h-5 w-5" />}
                    />
                    <Input
                      label="Téléphone"
                      name="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      icon={<PhoneIcon className="h-5 w-5" />}
                    />
                    <Input
                      label="Email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      icon={<EnvelopeIcon className="h-5 w-5" />}
                    />
                    <Select
                      label="Région"
                      value={userData.address.region}
                      onChange={(value) => handleAddressChange({ target: { name: "region", value } })}
                    >
                      {regions.map(region => (
                        <Option key={region} value={region}>{region}</Option>
                      ))}
                    </Select>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <UserCircleIcon className="h-5 w-5 text-gray-500" />
                      <Typography>{userData.fullName}</Typography>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <PhoneIcon className="h-5 w-5 text-gray-500" />
                      <Typography>{userData.phone}</Typography>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                      <Typography>{userData.email}</Typography>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPinIcon className="h-5 w-5 text-gray-500" />
                      <Typography>{userData.address.region}</Typography>
                    </div>
                  </>
                )}
              </div>

              <Typography variant="h6" color="blue-gray" className="mb-4 mt-6">
                Adresse
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {editMode ? (
                  <>
                    <Input
                      label="Rue"
                      name="street"
                      value={userData.address.street}
                      onChange={handleAddressChange}
                    />
                    <Input
                      label="Ville"
                      name="city"
                      value={userData.address.city}
                      onChange={handleAddressChange}
                    />
                    <Input
                      label="Code postal"
                      name="postalCode"
                      value={userData.address.postalCode}
                      onChange={handleAddressChange}
                    />
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <Typography variant="small" color="blue-gray" className="mb-1 font-medium">
                        Rue
                      </Typography>
                      <Typography>{userData.address.street}</Typography>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <Typography variant="small" color="blue-gray" className="mb-1 font-medium">
                        Ville
                      </Typography>
                      <Typography>{userData.address.city}</Typography>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <Typography variant="small" color="blue-gray" className="mb-1 font-medium">
                        Code postal
                      </Typography>
                      <Typography>{userData.address.postalCode}</Typography>
                    </div>
                  </>
                )}
              </div>

              {editMode && (
                <>
                  <Typography variant="h6" color="blue-gray" className="mb-4 mt-6">
                    Sécurité
                  </Typography>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <LockClosedIcon className="h-5 w-5 text-gray-500" />
                    <Typography>********</Typography>
                    <Button variant="text" size="sm" className="ml-auto">
                      Changer le mot de passe
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Profile;