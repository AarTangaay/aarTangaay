import React, { useEffect, useState } from 'react';
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
  Tab,
  CardFooter
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
  UserGroupIcon,
  FireIcon,
  CalendarIcon
} from "@heroicons/react/24/solid";
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import 'leaflet/dist/leaflet.css';

// Configuration des marqueurs Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
  const [userPosition, setUserPosition] = useState(null);
  const [locationError, setLocationError] = useState(null);
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setLocationError(error.message);
          console.error("Erreur de géolocalisation:", error);
        }
      );
    } else {
      setLocationError("La géolocalisation n'est pas supportée par ce navigateur.");
    }
  }, []);

  const HeatmapLayer = () => {
    const map = useMap();
    const heatmapData = [
      [14.716677, -17.467686, 0.8],
      [14.795, -16.935, 0.6],
      [14.7833, -17.4, 0.4]
    ];
    const heatmapGradient = {
    0.1: 'rgba(30, 58, 138, 0.2)',   // blue-900
    0.3: 'rgba(59, 130, 246, 0.4)',  // blue-500
    0.5: 'rgba(34, 197, 94, 0.6)',   // green-500
    0.7: 'rgba(234, 179, 8, 0.8)',   // yellow-500
    0.9: 'rgba(249, 115, 22, 0.9)',  // orange-500
    1.0: 'rgba(220, 38, 38, 1)'      // red-600
  };
    
    useEffect(() => {
      if (!map) return;
      
      const heat = L.heatLayer(heatmapData, {
        radius: 25,
        blur: 15,
        // gradient: heatmapGradient,
        maxZoom: 17,
        gradient: {0.4: 'blue', 0.6: 'lime', 0.8: 'yellow', 1.0: 'red'}
      }).addTo(map);
      
      if (userPosition) {
        map.flyTo([userPosition.lat, userPosition.lng], 13);
        
        L.marker([userPosition.lat, userPosition.lng], {
          icon: L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
          })
        }).addTo(map).bindPopup("Votre position actuelle");
      }
      
      return () => {
        map.removeLayer(heat);
      };
    }, [map, userPosition]);
    
    return null;
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
              onClick={() => {
                setSelectedRegion("");
                setSelectedLocality("");
                setSearchQuery("");
              }}
            >
              <MapPinIcon className="h-4 w-4" />
              Réinitialiser
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte Thermique */}
        <Card className="lg:col-span-2 border border-gray-100 shadow-sm rounded-xl">
          <CardHeader floated={false} shadow={false} className="border-b border-gray-100 p-4">
            <div className="flex justify-between items-center">
              <Typography variant="h5" color="blue-gray" className="flex items-center gap-2">
                <FireIcon className="h-5 w-5 text-orange-500" />
                Carte Thermique des Alertes
              </Typography>
              {locationError && (
                <Chip 
                  value="Géolocalisation désactivée" 
                  color="red" 
                  size="sm" 
                  className="rounded-full" 
                />
              )}
            </div>
          </CardHeader>
          <CardBody className="p-4 h-96">
            <MapContainer 
              center={userPosition || [14.5, -14.25]} 
              zoom={userPosition ? 13 : 7} 
              style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <HeatmapLayer />
            </MapContainer>
          </CardBody>
          <CardFooter className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <CalendarIcon className="h-4 w-4" />
              <Typography variant="small">
                {userPosition 
                  ? "Position actuelle détectée" 
                  : locationError || "Détection de la position en cours..."}
              </Typography>
            </div>
          </CardFooter>
        </Card>

        {/* Liste des centres */}
        <Card className="shadow-md overflow-hidden">
          <CardHeader floated={false} shadow={false} className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <Typography variant="h5" className="flex items-center gap-2">
                <BuildingOffice2Icon className="h-5 w-5 text-blue-500" />
                Centres disponibles
              </Typography>
              <Typography variant="small" className="font-medium">
                {filteredCenters.length} résultat(s)
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="p-0 overflow-y-auto" style={{ height: 'calc(600px - 72px)' }}>
            {filteredCenters.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredCenters.map((center) => (
                  <div key={center.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        center.bedsAvailable > 20 ? 'bg-green-50 text-green-600' : 
                        center.bedsAvailable <= 5 ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                      }`}>
                        <HeartIcon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <Typography variant="h6" className="font-bold truncate">
                            {center.name}
                          </Typography>
                          <Chip
                            value={`${center.bedsAvailable} lits`}
                            color={
                              center.bedsAvailable > 20 ? 'green' : 
                              center.bedsAvailable <= 5 ? 'red' : 'amber'
                            }
                            className="rounded-full whitespace-nowrap"
                          />
                        </div>
                        <Typography variant="small" className="text-gray-600 flex items-center gap-1 mt-1 truncate">
                          <MapPinIcon className="h-4 w-4 flex-shrink-0" />
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
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <BuildingOffice2Icon className="h-10 w-10 text-gray-400 mb-2" />
                <Typography variant="h6" className="text-gray-500 mb-1">
                  Aucun centre trouvé
                </Typography>
                <Typography variant="small" className="text-gray-400">
                  Modifiez vos critères de recherche
                </Typography>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default HealthCentersMap;