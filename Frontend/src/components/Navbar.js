export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-primary">🌾 AgriLeafNet</h1>
      <div className="space-x-6">
        <a href="/" className="hover:text-primary">Home</a>
        <a href="/about" className="hover:text-primary">About</a>
      </div>
    </nav>
  );
}
