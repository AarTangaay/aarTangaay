import { Typography } from "@material-tailwind/react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t py-4 px-4">
      <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center text-center text-gray-700">
        <Typography variant="small" className="font-medium">
          &copy; {year} AarTangaay
        </Typography>
        <Typography variant="small" className="text-sm text-gray-500">
          Application de gestion des vagues de chaleur au Sénégal
        </Typography>
      </div>
    </footer>
  );
}

export default Footer;
