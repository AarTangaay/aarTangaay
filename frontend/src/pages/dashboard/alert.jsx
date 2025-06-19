import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Select,
  Option,
  Input,
  Button,
  IconButton,
  Tooltip,
  Tabs,
  TabsHeader,
  Tab,
  Chip
} from "@material-tailwind/react";
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  BellAlertIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  CalendarDaysIcon,
  FunnelIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/solid";

// ... (le reste du code reste identique)

import { GoogleMap, LoadScript, HeatmapLayer } from '@react-google-maps/api';
// Mock data - À remplacer par vos vraies données
const regionsData = {
  "Dakar": {
    temp: 42,
    humidity: 65,
    alerts: 3,
    status: "danger",
    forecast: "Vague de chaleur extrême"
  },
  "Thiès": {
    temp: 39,
    humidity: 70,
    alerts: 1,
    status: "warning",
    forecast: "Températures élevées"
  },
  "Saint-Louis": {
    temp: 41,
    humidity: 60,
    alerts: 2,
    status: "danger",
    forecast: "Niveau d'alerte orange"
  }
};

const Alert = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 14.4974, lng: -14.4524 }); // Centre du Sénégal
  const [heatmapData, setHeatmapData] = useState([
    { lat: 14.7167, lng: -17.4677, weight: 0.8 }, // Dakar
    { lat: 14.795, lng: -16.935, weight: 0.6 }, // Thiès
    { lat: 16.0333, lng: -16.5, weight: 0.7 } // Saint-Louis
  ]);

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    // Simulation de centrage sur la région
    if (region === "Dakar") setMapCenter({ lat: 14.7167, lng: -17.4677 });
    if (region === "Thiès") setMapCenter({ lat: 14.795, lng: -16.935 });
    if (region === "Saint-Louis") setMapCenter({ lat: 16.0333, lng: -16.5 });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <Typography variant="h2" className="text-2xl md:text-3xl font-bold text-gray-900">
            Tableau de Bord des Alertes Canicule
          </Typography>
          <Typography variant="paragraph" className="text-gray-600">
            Surveillance en temps réel - Ministère de la Santé Sénégal
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outlined" className="flex items-center gap-2">
            <CalendarDaysIcon className="h-4 w-4" />
            <span>{new Date().toLocaleDateString()}</span>
          </Button>
          <Tooltip content="Actualiser les données">
            <IconButton variant="text">
              <ArrowPathIcon className="h-5 w-5" />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* Controls */}
      <Card className="mb-6 shadow-sm">
        <CardBody className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-1/3">
            <Select
              label="Sélectionner une région"
              value={selectedRegion}
              onChange={handleRegionSelect}
              icon={<MapPinIcon className="h-5 w-5" />}
            >
              {Object.keys(regionsData).map(region => (
                <Option key={region} value={region}>{region}</Option>
              ))}
            </Select>
          </div>
          <div className="w-full md:w-1/3">
            <Input
              label="Recherche avancée..."
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
          <div className="w-full md:w-1/3 flex gap-2">
            <Button fullWidth variant="outlined" className="flex items-center gap-2">
              <FunnelIcon className="h-4 w-4" />
              Filtres
            </Button>
            <Button fullWidth className="bg-red-500 flex items-center gap-2">
              <BellAlertIcon className="h-4 w-4" />
              Nouvelle Alerte
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte */}
        <Card className="lg:col-span-2 h-[500px] shadow-md overflow-hidden">
          <CardHeader floated={false} shadow={false} className="border-b border-gray-200 p-4">
            <Typography variant="h5" className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-red-500" />
              Carte Thermique du Sénégal
            </Typography>
          </CardHeader>
          <CardBody className="p-0 relative h-full">
            {/* Intégration Google Maps avec Heatmap */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-red-100 flex items-center justify-center">
              {/* Mock de la carte - À remplacer par une vraie intégration Google Maps */}
              <div className="text-center">
                <div className="relative inline-block">
                  <img 
                    src="/img/senegal-map-outline.png" 
                    alt="Carte Sénégal" 
                    className="h-80 opacity-70"
                  />
                  {heatmapData.map((point, i) => (
                    <div 
                      key={i}
                      className={`absolute w-8 h-8 rounded-full ${selectedRegion === Object.keys(regionsData)[i] ? 
                        'ring-4 ring-blue-500' : ''}`}
                      style={{
                        left: `${50 + point.lng * 2}%`,
                        top: `${50 - point.lat * 2}%`,
                        background: `radial-gradient(circle, rgba(255,0,0,0.7) 0%, rgba(255,0,0,0) 70%)`
                      }}
                    />
                  ))}
                </div>
                <Typography variant="small" className="text-gray-500 mt-2">
                  Carte interactive des températures (mockup)
                </Typography>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Détails Région */}
        <Card className="h-[500px] shadow-md">
          <CardHeader floated={false} shadow={false} className="border-b border-gray-200 p-4">
            <Typography variant="h5" className="flex items-center gap-2">
              <InformationCircleIcon className="h-5 w-5 text-blue-500" />
              {selectedRegion || "Sélectionnez une région"}
            </Typography>
          </CardHeader>
          <CardBody className="overflow-y-auto">
            {selectedRegion ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Typography variant="h6">Statut actuel</Typography>
                  <Chip
                    value={regionsData[selectedRegion].status === "danger" ? "Danger" : "Alerte"}
                    color={regionsData[selectedRegion].status === "danger" ? "red" : "orange"}
                    className="rounded-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-blue-50">
                    <CardBody className="p-4">
                      <Typography variant="small" className="text-blue-gray-500">
                        Température
                      </Typography>
                      <Typography variant="h3" className="font-bold">
                        {regionsData[selectedRegion].temp}°C
                      </Typography>
                    </CardBody>
                  </Card>
                  <Card className="bg-green-50">
                    <CardBody className="p-4">
                      <Typography variant="small" className="text-blue-gray-500">
                        Humidité
                      </Typography>
                      <Typography variant="h3" className="font-bold">
                        {regionsData[selectedRegion].humidity}%
                      </Typography>
                    </CardBody>
                  </Card>
                </div>

                <div>
                  <Typography variant="h6" className="mb-2">
                    Prévisions
                  </Typography>
                  <Typography>
                    {regionsData[selectedRegion].forecast}
                  </Typography>
                </div>

                <div>
                  <Typography variant="h6" className="mb-2">
                    Alertes actives
                  </Typography>
                  <div className="space-y-2">
                    {Array.from({ length: regionsData[selectedRegion].alerts }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                        <Typography variant="small">
                          Alerte canicule #{i+1} - Niveau {regionsData[selectedRegion].status === "danger" ? 3 : 2}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>

                <Button fullWidth className="mt-4 bg-red-500">
                  Générer un rapport d'urgence
                </Button>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <MapPinIcon className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <Typography variant="h6" className="text-gray-500">
                    Sélectionnez une région sur la carte
                  </Typography>
                  <Typography variant="small" className="text-gray-400">
                    ou choisissez dans le menu déroulant
                  </Typography>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Alertes Historiques */}
      <Card className="mt-6 shadow-sm">
        <CardHeader floated={false} shadow={false} className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <Typography variant="h5" className="flex items-center gap-2">
              <BellAlertIcon className="h-5 w-5 text-orange-500" />
              Historique des Alertes (24h)
            </Typography>
            <Tabs value="all">
              <TabsHeader>
                <Tab value="all">Toutes</Tab>
                <Tab value="critical">Critiques</Tab>
                <Tab value="warning">Avertissements</Tab>
              </TabsHeader>
            </Tabs>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead>
                <tr>
                  <th className="p-4 text-left">Région</th>
                  <th className="p-4 text-left">Niveau</th>
                  <th className="p-4 text-left">Température</th>
                  <th className="p-4 text-left">Heure</th>
                  <th className="p-4 text-left">Statut</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(regionsData).map(([region, data]) => (
                  <tr key={region} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <Typography variant="small" className="font-medium">
                        {region}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Chip
                        value={data.status === "danger" ? "Danger" : "Alerte"}
                        color={data.status === "danger" ? "red" : "orange"}
                        className="rounded-full"
                      />
                    </td>
                    <td className="p-4">
                      <Typography>{data.temp}°C</Typography>
                    </td>
                    <td className="p-4">
                      <Typography>10:3{data.alerts} AM</Typography>
                    </td>
                    <td className="p-4">
                      <Typography className="font-medium text-green-500">
                        En cours
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Alert;