import React, { useState, useRef, useEffect } from 'react';
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
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Textarea
} from "@material-tailwind/react";
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  BellAlertIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  CalendarDaysIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  PaperClipIcon,
  DocumentArrowDownIcon
} from "@heroicons/react/24/solid";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import 'leaflet/dist/leaflet.css';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Configuration des marqueurs Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Données des régions
const regionsData = {
  "Dakar": {
    temp: 42,
    humidity: 65,
    alerts: 3,
    status: "danger",
    forecast: "Vague de chaleur extrême",
    coordinates: { lat: 14.7167, lng: -17.4677 },
    population: 3500000,
    hospitals: 12,
    riskLevel: "Très élevé"
  },
  "Thiès": {
    temp: 39,
    humidity: 70,
    alerts: 1,
    status: "warning",
    forecast: "Températures élevées",
    coordinates: { lat: 14.795, lng: -16.935 },
    population: 1200000,
    hospitals: 5,
    riskLevel: "Élevé"
  },
  "Saint-Louis": {
    temp: 41,
    humidity: 60,
    alerts: 2,
    status: "danger",
    forecast: "Niveau d'alerte orange",
    coordinates: { lat: 16.0333, lng: -16.5 },
    population: 900000,
    hospitals: 3,
    riskLevel: "Très élevé"
  }
};

// Composant HeatmapLayer avec géolocalisation
const HeatmapLayer = ({ positions, selectedRegion, userLocation }) => {
  const map = useMap();

  const heatmapData = [
    [14.7167, -17.4677, 0.95], [14.75, -17.45, 0.9], [14.68, -17.45, 0.85], [14.7, -17.5, 0.8],
    [14.795, -16.935, 0.75], [14.8, -16.9, 0.7], [14.78, -16.95, 0.65],
    [16.0333, -16.5, 0.9], [16.05, -16.48, 0.85], [16.0, -16.52, 0.8],
    [14.9, -15.9, 0.7], [13.45, -16.57, 0.6], [12.55, -16.27, 0.5]
  ];

  const heatmapGradient = {
    0.1: 'rgba(0, 0, 255, 0.1)',
    0.3: 'rgba(0, 255, 255, 0.3)',
    0.5: 'rgba(0, 255, 0, 0.5)',
    0.7: 'rgba(255, 255, 0, 0.7)',
    0.9: 'rgba(255, 165, 0, 0.9)',
    1.0: 'rgba(255, 0, 0, 1)'
  };

  useEffect(() => {
    if (!map) return;

    const heat = L.heatLayer(heatmapData, {
      radius: 30,
      blur: 20,
      gradient: heatmapGradient,
      maxZoom: 13,
      minOpacity: 0.5
    }).addTo(map);

    if (selectedRegion) {
      const regionPos = positions.find(p => p.region === selectedRegion);
      if (regionPos) {
        L.circle([regionPos.lat, regionPos.lng], {
          radius: 15000,
          color: "#ff0000",
          fillColor: "#ff3333",
          fillOpacity: 0.1,
          weight: 2
        }).addTo(map);
      }
    }

    return () => {
      map.removeLayer(heat);
    };
  }, [map, positions, selectedRegion]);

  // Ajout du marqueur de position utilisateur
  useEffect(() => {
    if (!map || !userLocation) return;

    const userMarker = L.marker([userLocation.lat, userLocation.lng], {
      icon: L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        shadowSize: [41, 41]
      })
    }).bindPopup("Votre position").addTo(map);

    return () => {
      map.removeLayer(userMarker);
    };
  }, [map, userLocation]);

  return null;
};

const Alert = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [newAlert, setNewAlert] = useState({
    name: '',
    description: '',
    region: '',
    severity: 'medium',
    file: null
  });

  const reportRef = useRef();

  // Géolocalisation au chargement
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(loc);
          findNearestRegion(loc.lat, loc.lng);
        },
        (error) => {
          setLocationError("Impossible d'obtenir votre position : " + error.message);
          console.error("Erreur de géolocalisation:", error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocationError("La géolocalisation n'est pas supportée par votre navigateur");
    }
  }, []);

  const findNearestRegion = (lat, lng) => {
    let nearestRegion = null;
    let minDistance = Infinity;

    Object.entries(regionsData).forEach(([region, data]) => {
      const distance = Math.sqrt(
        Math.pow(data.coordinates.lat - lat, 2) + 
        Math.pow(data.coordinates.lng - lng, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestRegion = region;
      }
    });

    if (nearestRegion) {
      setSelectedRegion(nearestRegion);
    }
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
  };

  const handleFileChange = (e) => {
    setNewAlert({...newAlert, file: e.target.files[0]});
  };

  const handleSubmitAlert = () => {
    console.log("Nouvelle alerte créée:", newAlert);
    setOpenModal(false);
    setNewAlert({
      name: '',
      description: '',
      region: '',
      severity: 'medium',
      file: null
    });
  };

  const generateReport = () => {
    if (!selectedRegion) return;
    
    const regionData = regionsData[selectedRegion];
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    const content = `
      Rapport d'urgence - Canicule
      ---------------------------
      Région: ${selectedRegion}
      Date: ${date} à ${time}
      
      Données actuelles:
      - Température: ${regionData.temp}°C
      - Humidité: ${regionData.humidity}%
      - Niveau de risque: ${regionData.riskLevel}
      - Population affectée: ${regionData.population.toLocaleString()}
      - Structures sanitaires: ${regionData.hospitals}
      
      Prévisions:
      ${regionData.forecast}
      
      Alertes actives: ${regionData.alerts}
      
      Recommandations:
      1. Activer le plan canicule
      2. Mobiliser les centres de santé
      3. Distribuer de l'eau potable
      4. Sensibiliser les populations vulnérables
    `;
    
    setReportContent(content);
    setOpenReportModal(true);
  };

  const downloadPDFReport = () => {
    if (!selectedRegion) return;
    
    const regionData = regionsData[selectedRegion];
    const date = new Date().toLocaleDateString();
    
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Rapport d'urgence - Canicule`, 15, 15);
    doc.setFontSize(12);
    doc.text(`Région: ${selectedRegion} - ${date}`, 15, 25);
    doc.line(15, 30, 195, 30);
    
    doc.setFontSize(14);
    doc.text('Données actuelles:', 15, 40);
    doc.setFontSize(12);
    doc.text(`- Température: ${regionData.temp}°C`, 20, 50);
    doc.text(`- Humidité: ${regionData.humidity}%`, 20, 60);
    doc.text(`- Niveau de risque: ${regionData.riskLevel}`, 20, 70);
    doc.text(`- Population affectée: ${regionData.population.toLocaleString()}`, 20, 80);
    doc.text(`- Structures sanitaires: ${regionData.hospitals}`, 20, 90);
    
    doc.setFontSize(14);
    doc.text('Prévisions:', 15, 105);
    doc.setFontSize(12);
    doc.text(regionData.forecast, 20, 115);
    
    doc.setFontSize(14);
    doc.text('Alertes actives:', 15, 130);
    doc.setFontSize(12);
    doc.text(`${regionData.alerts} alertes en cours`, 20, 140);
    
    doc.setFontSize(14);
    doc.text('Recommandations:', 15, 155);
    doc.setFontSize(12);
    doc.text('1. Activer le plan canicule', 20, 165);
    doc.text('2. Mobiliser les centres de santé', 20, 175);
    doc.text('3. Distribuer de l\'eau potable', 20, 185);
    doc.text('4. Sensibiliser les populations vulnérables', 20, 195);
    
    doc.save(`rapport_canicule_${selectedRegion}_${date.replace(/\//g, '-')}.pdf`);
    setOpenReportModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Notifications de géolocalisation */}
      {locationError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg z-50">
          <p>{locationError}</p>
        </div>
      )}

      {userLocation && !selectedRegion && (
        <div className="fixed bottom-4 right-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded shadow-lg z-50">
          <p>Nous avons centré la carte sur votre position approximative</p>
        </div>
      )}

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
            <Button 
              fullWidth 
              className="bg-red-500 flex items-center gap-2"
              onClick={() => setOpenModal(true)}
            >
              <BellAlertIcon className="h-4 w-4" />
              Nouvelle Alerte
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte Thermique */}
        <Card className="lg:col-span-2 h-[500px] shadow-md overflow-hidden">
          <CardHeader floated={false} shadow={false} className="border-b border-gray-200 p-4">
            <Typography variant="h5" className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-red-500" />
              Carte Thermique du Sénégal
            </Typography>
          </CardHeader>
          <CardBody className="p-0 h-full">
            <MapContainer 
              center={userLocation || (selectedRegion ? regionsData[selectedRegion].coordinates : [14.4974, -14.4524])} 
              zoom={selectedRegion ? 9 : 6} 
              style={{ height: '100%', width: '100%' }}
              className="heatmap-container"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <HeatmapLayer 
                positions={Object.values(regionsData).map(r => r.coordinates)} 
                selectedRegion={selectedRegion}
                userLocation={userLocation}
              />
            </MapContainer>
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

                <Button 
                  fullWidth 
                  className="mt-4 bg-red-500 flex items-center justify-center gap-2"
                  onClick={generateReport}
                >
                  <DocumentArrowDownIcon className="h-4 w-4" />
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

      {/* Modal Nouvelle Alerte */}
      <Dialog open={openModal} handler={() => setOpenModal(!openModal)} size='sm'>
        <DialogHeader className="flex justify-between items-center">
          <span>Créer une nouvelle alerte</span>
          <IconButton variant="text" onClick={() => setOpenModal(false)}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="divide-y divide-gray-200">
          <div className="pb-4 space-y-4">
            <Input 
              label="Nom de l'alerte" 
              value={newAlert.name}
              onChange={(e) => setNewAlert({...newAlert, name: e.target.value})}
            />
            
            <Select
              label="Région concernée"
              value={newAlert.region}
              onChange={(value) => setNewAlert({...newAlert, region: value})}
            >
              {Object.keys(regionsData).map(region => (
                <Option key={region} value={region}>{region}</Option>
              ))}
            </Select>
            
            <Select
              label="Niveau de sévérité"
              value={newAlert.severity}
              onChange={(value) => setNewAlert({...newAlert, severity: value})}
            >
              <Option value="low">Faible</Option>
              <Option value="medium">Moyen</Option>
              <Option value="high">Élevé</Option>
              <Option value="critical">Critique</Option>
            </Select>
          </div>
          
          <div className="py-4">
            <Textarea
              label="Description détaillée"
              rows={5}
              value={newAlert.description}
              onChange={(e) => setNewAlert({...newAlert, description: e.target.value})}
            />
          </div>
          
          <div className="pt-4">
            <label className="flex items-center gap-2 text-blue-gray-500 cursor-pointer">
              <PaperClipIcon className="h-5 w-5" />
              <span>Joindre un fichier (PDF, image)</span>
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </label>
            {newAlert.file && (
              <Typography variant="small" className="mt-2 text-green-500">
                {newAlert.file.name} sélectionné
              </Typography>
            )}
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="outlined" onClick={() => setOpenModal(false)}>
            Annuler
          </Button>
          <Button color="red" onClick={handleSubmitAlert}>
            Créer l'alerte
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Modal Rapport */}
      <Dialog 
        open={openReportModal} 
        handler={() => setOpenReportModal(!openReportModal)} 
        size="xl"
        className="relative" // Ajout de cette classe
      >
        <DialogHeader className="flex justify-between items-center sticky top-0 bg-white z-10">
          <span>Rapport d'urgence - {selectedRegion}</span>
          <IconButton variant="text" onClick={() => setOpenReportModal(false)}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </DialogHeader>
        
        <DialogBody className="overflow-y-auto max-h-[60vh]"> {/* Modifié ici */}
          <div 
            className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap font-mono text-sm"
            ref={reportRef}
          >
            {reportContent}
          </div>
        </DialogBody>
        
        <DialogFooter className="sticky bottom-0 bg-white border-t border-gray-200 z-10"> {/* Modifié ici */}
          <Button variant="outlined" onClick={() => setOpenReportModal(false)}>
            Fermer
          </Button>
          <Button 
            color="green" 
            className="flex items-center gap-2 mx-2"
            onClick={downloadPDFReport}
          >
            <DocumentArrowDownIcon className="h-4 w-4" />
            Télécharger en PDF
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Alert;