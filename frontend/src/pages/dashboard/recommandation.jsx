import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Avatar,
  Tabs,
  TabsHeader,
  Tab,
} from "@material-tailwind/react";
import {
  PauseIcon,
  PlayIcon,
  ExclamationTriangleIcon,
  SunIcon,
  DevicePhoneMobileIcon,
  HomeIcon,
  UserGroupIcon,
  HeartIcon,
  CheckIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";

export function Recommendation() {
  const [playingId, setPlayingId] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [synth, setSynth] = useState(null);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const voiceSelectorRef = useRef(null);

  // Gestion du clic en dehors du sélecteur de voix
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (voiceSelectorRef.current && !voiceSelectorRef.current.contains(event.target)) {
        setShowVoiceSelector(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Initialiser la synthèse vocale
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      setSynth(synth);

      const loadVoices = () => {
        const availableVoices = synth.getVoices();
        setVoices(availableVoices);
        
        const frenchVoice = availableVoices.find(v => v.lang.includes('fr')) || 
                          availableVoices.find(v => v.lang.includes('FR'));
        if (frenchVoice) {
          setSelectedVoice(frenchVoice);
        } else if (availableVoices.length > 0) {
          setSelectedVoice(availableVoices[0]);
        }
      };

      synth.onvoiceschanged = loadVoices;
      loadVoices();
    }
  }, []);

  const togglePlay = (rec) => {
    if (!synth || !selectedVoice) {
      alert("La synthèse vocale n'est pas disponible");
      return;
    }

    if (playingId === rec.id) {
      synth.cancel();
      setPlayingId(null);
    } else {
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance();
      utterance.text = `${rec.title}. ${rec.description}`;
      utterance.voice = selectedVoice;
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onend = () => setPlayingId(null);
      utterance.onerror = () => setPlayingId(null);

      synth.speak(utterance);
      setPlayingId(rec.id);
    }
  };

  const categories = [
    { label: "Général", value: "general", icon: <SunIcon className="h-5 w-5" /> },
    { label: "Hydratation", value: "hydration", icon: <DevicePhoneMobileIcon className="h-5 w-5" /> },
    { label: "Logement", value: "housing", icon: <HomeIcon className="h-5 w-5" /> },
    { label: "Vulnérables", value: "vulnerable", icon: <UserGroupIcon className="h-5 w-5" /> },
    { label: "Urgences", value: "health", icon: <ExclamationTriangleIcon className="h-5 w-5" /> },
  ];

  const recommendations = {
    general: [
      {
        id: 1,
        title: "Évitez le soleil aux heures chaudes",
        description: "Entre 11h et 16h, restez à l'ombre ou à l'intérieur. Privilégiez les activités matinales.",
        severity: "high",
        duration: "1 min",
      },
      {
        id: 2,
        title: "Vêtements adaptés",
        description: "Portez des vêtements légers et amples de couleur claire. Chapeau et lunettes de soleil recommandés.",
        severity: "medium",
        duration: "1 min",
      },
    ],
    hydration: [
      {
        id: 3,
        title: "Buvez régulièrement",
        description: "Au moins 1,5L d'eau par jour. Évitez alcool et caféine qui déshydratent.",
        severity: "high",
        duration: "1 min",
      },
    ],
    housing: [
      {
        id: 4,
        title: "Rafraîchissez votre maison",
        description: "Fermez volets la journée, aérez la nuit. Utilisez ventilateurs avec bol d'eau glacée.",
        severity: "medium",
        duration: "1 min",
      },
    ],
    vulnerable: [
      {
        id: 5,
        title: "Protégez les personnes fragiles",
        description: "Vérifiez régulièrement les enfants, seniors et malades. Offrez-leur de l'eau fréquemment.",
        severity: "high",
        duration: "1 min",
      },
    ],
    health: [
      {
        id: 6,
        title: "Signes d'urgence",
        description: "Si forte fièvre, peau sèche, confusion ou évanouissement : appelez immédiatement le 15.",
        severity: "critical",
        duration: "1 min",
      },
    ],
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* En-tête avec sélecteur de voix - Nouvelle version */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <Typography variant="h2" className="text-2xl md:text-3xl font-bold text-gray-900">
            Recommandations Canicule
          </Typography>
          <Typography variant="paragraph" className="text-gray-600">
            Protégez-vous pendant les vagues de chaleur
          </Typography>
        </div>
        
        {voices.length > 0 && (
          <div className="relative" ref={voiceSelectorRef}>
            <Button 
              variant="outlined" 
              size="sm"
              onClick={() => setShowVoiceSelector(!showVoiceSelector)}
              className="flex items-center gap-2 pr-3"
            >
              <span className="truncate max-w-[120px]">Voix: {selectedVoice?.name || 'Défaut'}</span>
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${showVoiceSelector ? 'rotate-180' : ''}`} />
            </Button>
            
            {showVoiceSelector && (
              <div className="absolute right-0 mt-1 w-64 bg-white rounded-md shadow-xl z-50 border border-gray-200">
                <div className="p-2 border-b border-gray-200">
                  <Typography variant="small" className="font-bold text-gray-700">
                    Sélectionnez une voix
                  </Typography>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {voices.map((voice) => (
                    <div
                      key={voice.voiceURI}
                      onClick={() => {
                        setSelectedVoice(voice);
                        setShowVoiceSelector(false);
                      }}
                      className={`p-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between ${
                        selectedVoice?.voiceURI === voice.voiceURI ? 'bg-blue-100' : ''
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <Typography variant="small" className="font-medium truncate">
                          {voice.name}
                        </Typography>
                        <Typography variant="small" className="text-gray-600 text-xs truncate">
                          {voice.lang} {voice.default && '(Défaut)'}
                        </Typography>
                      </div>
                      {selectedVoice?.voiceURI === voice.voiceURI && (
                        <CheckIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Barre d'onglets - Nouvelle version */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {categories.map(({ label, value, icon }) => (
              <button
                key={value}
                onClick={() => {
                  if (synth) synth.cancel();
                  setPlayingId(null);
                  setActiveTab(value);
                }}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === value
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {React.cloneElement(icon, {
                  className: `h-5 w-5 ${
                    activeTab === value ? 'text-red-500' : 'text-gray-400'
                  }`,
                })}
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Liste des recommandations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations[activeTab]?.map((rec) => (
          <Card key={rec.id} className="shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <CardHeader
              floated={false}
              shadow={false}
              className={`p-4 ${
                rec.severity === "critical" ? "bg-red-50 border-b border-red-200" :
                rec.severity === "high" ? "bg-orange-50 border-b border-orange-200" :
                "bg-blue-50 border-b border-blue-200"
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <Typography variant="h5" className="font-bold text-gray-900">
                  {rec.title}
                </Typography>
                <Chip
                  value={rec.duration}
                  size="sm"
                  color={
                    rec.severity === "critical" ? "red" :
                    rec.severity === "high" ? "orange" : "blue"
                  }
                  className="rounded-full"
                />
              </div>
            </CardHeader>
            <CardBody className="p-4">
              <Typography variant="paragraph" className="text-gray-700 mb-4">
                {rec.description}
              </Typography>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <Avatar
                   src="/img/logo-senegal.jpg"
                  alt="Logo Sénégal"
                  size="sm"
                  className="border border-gray-200"
                />
                
                <Tooltip content={playingId === rec.id ? "Arrêter" : "Écouter"}>
                  <IconButton
                    variant="gradient"
                    size="sm"
                    color={
                      rec.severity === "critical" ? "red" :
                      rec.severity === "high" ? "orange" : "blue"
                    }
                    onClick={() => togglePlay(rec)}
                  >
                    {playingId === rec.id ? (
                      <PauseIcon className="h-4 w-4" />
                    ) : (
                      <PlayIcon className="h-4 w-4" />
                    )}
                  </IconButton>
                </Tooltip>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Bandeau d'urgence */}
      <div className="mt-8 bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <ExclamationTriangleIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <Typography variant="h5" className="text-white font-bold">
              Urgence médicale
            </Typography>
            <Typography variant="small" className="text-white/90">
              En cas de coup de chaleur
            </Typography>
          </div>
        </div>
        <Button
          variant="filled"
          color="white"
          className="text-red-600 font-bold shadow-md hover:shadow-lg"
          onClick={() => window.location.href = "tel:15"}
        >
          <span className="text-lg">☎</span> Appeler le 15
        </Button>
      </div>
    </div>
  );
}

export default Recommendation;