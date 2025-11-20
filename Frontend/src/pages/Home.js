import { useState } from "react";
import axios from "axios";
import { Loader2, Upload } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🌍 Language State
  const [lang, setLang] = useState("en");

  const toggleLanguage = () => setLang(lang === "en" ? "bn" : "en");

  const uiText = {
    en: {
      title: "AgriLeafNet 🌱",
      subtitle: "Upload a potato leaf to detect disease category & infection type.",
      select: "Click to select a leaf image",
      analyze: "Analyze Leaf",
      category: "Category",
      confidence: "Confidence",
      diseaseType: "Disease Type",
      sprays: "Recommended Sprays:",
      fertilizers: "Fertilizers:",
      sprays2: "Sprays:",
      toggle: "Switch to Bengali"
    },
    bn: {
      title: "AgriLeafNet 🌱",
      subtitle: "আলুর পাতার ছবি আপলোড করুন রোগ শনাক্ত করতে।",
      select: "পাতার ছবি নির্বাচন করতে ক্লিক করুন",
      analyze: "পাতা বিশ্লেষণ করুন",
      category: "শ্রেণী",
      confidence: "নিশ্চয়তা",
      diseaseType: "রোগের ধরন",
      sprays: "প্রস্তাবিত স্প্রে:",
      fertilizers: "সার:",
      sprays2: "স্প্রে:",
      toggle: "Switch to English"
    }
  };

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
      console.log(res.data);
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

  // 🔥 Bengali names + descriptions
  const diseaseNamesBN = {
    "Potato___Early_blight": "আর্লি ব্লাইট (আগাম ধ্বসা)",
    "Potato___Late_blight": "লেইট ব্লাইট (নাবী ধ্বসা)",
    "Potato___healthy": "সুস্থ পাতা",
  };

  const typeNamesBN = {
    "Bacteria": "ব্যাকটেরিয়া সংক্রমণ",
    "Fungi": "ছত্রাক সংক্রমণ",
    "Healthy": "সুস্থ",
    "Nematode": "নেমাটোড আক্রান্ত",
    "Pest": "পোকার আক্রমণ",
    "Phytopthora": "ফাইটোফথোরা",
    "Virus": "ভাইরাস সংক্রমণ",
  };

  // 🌿 Advice System
  const getCombinedAdvice = (category, type) => {
    const baseAdvice = {
      "Potato___Early_blight": {
        en: {
          title: "Early Blight Management",
          message: "Early Blight weakens the plant and spreads fast.",
        },
        bn: {
          title: "আগাম ধ্বসা ব্যবস্থাপনা",
          message: "আগাম ধ্বসা গাছকে দুর্বল করে এবং দ্রুত ছড়ায়।",
        },
        sprays: ["Mancozeb", "Chlorothalonil", "Copper Oxychloride"],
        fertilizers: ["NPK", "Potassium", "Calcium Nitrate"]
      },

      "Potato___Late_blight": {
        en: {
          title: "Late Blight Management",
          message: "Highly destructive! Immediate action required.",
        },
        bn: {
          title: "নাবী ধ্বসা ব্যবস্থাপনা",
          message: "অত্যন্ত বিধ্বংসী! দ্রুত ব্যবস্থা নেওয়া জরুরি।",
        },
        sprays: ["Ridomil Gold", "Potassium Phosphite", "Cyazofamid"],
        fertilizers: ["Calcium Nitrate", "Potassium", "Immunity boosters"]
      },

      "Potato___healthy": {
        en: {
          title: "Healthy Leaf 🌱",
          message: "Your plant looks healthy.",
        },
        bn: {
          title: "সুস্থ পাতা 🌱",
          message: "আপনার গাছ সুস্থ রয়েছে।",
        },
        sprays: ["Neem oil", "Preventive Mancozeb"],
        fertilizers: ["Organic compost", "Zinc + Boron"]
      }
    };

    const typeAdvice = {
  "Bacteria": {
    en: { title: "Bacterial Infection Detected", notes: "Avoid overhead irrigation." },
    bn: { title: "ব্যাকটেরিয়া সংক্রমণ", notes: "গাছের উপর দিয়ে পানি দেওয়া এড়িয়ে চলুন।" },
    sprays: ["Copper Hydroxide", "Bordeaux Mixture"]
  },

  "Fungi": {
    en: { title: "Fungal Infection Detected", notes: "Apply fungicides in dry hours." },
    bn: { title: "ছত্রাক সংক্রমণ", notes: "শুকনো আবহাওয়ায় স্প্রে করুন।" },
    sprays: ["Hexaconazole", "Tebuconazole"]
  },

  "Virus": {
    en: { title: "Viral Infection", notes: "No cure—remove infected plants." },
    bn: { title: "ভাইরাস সংক্রমণ", notes: "এর কোনো চিকিৎসা নেই—সংক্রমিত গাছ তুলে ফেলুন।" },
    sprays: []
  },

  "Phytopthora": {
    en: { title: "Phytophthora Infection", notes: "Apply systemic fungicides early." },
    bn: { title: "ফাইটোফথোরা সংক্রমণ", notes: "শুরুর দিকেই সিস্টেমিক ফাংগিসাইড ব্যবহার করুন।" },
    sprays: ["Metalaxyl", "Fosetyl-Al"]
  },

  "Pest": {
    en: { title: "Pest Attack Detected", notes: "Control pests using safe insecticides." },
    bn: { title: "পোকার আক্রমণ", notes: "নিরাপদ কীটনাশক ব্যবহার করুন।" },
    sprays: ["Lambda Cyhalothrin", "Imidacloprid"]
  },

  "Nematode": {
    en: { title: "Nematode Infection", notes: "Soil treatment recommended." },
    bn: { title: "নেমাটোড সংক্রমণ", notes: "মাটির চিকিৎসা অত্যন্ত জরুরি।" },
    sprays: ["Carbofuran", "Phorate"]
  },

  "Healthy": {
    en: { title: "Healthy Type", notes: "No infection detected." },
    bn: { title: "সুস্থ", notes: "কোনো সংক্রমণ নেই।" },
    sprays: []
  }
};

    return {
      categoryAdvice: baseAdvice[category],
      typeAdvice: typeAdvice[type],
    };
  };

  const advice = result ? getCombinedAdvice(result.category, result.type) : null;

  return (
    <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 to-green-200 py-10">
      <div className="w-full max-w-3xl p-8 rounded-3xl bg-white/60 backdrop-blur-xl shadow-xl border border-white/40">

        {/* 🌍 Language Toggle*/}
        <button
          onClick={toggleLanguage}
          className="mb-4 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-xl"
        >
          {uiText[lang].toggle}
        </button>

        <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 text-center">
          {uiText[lang].title}
        </h1>
        <p className="text-gray-700 text-center mt-2">
          {uiText[lang].subtitle}
        </p>

        {/* Upload Box */}
        <label className="w-full mt-8 flex flex-col items-center justify-center border-2 border-dashed border-green-400 rounded-xl py-10 cursor-pointer hover:bg-green-50 transition">
          <Upload className="text-green-600 mb-3" size={42} />
          <span className="text-gray-700 font-medium">{uiText[lang].select}</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>

        {/* Preview */}
        {preview && (
          <div className="mt-6 text-center">
            <img src={preview} className="w-56 h-56 object-cover mx-auto rounded-xl border shadow-md" />
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`w-full mt-5 py-3 rounded-xl font-semibold text-white text-lg flex justify-center items-center gap-2
            ${loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"}
          `}
        >
          {loading ? <Loader2 className="animate-spin" size={22} /> : uiText[lang].analyze}
        </button>

        {/* RESULT CARD */}
        {result && (
          <div className="mt-10 bg-green-100/70 border border-green-300 rounded-xl p-6">

            <h3 className="text-2xl font-bold text-green-800 text-center">
              {lang === "en"
                ? result.category.replace(/_/g, " ")
                : diseaseNamesBN[result.category]}
            </h3>

            <p className="text-green-700 font-medium text-center">
              {uiText[lang].confidence}: {result.category_conf}%
            </p>

            <h3 className="text-xl font-bold text-green-700 text-center mt-4">
              {uiText[lang].diseaseType}:{" "}
              {lang === "en" ? result.type : typeNamesBN[result.type]}
            </h3>

            <p className="text-gray-700 text-center">
              {uiText[lang].confidence}: {result.type_conf}%
            </p>

            {/* Advice */}
            {advice && (
              <div className="mt-6 bg-white p-4 rounded-xl border shadow">

                {/* Category Advice */}
                <h4 className="text-xl font-bold text-green-700">
                  {advice.categoryAdvice[lang].title}
                </h4>
                <p className="text-gray-700 mt-1">
                  {advice.categoryAdvice[lang].message}
                </p>

                <h5 className="mt-2 font-semibold">{uiText[lang].sprays}</h5>
                <ul className="list-disc list-inside text-gray-800">
                  {advice.categoryAdvice.sprays.map((p, i) => <li key={i}>{p}</li>)}
                </ul>

                <h5 className="mt-2 font-semibold">{uiText[lang].fertilizers}</h5>
                <ul className="list-disc list-inside text-gray-800">
                  {advice.categoryAdvice.fertilizers.map((p, i) => <li key={i}>{p}</li>)}
                </ul>

                <hr className="my-4" />

                {/* Type advice */}
                <h4 className="text-xl font-bold text-green-700">
                  {advice.typeAdvice[lang].title}
                </h4>

                <h5 className="mt-2 font-semibold">{uiText[lang].sprays2}</h5>
                <ul className="list-disc list-inside text-gray-800">
                  {advice.typeAdvice.sprays.map((p, i) => <li key={i}>{p}</li>)}
                </ul>

                <p className="mt-2 text-gray-700 italic">
                  {advice.typeAdvice[lang].notes}
                </p>

              </div>
            )}

          </div>
        )}
      </div>
    </section>
  );
}
