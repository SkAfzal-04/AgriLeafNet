import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-br from-green-900 to-green-700 text-white mt-20">

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand Section */}
        <div>
          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="AgriLeafNet Logo"
              className="
                w-8 h-8
                rounded-full 
                object-cover 
                shadow-lg 
                border border-green-300
              "
            />
            <h2 className="text-3xl font-extrabold tracking-wide">
              AgriLeafNet
            </h2>
          </div>

          <p className="text-green-100 mt-4 text-sm leading-relaxed">
            AI-powered crop disease detection to support sustainable farming.
            Helping farmers grow healthier crops with next-gen technology.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-green-100 text-sm">

            <li
              onClick={() => navigate("/")}
              className="cursor-pointer hover:text-white transition"
            >
              Home
            </li>

            <li
              onClick={() => navigate("/about")}
              className="cursor-pointer hover:text-white transition"
            >
              About
            </li>

            <li
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                navigate("/#upload");
              }}
              className="cursor-pointer hover:text-white transition"
            >
              Upload
            </li>

          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Contact</h3>

          <p className="text-green-100 text-sm">
            Email: support@agrileafnet.com
          </p>

          <p className="text-green-100 text-sm mt-1">
            Empowering global farmers using AI-driven agriculture solutions 🌍
          </p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-600 text-center py-4 text-sm flex justify-center items-center gap-3 text-green-100">
        © 2025 AgriLeafNet — Empowering Farmers with AI
        <img
          src="/logo.png"
          alt="AgriLeafNet Logo"
          className="
            w-8 h-8 
            rounded-full 
            object-cover 
            border border-green-300
          "
        />
      </div>
    </footer>
  );
}
