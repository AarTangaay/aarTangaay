import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Avatar,
  Progress,
  Tooltip,
  IconButton
} from "@material-tailwind/react";
import {
  MapIcon,
  BellIcon,
  CalendarIcon,
  ArrowUpIcon,
  FireIcon,
  ExclamationTriangleIcon,
  UsersIcon,
  CloudIcon
} from "@heroicons/react/24/outline";
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import 'leaflet/dist/leaflet.css';

// Fix pour les marqueurs Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


export function Home() {
  const [userPosition, setUserPosition] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Récupérer la position de l'utilisateur
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

  const heatmapData = [
    [14.716677, -17.467686, 0.8], // Dakar
    // ... (autres données de heatmap)
  ];

  // Créer la heatmap et gérer la position utilisateur
  const HeatmapLayer = () => {
    const map = useMap();
    
    React.useEffect(() => {
      if (!map) return;
      
      // Ajouter la heatmap
      const heat = L.heatLayer(heatmapData, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {0.4: 'blue', 0.6: 'lime', 0.8: 'yellow', 1.0: 'red'}
      }).addTo(map);
      
      // Centrer sur la position utilisateur si disponible
      if (userPosition) {
        map.flyTo([userPosition.lat, userPosition.lng], 13);
        
        // Ajouter un marqueur pour la position utilisateur
        L.marker([userPosition.lat, userPosition.lng], {
          icon: L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
          })
        })
        .addTo(map)
        .bindPopup("Votre position actuelle");
      }
      
      return () => {
        map.removeLayer(heat);
      };
    }, [map, userPosition]);
    
    return null;
  };
  // Données simulées
  const stats = [
    {
      title: "Alertes Actives",
      value: "12",
      change: "+4%",
      icon: FireIcon,
      color: "bg-red-500"
    },
    {
      title: "Régions Touchées",
      value: "7",
      change: "+2",
      icon: MapIcon,
      color: "bg-amber-500"
    },
    {
      title: "Population à Risque",
      value: "1.2M",
      change: "+15%",
      icon: UsersIcon,
      color: "bg-orange-500"
    },
    {
      title: "Prévisions J+7",
      value: "3",
      change: "Stable",
      icon: CloudIcon,
      color: "bg-blue-500"
    }
  ];

  const regions = [
    { name: "Dakar", alerts: 4, progress: 80, color: "red" },
    { name: "Thiès", alerts: 3, progress: 60, color: "orange" },
    { name: "Saint-Louis", alerts: 2, progress: 40, color: "amber" },
    { name: "Kaolack", alerts: 1, progress: 20, color: "yellow" }
  ];

  const recentAlerts = [
    {
      region: "Pikine",
      level: "Extrême",
      date: "15 min ago",
      color: "red"
    },
    {
      region: "Guediawaye",
      level: "Haute",
      date: "1h ago",
      color: "orange"
    },
    {
      region: "Rufisque",
      level: "Modérée",
      date: "3h ago",
      color: "yellow"
    }
  ];

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="h2" className="text-2xl md:text-3xl font-bold text-gray-900">
          Tableau de Bord des Vagues de Chaleur
        </Typography>
        <Typography variant="paragraph" className="text-gray-600">
          Surveillance en temps réel des risques climatiques au Sénégal
        </Typography>
      </div>

      {/* Cartes Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="border border-gray-100 shadow-sm rounded-xl">
            <CardBody className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <Typography variant="small" className="text-gray-600 font-medium">
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </Typography>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <ArrowUpIcon className={`h-4 w-4 ${stat.change.includes('+') ? 'text-green-500' : 'text-gray-500'}`} />
                <Typography variant="small" className={`ml-1 ${stat.change.includes('+') ? 'text-green-500' : 'text-gray-500'}`}>
                  {stat.change} vs hier
                </Typography>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Cartes Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Carte Alerte */}
        <Card className="lg:col-span-2 border border-gray-100 shadow-sm rounded-xl">
          <CardHeader floated={false} shadow={false} className="border-b border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <Typography variant="h5" color="blue-gray" className="flex items-center gap-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                Alertes Actives
              </Typography>
              <Chip value="En temps réel" color="red" size="sm" className="rounded-full" />
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead>
                  <tr>
                    <th className="p-4 text-left border-b border-gray-100">
                      <Typography variant="small" className="text-xs font-semibold text-gray-600 uppercase">
                        Région
                      </Typography>
                    </th>
                    <th className="p-4 text-left border-b border-gray-100">
                      <Typography variant="small" className="text-xs font-semibold text-gray-600 uppercase">
                        Niveau
                      </Typography>
                    </th>
                    <th className="p-4 text-left border-b border-gray-100">
                      <Typography variant="small" className="text-xs font-semibold text-gray-600 uppercase">
                        Dernière mise à jour
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentAlerts.map((alert, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-4 border-b border-gray-100">
                        <Typography variant="small" className="font-medium text-gray-900">
                          {alert.region}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Chip 
                          value={alert.level} 
                          color={alert.color} 
                          size="sm" 
                          className="rounded-full capitalize" 
                        />
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography variant="small" className="text-gray-600">
                          {alert.date}
                        </Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
          <CardFooter className="flex items-center justify-between p-4 border-t border-gray-100">
            <Typography variant="small" className="text-gray-600">
              <strong>3</strong> alertes actives
            </Typography>
            <Tooltip content="Voir toutes les alertes">
              <IconButton size="sm" variant="text" color="gray">
                <BellIcon className="h-5 w-5" />
              </IconButton>
            </Tooltip>
          </CardFooter>
        </Card>

        {/* Carte Régions */}
        <Card className="border border-gray-100 shadow-sm rounded-xl">
          <CardHeader floated={false} shadow={false} className="border-b border-gray-100 p-4">
            <Typography variant="h5" color="blue-gray" className="flex items-center gap-2">
              <MapIcon className="h-5 w-5 text-blue-500" />
              Zones à Risque
            </Typography>
          </CardHeader>
          <CardBody className="p-4">
            <div className="space-y-4">
              {regions.map((region, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <Typography variant="small" className="font-medium text-gray-900">
                      {region.name}
                    </Typography>
                    <Typography variant="small" className="font-medium text-gray-500">
                      {region.alerts} alertes
                    </Typography>
                  </div>
                  <Progress
                    value={region.progress}
                    color={region.color}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardBody>
          <CardFooter className="p-4 border-t border-gray-100">
            <Typography variant="small" className="text-gray-600">
              <strong>7</strong> régions surveillées
            </Typography>
          </CardFooter>
        </Card>
      </div>

      {/* Section Carte Thermique */}
      <Card className="mb-8 border border-gray-100 shadow-sm rounded-xl">
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
          {userPosition ? (
            <MapContainer 
              center={[userPosition.lat, userPosition.lng]} 
              zoom={13} 
              style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <HeatmapLayer />
            </MapContainer>
          ) : (
            <MapContainer 
              center={[14.5, -14.25]} 
              zoom={7} 
              style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <HeatmapLayer />
            </MapContainer>
          )}
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
    </div>
  );
}

export default Home;