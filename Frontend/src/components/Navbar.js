import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-lg shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo + Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/logo.png"
            alt="AgriLeafNet Logo"
            className="w-10 h-10 object-contain"
          />
          <h1 className="text-2xl font-extrabold text-green-700 tracking-wide">
            AgriLeafNet
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-lg font-medium">
          <button
            onClick={() => navigate("/")}
            className="hover:text-green-600 transition"
          >
            Home
          </button>

          <button
            onClick={() => navigate("/about")}
            className="hover:text-green-600 transition"
          >
            About
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-green-700"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-white/90 backdrop-blur-lg shadow-md px-6 py-4 space-y-3 text-lg">
          <button
            onClick={() => {
              navigate("/");
              setOpen(false);
            }}
            className="block w-full text-left hover:text-green-600 transition"
          >
            Home
          </button>

          <button
            onClick={() => {
              navigate("/about");
              setOpen(false);
            }}
            className="block w-full text-left hover:text-green-600 transition"
          >
            About
          </button>
        </div>
      )}
    </nav>
  );
}
