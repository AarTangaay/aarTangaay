/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors:{
          cool: '#4CAF50',         // Vert – température normale
          warm: '#FFC107',         // Jaune – chaleur modérée
          hot: '#F44336',          // Rouge – chaleur élevée
          extreme: '#B71C1C',     // Rouge foncé – chaleur extrême 
    },
    background: {
          day: '#FAFAFA',          // Fond clair – mode jour
          night: '#263238',        // Fond foncé – mode nuit
        },
    primary: '#03A9F4',           // Bleu – éléments interactifs
        text: {
          light: '#FFFFFF',        // Texte sur fond foncé
          dark: '#212121',         // Texte sur fond clair
        },
    extend: {},
  },
  plugins: [],
});
