"use client";

import api from "@/services/api";

export default function Navbar() {


  const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch {
    // Abaikan error; tetap arahkan ke login
  }

  window.location.href =
    "/login";

};

  return (

    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">

      <h2 className="font-semibold text-lg">
        Dashboard EduRail
      </h2>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

    </header>
    

  );
}