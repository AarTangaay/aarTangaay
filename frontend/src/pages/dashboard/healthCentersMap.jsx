import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Input,
  Select,
  Option,
  Button,
  IconButton,
  Tooltip,
  Tabs,
  TabsHeader,
  Tab
} from "@material-tailwind/react";
import {
  MapPinIcon,
  BuildingOffice2Icon,
  PhoneIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  ClockIcon,
  HeartIcon,
  UserGroupIcon
} from "@heroicons/react/24/solid";

// Données des centres de santé
const healthCenters = [
  {
    id: 1,
    name: "Centre de Santé de Grand Dakar",
    region: "Dakar",
    locality: "Grand Dakar",
    address: "Rue 10 x Rue 11",
    contact: "33 821 10 10",
    capacity: 120,
    bedsAvailable: 45,
    distance: "2.5 km",
    coordinates: { lat: 14.7167, lng: -17.4677 },
    services: ["Urgences", "Réhydratation", "Soins intensifs"]
  },
  {
    id: 2,
    name: "Hôpital Régional de Thiès",
    region: "Thiès",
    locality: "Thiès Est",
    address: "Avenue Ahmed Khalifa Niasse",
    contact: "33 951 20 20",
    capacity: 300,
    bedsAvailable: 89,
    distance: "15 km",
    coordinates: { lat: 14.795, lng: -16.935 },
    services: ["Urgences", "Pédiatrie", "Laboratoire"]
  },
  {
    id: 3,
    name: "Poste de Santé de Guédiawaye",
    region: "Dakar",
    locality: "Guédiawaye",
    address: "Cité Soprim",
    contact: "33 852 30 30",
    capacity: 80,
    bedsAvailable: 12,
    distance: "5.8 km",
    coordinates: { lat: 14.7833, lng: -17.4 },
    services: ["Premiers soins", "Vaccination"]
  }
];

const regions = [...new Set(healthCenters.map(center => center.region))];
const localities = [...new Set(healthCenters.map(center => center.locality))];

export function HealthCentersMap() {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const filteredCenters = healthCenters.filter(center => {
    const matchesRegion = selectedRegion ? center.region === selectedRegion : true;
    const matchesLocality = selectedLocality ? center.locality === selectedLocality : true;
    const matchesSearch = searchQuery ? 
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      center.address.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    
    return matchesRegion && matchesLocality && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="h2" className="text-2xl md:text-3xl font-bold text-gray-900">
          Centres de Santé - Gestion Canicule
        </Typography>
        <Typography variant="paragraph" className="text-gray-600">
          Localisation des structures sanitaires disponibles par région
        </Typography>
      </div>

      {/* Controls */}
      <Card className="mb-6 shadow-sm">
        <CardBody className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-1/4">
            <Select
              label="Région"
              value={selectedRegion}
              onChange={setSelectedRegion}
              icon={<MapPinIcon className="h-5 w-5" />}
            >
              <Option value="">Toutes les régions</Option>
              {regions.map(region => (
                <Option key={region} value={region}>{region}</Option>
              ))}
            </Select>
          </div>
          
          <div className="w-full md:w-1/4">
            <Select
              label="Localité"
              value={selectedLocality}
              onChange={setSelectedLocality}
              icon={<BuildingOffice2Icon className="h-5 w-5" />}
            >
              <Option value="">Toutes les localités</Option>
              {localities.map(locality => (
                <Option key={locality} value={locality}>{locality}</Option>
              ))}
            </Select>
          </div>
          
          <div className="w-full md:w-1/4">
            <Input
              label="Recherche..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
          
          <div className="w-full md:w-1/4 flex gap-2">
            <Button 
              fullWidth 
              variant="outlined" 
              className="flex items-center gap-2"
              onClick={getCurrentLocation}
            >
              <MapPinIcon className="h-4 w-4" />
              Ma position
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte */}
        <Card className="lg:col-span-2 h-[600px] shadow-md overflow-hidden">
          <CardHeader floated={false} shadow={false} className="border-b border-gray-200 p-4">
            <Typography variant="h5" className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-red-500" />
              Carte des Centres de Santé
            </Typography>
          </CardHeader>
          <CardBody className="p-0 relative h-full">
            {/* Mock de la carte - À remplacer par une vraie intégration Google Maps */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center">
              <div className="text-center">
                <div className="relative inline-block">
                  <img 
                    src="/img/senegal-map-outline.png" 
                    alt="Carte Sénégal" 
                    className="h-96 opacity-80"
                  />
                  {filteredCenters.map((center, i) => (
                    <Tooltip key={center.id} content={center.name}>
                      <div 
                        className={`absolute w-6 h-6 rounded-full flex items-center justify-center
                          ${center.bedsAvailable > 20 ? 'bg-green-500' : 'bg-red-500'} 
                          ${center.bedsAvailable <= 20 && center.bedsAvailable > 5 ? 'bg-yellow-500' : ''}
                          text-white font-bold cursor-pointer`}
                        style={{
                          left: `${50 + center.coordinates.lng * 2}%`,
                          top: `${50 - center.coordinates.lat * 2}%`
                        }}
                      >
                        {i+1}
                      </div>
                    </Tooltip>
                  ))}
                  {userLocation && (
                    <div 
                      className="absolute w-4 h-4 rounded-full bg-blue-700 ring-2 ring-white"
                      style={{
                        left: `${50 + userLocation.lng * 2}%`,
                        top: `${50 - userLocation.lat * 2}%`
                      }}
                    />
                  )}
                </div>
                <Typography variant="small" className="text-gray-500 mt-2">
                  Carte interactive des centres (mockup)
                </Typography>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Liste des centres */}
        <Card className="h-[600px] shadow-md overflow-hidden">
          <CardHeader floated={false} shadow={false} className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <Typography variant="h5" className="flex items-center gap-2">
                <BuildingOffice2Icon className="h-5 w-5 text-blue-500" />
                Centres disponibles
              </Typography>
              <Typography variant="small">
                {filteredCenters.length} résultat(s)
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="p-0 overflow-y-auto">
            {filteredCenters.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredCenters.map((center, index) => (
                  <div key={center.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        center.bedsAvailable > 20 ? 'bg-green-50 text-green-600' : 
                        center.bedsAvailable <= 5 ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                      }`}>
                        <HeartIcon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <Typography variant="h6" className="font-bold">
                            {center.name}
                          </Typography>
                          <Chip
                            value={`${center.bedsAvailable} lits`}
                            color={
                              center.bedsAvailable > 20 ? 'green' : 
                              center.bedsAvailable <= 5 ? 'red' : 'amber'
                            }
                            className="rounded-full"
                          />
                        </div>
                        <Typography variant="small" className="text-gray-600 flex items-center gap-1 mt-1">
                          <MapPinIcon className="h-4 w-4" />
                          {center.locality}, {center.region} • {center.distance}
                        </Typography>
                        <Typography variant="small" className="text-gray-600 flex items-center gap-1 mt-1">
                          <PhoneIcon className="h-4 w-4" />
                          {center.contact}
                        </Typography>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {center.services.map(service => (
                            <Chip
                              key={service}
                              value={service}
                              color="blue-gray"
                              variant="outlined"
                              className="rounded-full text-xs"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center p-8">
                <div>
                  <BuildingOffice2Icon className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <Typography variant="h6" className="text-gray-500">
                    Aucun centre trouvé
                  </Typography>
                  <Typography variant="small" className="text-gray-400">
                    Modifiez vos critères de recherche
                  </Typography>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default HealthCentersMap;