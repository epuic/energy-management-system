import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <>
      <Navbar />
      <div style={{ padding: 16 }}>
        <Outlet />
      </div>
    </>
  );
}
