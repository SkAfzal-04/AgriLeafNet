export default function Hero() {
  return (
    <section className="text-center py-16 bg-gradient-to-r from-green-200 to-green-50">
      <h2 className="text-4xl font-bold mb-4">Detect Crop Diseases Instantly 🌱</h2>
      <p className="text-lg mb-8 text-gray-600">
        Upload a photo of your crop leaf and let AI identify the disease for you.
      </p>
      <a href="#upload" className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-secondary transition">
        Get Started
      </a>
    </section>
  );
}
