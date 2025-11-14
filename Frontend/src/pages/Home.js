import { useState } from "react";
import axios from "axios";
import { Loader2, Upload } from "lucide-react";

export default function Home() {

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please upload an image first!");

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "https://Afzal-04-AgriLeafNet.hf.space/predict",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResult({
        prediction: res.data.prediction,
        confidence: res.data.confidence,
        imageUrl: `https://Afzal-04-AgriLeafNet.hf.space/view_image/${file.name}`,
      });
    } catch (err) {
      console.error(err);
      alert("Prediction failed. Please check backend!");
    } finally {
      setLoading(false);
    }
  };

  // DISEASE-SPECIFIC MESSAGES
  const getAdvice = (label) => {
    switch (label) {
      case "Potato___Late_blight":
        return {
          title: "Fertilizer Advice for Late Blight",
          message:
            "Late Blight is caused by *Phytophthora infestans*. Improve plant defense with Phosphite fertilizers and Calcium sprays.",
          points: [
            "Use Phosphorous Acid / Potassium Phosphite (K-Phite / Dimiphite). Helps activate plant immunity.",
            "Apply Calcium Nitrate to strengthen plant cell walls.",
            "Use foliar sprays, especially during cool & humid weather."
          ]
        };

      case "Potato___Early_blight":
        return {
          title: "Fertilizer Advice for Early Blight",
          message:
            "Early Blight spreads faster in weak or nutrient-stressed plants. Maintain balanced NPK to keep foliage healthy.",
          points: [
            "Use controlled Nitrogen (Urea or CAN). Avoid excess nitrogen.",
            "Apply Potassium (MOP) to improve stress resistance.",
            "Maintain a regular NPK schedule to delay leaf aging."
          ]
        };

      case "Potato___healthy":
        return {
          title: "Your Plant Looks Healthy! 🌱",
          message:
            "Great news! Your leaf appears healthy. Maintain a preventive care routine to keep diseases away.",
          points: [
            "Start a preventive spray: Mancozeb (Indofil M-45) or Chlorothalonil (Kavach).",
            "Repeat every 7–10 days to protect new growth.",
            "Ensure soil has enough Potassium, Zinc, and Boron."
          ]
        };

      default:
        return null;
    }
  };

  const advice = result ? getAdvice(result.prediction) : null;

  return (
    <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 to-green-200 py-10">
      <div className="w-full max-w-3xl p-8 rounded-3xl bg-white/60 backdrop-blur-xl shadow-xl border border-white/40">

        {/* TITLE */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 text-center drop-shadow-sm">
          AgriLeafNet 🌱
        </h1>
        <p className="text-gray-700 text-center mt-3 text-sm md:text-base">
          Upload a potato leaf image to detect Early Blight, Late Blight, or Healthy conditions.
        </p>

        {/* UPLOAD BOX */}
        <label className="w-full mt-8 flex flex-col items-center justify-center border-2 border-dashed border-green-400 rounded-xl py-10 cursor-pointer hover:bg-green-50 transition">
          <Upload className="text-green-600 mb-3" size={42} />
          <span className="text-gray-700 font-medium text-center">
            Click to select a leaf image
          </span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>

        {/* PREVIEW */}
        {preview && (
          <div className="mt-6 text-center">
            <img
              src={preview}
              alt="Preview"
              className="w-56 h-56 object-cover mx-auto rounded-xl border shadow-md"
            />
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`w-full mt-5 py-3 rounded-xl font-semibold text-white text-lg flex justify-center items-center gap-2 transition-all duration-300
            ${loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 shadow-md"}
          `}
        >
          {loading ? <Loader2 className="animate-spin" size={22} /> : "Analyze Leaf"}
        </button>

        {/* RESULT CARD */}
        {result && (
          <div className="mt-10 bg-green-100/70 border border-green-300 rounded-xl p-6 shadow-inner">

            <h3 className="text-2xl font-bold text-green-800 text-center">
              {result.prediction.replace(/_/g, " ")}
            </h3>
            <p className="text-green-700 font-medium text-center mb-4">
              Confidence: {result.confidence}%
            </p>

            <img
              src={result.imageUrl}
              alt="Processed Leaf"
              className="mt-3 w-64 h-64 object-cover mx-auto rounded-xl border shadow-md"
            />

            {/* ADVICE SECTION */}
            {advice && (
              <div className="mt-6 bg-white/80 p-4 rounded-xl border shadow-sm">
                <h4 className="text-xl font-bold text-green-700 text-center">
                  {advice.title}
                </h4>
                <p className="text-gray-700 mt-1 text-center">{advice.message}</p>

                <ul className="mt-3 space-y-1 text-gray-800 list-disc list-inside">
                  {advice.points.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        )}
      </div>
    </section>
  );
}
