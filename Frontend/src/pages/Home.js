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
        "https://afzal-04-agrileafnet.hf.space/predict",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResult({
        category: res.data.category_prediction,
        category_conf: res.data.category_confidence,
        type: res.data.disease_type_prediction,
        type_conf: res.data.disease_type_confidence,
        imageUrl: `https://afzal-04-agrileafnet.hf.space/view_image/${file.name}`,
      });

    } catch (err) {
      console.error(err);
      alert("Prediction failed! Backend error.");
    } finally {
      setLoading(false);
    }
  };

  // 🌿🔥 ADVICE SYSTEM (Combined Model 1 + Model 2)
  const getCombinedAdvice = (category, type) => {
    const baseAdvice = {
      "Potato___Early_blight": {
        title: "Early Blight Management",
        message: "Early Blight weakens the plant and spreads fast in weak soil.",
        sprays: [
          "Mancozeb (Indofil M-45)",
          "Chlorothalonil (Kavach)",
          "Copper Oxychloride"
        ],
        fertilizers: [
          "Balanced NPK (10:26:26 or 13:40:13)",
          "Potassium (MOP)",
          "Calcium Nitrate"
        ]
      },

      "Potato___Late_blight": {
        title: "Late Blight Management",
        message: "Late Blight is highly destructive and requires fast action.",
        sprays: [
          "Metalaxyl + Mancozeb (Ridomil Gold)",
          "Potassium Phosphite",
          "Cyazofamid / Dimethomorph"
        ],
        fertilizers: [
          "Calcium Nitrate",
          "Potassium-rich fertilizer",
          "Phosphite-based immunity boosters"
        ]
      },

      "Potato___healthy": {
        title: "Healthy Leaf 🌱",
        message: "Your plant looks healthy. Maintain preventive care.",
        sprays: [
          "Preventive Mancozeb spray",
          "Neem oil (natural protection)"
        ],
        fertilizers: [
          "Zinc + Boron mix",
          "Steady organic compost",
        ]
      }
    };

    const diseaseAdvice = {
      "Bacteria": {
        title: "Bacterial Infection Detected",
        sprays: ["Copper Hydroxide", "Bordeaux Mixture"],
        notes: "Avoid overhead irrigation."
      },
      "Fungi": {
        title: "Fungal Infection Detected",
        sprays: ["Hexaconazole", "Tebuconazole", "Carbendazim"],
        notes: "Apply fungicides during dry hours."
      },
      "Nematode": {
        title: "Nematode Infestation",
        sprays: ["Neem cake", "Carbofuran (restricted use)", "Paecilomyces fungi"],
        notes: "Use soil solarization."
      },
      "Pest": {
        title: "Pest Damage Detected",
        sprays: ["Imidacloprid", "Spinosad", "Neem oil"],
        notes: "Check leaves for insects regularly."
      },
      "Phytopthora": {
        title: "Phytophthora Detected",
        sprays: ["Metalaxyl", "Phosphite spray"],
        notes: "Improve drainage immediately."
      },
      "Virus": {
        title: "Viral Infection Detected",
        sprays: ["No cure – remove infected plants"],
        notes: "Use resistant potato varieties."
      },
      "Healthy": {
        title: "Looks Healthy",
        sprays: ["Preventive neem spray"],
        notes: "Maintain proper nutrition."
      }
    };

    return { 
      categoryAdvice: baseAdvice[category],
      typeAdvice: diseaseAdvice[type]
    };
  };

  const advice = result ? getCombinedAdvice(result.category, result.type) : null;

  return (
    <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 to-green-200 py-10">
      <div className="w-full max-w-3xl p-8 rounded-3xl bg-white/60 backdrop-blur-xl shadow-xl border border-white/40">

        <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 text-center">
          AgriLeafNet 🌱
        </h1>
        <p className="text-gray-700 text-center mt-2">
          Upload a potato leaf to detect disease category & infection type.
        </p>

        {/* Upload Box */}
        <label className="w-full mt-8 flex flex-col items-center justify-center border-2 border-dashed border-green-400 rounded-xl py-10 cursor-pointer hover:bg-green-50 transition">
          <Upload className="text-green-600 mb-3" size={42} />
          <span className="text-gray-700 font-medium">Click to select a leaf image</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>

        {/* Preview */}
        {preview && (
          <div className="mt-6 text-center">
            <img src={preview} alt="Preview"
              className="w-56 h-56 object-cover mx-auto rounded-xl border shadow-md" />
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`w-full mt-5 py-3 rounded-xl font-semibold text-white text-lg flex justify-center items-center gap-2
            ${loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"}
          `}
        >
          {loading ? <Loader2 className="animate-spin" size={22} /> : "Analyze Leaf"}
        </button>

        {/* RESULT CARD */}
        {result && (
          <div className="mt-10 bg-green-100/70 border border-green-300 rounded-xl p-6">

            <h3 className="text-2xl font-bold text-green-800 text-center">
              {result.category.replace(/_/g, " ")}
            </h3>
            <p className="text-green-700 font-medium text-center">
              Confidence: {result.category_conf}%
            </p>

            <h3 className="text-xl font-bold text-green-700 text-center mt-4">
              Disease Type: {result.type}
            </h3>
            <p className="text-gray-700 text-center">Confidence: {result.type_conf}%</p>

            <img src={result.imageUrl} className="mt-4 w-64 h-64 object-cover mx-auto rounded-xl shadow" />

            {/* Advice */}
            {advice && (
              <div className="mt-6 bg-white p-4 rounded-xl border shadow">

                {/* Category Advice */}
                <h4 className="text-xl font-bold text-green-700">{advice.categoryAdvice.title}</h4>
                <p className="text-gray-700 mt-1">{advice.categoryAdvice.message}</p>

                <h5 className="mt-2 font-semibold">Recommended Sprays:</h5>
                <ul className="list-disc list-inside text-gray-800">
                  {advice.categoryAdvice.sprays.map((p, i) => <li key={i}>{p}</li>)}
                </ul>

                <h5 className="mt-2 font-semibold">Fertilizers:</h5>
                <ul className="list-disc list-inside text-gray-800">
                  {advice.categoryAdvice.fertilizers.map((p, i) => <li key={i}>{p}</li>)}
                </ul>

                {/* Type advice */}
                <hr className="my-4" />
                <h4 className="text-xl font-bold text-green-700">{advice.typeAdvice.title}</h4>

                <h5 className="mt-2 font-semibold">Sprays:</h5>
                <ul className="list-disc list-inside text-gray-800">
                  {advice.typeAdvice.sprays.map((p, i) => <li key={i}>{p}</li>)}
                </ul>

                <p className="mt-2 text-gray-700 italic">{advice.typeAdvice.notes}</p>

              </div>
            )}

          </div>
        )}
      </div>
    </section>
  );
}
