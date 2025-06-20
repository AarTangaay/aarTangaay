import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Select,
  Option,
  Button,
  IconButton,
  Tooltip,
  Tabs,
  TabsHeader,
  Tab,
  Avatar
} from "@material-tailwind/react";
import {
  ChartBarIcon,
  CalendarIcon,
  MapIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  ClockIcon,
  InformationCircleIcon
} from "@heroicons/react/24/solid";
import  Chart  from "react-apexcharts";
import { StatisticsChart } from "@/widgets/charts";


// Données de démonstration
const temperatureData = {
  chart: {
    type: 'line',
    height: 300,
    toolbar: { show: false },
  },
  series: [{
    name: "Température max",
    data: [38, 40, 42, 41, 43, 45, 44]
  }, {
    name: "Température min",
    data: [28, 30, 31, 32, 33, 34, 33]
  }],
  colors: ['#ef4444', '#3b82f6'],
  xaxis: {
    categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  },
  stroke: { curve: 'smooth', width: 3 },
};

const alertTrends = {
  chart: {
    type: 'bar',
    height: 300,
    stacked: true,
    toolbar: { show: false },
  },
  series: [{
    name: "Alertes Rouges",
    data: [12, 15, 8, 20, 25, 18, 30]
  }, {
    name: "Alertes Orange",
    data: [20, 18, 25, 15, 10, 22, 15]
  }],
  colors: ['#ef4444', '#f97316'],
  xaxis: {
    categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul'],
  },
};

const regionalData = {
  series: [45, 25, 15, 10, 5],
  labels: ['Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor', 'Matam'],
  colors: ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6'],
  chart: {
    height: 300
  }
};


const predictions = {
  chart: {
    type: 'area',
    height: 300,
    toolbar: { show: false },
  },
  series: [{
    name: "Prévisions",
    data: [30, 35, 38, 42, 45, 47, 49]
  }],
  colors: ['#f59e0b'],
  xaxis: {
    categories: ['Aujourd\'hui', '+1j', '+2j', '+3j', '+4j', '+5j', '+6j'],
  },
  stroke: { curve: 'smooth', width: 3 },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3,
    },
  },
};

export function Statistics() {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedRegion, setSelectedRegion] = useState("all");

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Typography variant="h2" className="text-2xl md:text-3xl font-bold text-gray-900">
              Tableau de Bord Statistique
            </Typography>
            <Typography variant="paragraph" className="text-gray-600">
              Analyse avancée des vagues de chaleur au Sénégal
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            <Select
              label="Période"
              value={timeRange}
              onChange={setTimeRange}
              className="w-32"
            >
              <Option value="24h">24 heures</Option>
              <Option value="7d">7 jours</Option>
              <Option value="30d">30 jours</Option>
              <Option value="12m">12 mois</Option>
            </Select>
            <Select
              label="Région"
              value={selectedRegion}
              onChange={setSelectedRegion}
              className="w-40"
              icon={<MapIcon className="h-5 w-5" />}
            >
              <Option value="all">Toutes régions</Option>
              <Option value="dakar">Dakar</Option>
              <Option value="thies">Thiès</Option>
              <Option value="saint-louis">Saint-Louis</Option>
            </Select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Alertes Actives
              </Typography>
              <div className="p-2 rounded-lg bg-red-50 text-red-500">
                <FireIcon className="h-5 w-5" />
              </div>
            </div>
            <Typography variant="h3" className="font-bold">
              24
            </Typography>
            <Typography variant="small" className="flex items-center gap-1 text-red-500">
              <ArrowTrendingUpIcon className="h-4 w-4" />
              +12% vs hier
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-blue-gray-100 shadow-sm">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Personnes Affectées
              </Typography>
              <div className="p-2 rounded-lg bg-orange-50 text-orange-500">
                <UserGroupIcon className="h-5 w-5" />
              </div>
            </div>
            <Typography variant="h3" className="font-bold">
              12,450
            </Typography>
            <Typography variant="small" className="flex items-center gap-1 text-green-500">
              <ArrowTrendingUpIcon className="h-4 w-4" />
              +5% vs hier
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-blue-gray-100 shadow-sm">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Température Max
              </Typography>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-500">
                <ChartBarIcon className="h-5 w-5" />
              </div>
            </div>
            <Typography variant="h3" className="font-bold">
              45.2°C
            </Typography>
            <Typography variant="small" className="flex items-center gap-1 text-red-500">
              <ArrowTrendingUpIcon className="h-4 w-4" />
              Record cette année
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-blue-gray-100 shadow-sm">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Temps de Réponse
              </Typography>
              <div className="p-2 rounded-lg bg-green-50 text-green-500">
                <ClockIcon className="h-5 w-5" />
              </div>
            </div>
            <Typography variant="h3" className="font-bold">
              38min
            </Typography>
            <Typography variant="small" className="flex items-center gap-1 text-green-500">
              <ArrowTrendingUpIcon className="h-4 w-4" />
              -15% vs hier
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <StatisticsChart
            color="blue"
            chart={temperatureData}
            title="Évolution des Températures"
            description="Moyennes journalières sur 7 jours"
            footer={
            <div className="flex items-center gap-2 text-blue-gray-600">
                <CalendarIcon className="h-4 w-4" />
                <Typography variant="small">Données mises à jour il y a 15min</Typography>
            </div>
            }
        />

        <StatisticsChart
            color="red"
            chart={alertTrends}
            title="Tendances des Alertes"
            description="Alertes rouges et orange par mois"
            footer={
            <div className="flex items-center gap-2 text-blue-gray-600">
                <CalendarIcon className="h-4 w-4" />
                <Typography variant="small">Données mensuelles</Typography>
            </div>
            }
        />
        </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader floated={false} shadow={false} className="border-b border-blue-gray-100 p-4">
            <Typography variant="h5" color="blue-gray">
              Répartition Régionale
            </Typography>
          </CardHeader>
          <CardBody className="p-4">
            <Chart
                options={{
                    labels: regionalData.labels,
                    colors: regionalData.colors,
                    legend: {
                    position: 'bottom',
                    }
                }}
                series={regionalData.series}
                type="pie"
                height={regionalData.chart.height}
                />


          </CardBody>
        </Card>

        <Card className="border border-blue-gray-100 shadow-sm lg:col-span-2">
          <CardHeader floated={false} shadow={false} className="border-b border-blue-gray-100 p-4">
            <div className="flex items-center justify-between">
              <Typography variant="h5" color="blue-gray">
                Prévisions des Prochains Jours
              </Typography>
              <Tooltip content="Modèle de prédiction basé sur les données historiques">
                <InformationCircleIcon className="h-5 w-5 text-blue-gray-400" />
              </Tooltip>
            </div>
          </CardHeader>
          <CardBody className="p-4">
            <Chart
                options={{
                    chart: predictions.chart,
                    xaxis: predictions.xaxis,
                    stroke: predictions.stroke,
                    fill: predictions.fill,
                    colors: predictions.colors,
                }}
                series={predictions.series}
                type="area"
                height={predictions.chart.height}
                />

          </CardBody>
          <CardFooter className="border-t border-blue-gray-100 p-4">
            <Typography variant="small" className="text-blue-gray-600">
              <strong>Note :</strong> Modèle prédictif avec une précision estimée à 87%
            </Typography>
          </CardFooter>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="border border-blue-gray-100 shadow-sm">
        <CardHeader floated={false} shadow={false} className="border-b border-blue-gray-100 p-4">
          <Typography variant="h5" color="blue-gray">
            Données Détailées par Région
          </Typography>
        </CardHeader>
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-left">
                  <Typography variant="small" color="blue-gray" className="font-bold">
                    Région
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-left">
                  <Typography variant="small" color="blue-gray" className="font-bold">
                    Temp. Max
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-left">
                  <Typography variant="small" color="blue-gray" className="font-bold">
                    Alertes
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-left">
                  <Typography variant="small" color="blue-gray" className="font-bold">
                    Hospitalisations
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-left">
                  <Typography variant="small" color="blue-gray" className="font-bold">
                    Taux Hydratation
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { region: "Dakar", temp: "45.2°C", alerts: 12, hospital: 24, hydration: "78%" },
                { region: "Thiès", temp: "42.8°C", alerts: 8, hospital: 15, hydration: "82%" },
                { region: "Saint-Louis", temp: "43.5°C", alerts: 10, hospital: 18, hydration: "75%" },
                { region: "Ziguinchor", temp: "40.1°C", alerts: 5, hospital: 8, hydration: "85%" },
                { region: "Matam", temp: "41.7°C", alerts: 7, hospital: 12, hydration: "70%" }
              ].map((row, index) => (
                <tr key={index}>
                  <td className="border-b border-blue-gray-100 p-4">
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      {row.region}
                    </Typography>
                  </td>
                  <td className="border-b border-blue-gray-100 p-4">
                    <Typography variant="small" color="blue-gray">
                      {row.temp}
                    </Typography>
                  </td>
                  <td className="border-b border-blue-gray-100 p-4">
                    <Typography variant="small" color="blue-gray">
                      {row.alerts}
                    </Typography>
                  </td>
                  <td className="border-b border-blue-gray-100 p-4">
                    <Typography variant="small" color="blue-gray">
                      {row.hospital}
                    </Typography>
                  </td>
                  <td className="border-b border-blue-gray-100 p-4">
                    <Typography variant="small" color={parseInt(row.hydration) > 75 ? "green" : "red"} className="font-medium">
                      {row.hydration}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Statistics;