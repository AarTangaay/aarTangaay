import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Chip,
  Progress,
  Button,
  IconButton,
  Tooltip,
  Avatar
} from "@material-tailwind/react";
import {
  BellIcon,
  ExclamationTriangleIcon,
  FireIcon,
  MapPinIcon,
  ClockIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  InformationCircleIcon,
  XMarkIcon
} from "@heroicons/react/24/solid";

export function Notifications() {
  // Données de simulation
  const heatwaveStats = {
    currentTemp: 42.5,
    alertLevel: "Rouge",
    affectedRegions: ["Dakar", "Thiès", "Saint-Louis"],
    trend: "increase",
    next48h: "+3.2°C"
  };

  const notifications = [
    {
      id: 1,
      type: "urgence",
      title: "Alerte canicule extrême",
      region: "Dakar",
      time: "10:30 AM",
      date: "15 Juin 2023",
      description: "Température record de 45°C enregistrée à Pikine",
      icon: <FireIcon className="h-5 w-5" />,
      read: false
    },
    {
      id: 2,
      type: "avertissement",
      title: "Niveau d'alerte élevé",
      region: "Thiès",
      time: "Hier",
      date: "14 Juin 2023",
      description: "Prévisions de températures >40°C pour les 3 prochains jours",
      icon: <ExclamationTriangleIcon className="h-5 w-5" />,
      read: true
    },
    {
      id: 3,
      type: "info",
      title: "Mise à jour des données",
      region: "National",
      time: "12 Juin 2023",
      date: "12 Juin 2023",
      description: "Nouvelles stations météo ajoutées dans la région de Matam",
      icon: <InformationCircleIcon className="h-5 w-5" />,
      read: true
    }
  ];

  const stats = [
    { label: "Alertes actives", value: 12, trend: "up" },
    { label: "Régions affectées", value: 7, trend: "same" },
    { label: "Température max", value: 45.2, unit: "°C", trend: "up" },
    { label: "Jours consécutifs", value: 18, trend: "up" }
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <Typography variant="h2" className="text-2xl md:text-3xl font-bold text-gray-900">
            Tableau de bord des alertes
          </Typography>
          <Typography variant="paragraph" className="text-gray-600">
            Surveillance en temps réel des vagues de chaleur au Sénégal
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outlined" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>15 Juin 2023</span>
          </Button>
          <Tooltip content="Actualiser les données">
            <IconButton variant="text">
              <ArrowTrendingUpIcon className="h-5 w-5" />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-sm border border-gray-100">
            <CardBody className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <Typography variant="h6" className="text-gray-700 font-medium">
                    {stat.label}
                  </Typography>
                  <Typography variant="h3" className="mt-2 text-2xl font-bold">
                    {stat.value}
                    {stat.unit && <span className="text-sm ml-1">{stat.unit}</span>}
                  </Typography>
                </div>
                <Chip
                  variant="ghost"
                  color={stat.trend === "up" ? "red" : "green"}
                  value={
                    <div className="flex items-center gap-1">
                      {stat.trend === "up" ? "↑" : "→"} 
                      {stat.trend === "up" ? "5.2%" : "0%"}
                    </div>
                  }
                  className="rounded-full"
                />
              </div>
              <Progress
                value={stat.trend === "up" ? 75 : 50}
                color={stat.trend === "up" ? "red" : "green"}
                className="mt-4"
              />
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Alertes en cours */}
        <Card className="flex-1 shadow-sm border border-gray-100">
          <CardHeader
            floated={false}
            shadow={false}
            className="border-b border-gray-200 p-4"
          >
            <div className="flex items-center justify-between">
              <Typography variant="h5" className="flex items-center gap-2">
                <BellIcon className="h-5 w-5 text-red-500" />
                Alertes actives
              </Typography>
              <Chip
                value={`${notifications.filter(n => !n.read).length} non lues`}
                color="red"
                variant="ghost"
                className="rounded-full"
              />
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-red-50" : ""}`}
                >
                  <div className="flex gap-3">
                    <div className={`flex items-center justify-center h-10 w-10 rounded-full border-2 
                      ${notification.type === "urgence" ? "border-red-500 bg-red-100 text-red-500" : 
                        notification.type === "avertissement" ? "border-orange-500 bg-orange-100 text-orange-500" : 
                        "border-blue-500 bg-blue-100 text-blue-500"}`}>
                      {notification.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Typography variant="h6" className="font-medium">
                          {notification.title}
                        </Typography>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <ClockIcon className="h-4 w-4" />
                          {notification.time}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPinIcon className="h-4 w-4 text-gray-400" />
                        <Typography variant="small" className="text-gray-600">
                          {notification.region}
                        </Typography>
                      </div>
                      <Typography variant="paragraph" className="mt-2 text-gray-700">
                        {notification.description}
                      </Typography>
                    </div>
                    <IconButton variant="text" size="sm" className="self-start">
                      <XMarkIcon className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Carte de chaleur */}
        <Card className="lg:w-1/3 shadow-sm border border-gray-100">
          <CardHeader
            floated={false}
            shadow={false}
            className="border-b border-gray-200 p-4"
          >
            <Typography variant="h5" className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-red-500" />
              Carte thermique
            </Typography>
          </CardHeader>
          <CardBody className="p-4">
            <div className="bg-gradient-to-br from-yellow-50 to-red-100 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <FireIcon className="h-12 w-12 text-red-500 mx-auto mb-2" />
                <Typography variant="h5" className="text-gray-700">
                  Carte interactive
                </Typography>
                <Typography variant="small" className="text-gray-500">
                  Visualisation des températures par région
                </Typography>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {heatwaveStats.affectedRegions.map((region, index) => (
                <div key={index} className="flex items-center justify-between">
                  <Typography variant="small" className="font-medium">
                    {region}
                  </Typography>
                  <Chip
                    value="42-45°C"
                    color="red"
                    variant="ghost"
                    className="rounded-full"
                  />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Notifications;