import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import ChatComponent from "./ChatComponent"; // Importăm componenta de chat
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  // Luăm utilizatorul logat direct din AuthContext (unde este decodat JWT-ul)
  const { user } = useAuth();
  const username = user?.username || "Guest";

  return (
    <>
      <Navbar />
      <div style={{ padding: 16 }}>
        <Outlet />
      </div>

      {/* Componenta de chat va sta fixă în colțul ecranului pe orice pagină din Layout */}
      <ChatComponent currentUser={username} />
    </>
  );
}