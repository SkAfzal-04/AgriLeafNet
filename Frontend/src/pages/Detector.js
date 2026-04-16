import { useState, useRef } from "react";
import axios from "axios";
import { Loader2, Upload } from "lucide-react";
import { motion } from "framer-motion";

export default function Detector() {

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [lang, setLang] = useState("en");

  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const toggleLanguage = () => setLang(lang === "en" ? "bn" : "en");

  const uiText = {
    en: {
      title: "AgriLeafNet 🌱",
      subtitle: "Upload or capture a potato leaf image to detect disease.",
      analyze: "Analyze Leaf",
      toggle: "Switch to Bengali",
      category: "Category",
      confidence: "Confidence",
      diseaseType: "Disease Type",
      sprays: "Recommended Sprays:",
      fertilizers: "Fertilizers:",
      sprays2: "Sprays:"
    },
    bn: {
      title: "AgriLeafNet 🌱",
      subtitle: "পাতার ছবি আপলোড বা ক্যামেরা দিয়ে তুলে রোগ শনাক্ত করুন।",
      analyze: "পাতা বিশ্লেষণ করুন",
      toggle: "Switch to English",
      category: "শ্রেণী",
      confidence: "নিশ্চয়তা",
      diseaseType: "রোগের ধরন",
      sprays: "প্রস্তাবিত স্প্রে:",
      fertilizers: "সার:",
      sprays2: "স্প্রে:"
    }
  };

  // Upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
    setResult(null);
  };

  // Camera
  const startCamera = async () => {
    setCameraOn(true);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
    videoRef.current.srcObject = stream;
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
      setFile(file);
      setPreview(URL.createObjectURL(file));
    });

    video.srcObject.getTracks().forEach(track => track.stop());
    setCameraOn(false);
  };

  // API
  const handleUpload = async () => {
    if (!file) return alert("Upload image first!");

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "https://afzal-04-agrileafnet.hf.space/predict",
        formData
      );

      if (res.data.is_leaf === false) {
        setResult({ is_leaf: false, message: res.data.message });
        return;
      }

      setResult({
        is_leaf: true,
        category: res.data.category_prediction,
        category_conf: res.data.category_confidence,
        type: res.data.disease_type_prediction,
        type_conf: res.data.disease_type_confidence,
      });

    } catch {
      alert("Error!");
    } finally {
      setLoading(false);
    }
  };

  // 🌿 YOUR FUNCTION (UNCHANGED)
  const getCombinedAdvice = (category, type) => {
    const baseAdvice = {
      "Potato___Early_blight": {
        en: { title: "Early Blight Management", message: "Early Blight weakens the plant and spreads fast." },
        bn: { title: "আগাম ধ্বসা ব্যবস্থাপনা", message: "আগাম ধ্বসা গাছকে দুর্বল করে এবং দ্রুত ছড়ায়।" },
        sprays: ["Mancozeb", "Chlorothalonil", "Copper Oxychloride"],
        fertilizers: ["NPK", "Potassium", "Calcium Nitrate"]
      },
      "Potato___Late_blight": {
        en: { title: "Late Blight Management", message: "Highly destructive! Immediate action required." },
        bn: { title: "নাবী ধ্বসা ব্যবস্থাপনা", message: "অত্যন্ত বিধ্বংসী! দ্রুত ব্যবস্থা নেওয়া জরুরি।" },
        sprays: ["Ridomil Gold", "Potassium Phosphite", "Cyazofamid"],
        fertilizers: ["Calcium Nitrate", "Potassium", "Immunity boosters"]
      },
      "Potato___healthy": {
        en: { title: "Healthy Leaf 🌱", message: "Your plant looks healthy." },
        bn: { title: "সুস্থ পাতা 🌱", message: "আপনার গাছ সুস্থ রয়েছে।" },
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
      "Phytophthora": {
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
    <section className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-50 to-green-200 p-6">

      <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl w-full max-w-xl">

        <button onClick={toggleLanguage} className="mb-4 bg-green-600 text-white px-4 py-2 rounded-xl">
          {uiText[lang].toggle}
        </button>

        <h1 className="text-4xl text-green-800 font-bold text-center">
          {uiText[lang].title}
        </h1>

        <p className="text-center mt-2 text-gray-600">
          {uiText[lang].subtitle}
        </p>

        {/* Upload UI */}
        <div className="mt-8">

          <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-green-400 rounded-xl py-10 cursor-pointer hover:bg-green-50 transition">
            <Upload className="text-green-600 mb-3" size={42} />
            <span className="text-gray-700 font-medium">
              Click to upload a leaf image
            </span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>

          <button
            onClick={startCamera}
            className="mt-4 mx-auto flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 border border-green-300 rounded-full hover:bg-green-100 transition shadow-sm"
          >
            📷 Capture using camera
          </button>

        </div>

        {cameraOn && (
          <div className="mt-6 text-center">
            <video ref={videoRef} autoPlay className="w-64 h-64 mx-auto rounded-xl shadow-md" />
            <button onClick={captureImage} className="mt-3 bg-green-700 text-white px-4 py-2 rounded-xl">
              Capture
            </button>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {preview && (
          <div className="mt-6 text-center">
            <img src={preview} className="w-56 h-56 object-cover mx-auto rounded-xl shadow-md" />
          </div>
        )}

        <button
          onClick={handleUpload}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
        >
          {loading ? "Loading..." : uiText[lang].analyze}
        </button>

        {/* Advice */}
        {advice && (
          <div className="mt-6 bg-white p-4 rounded-xl shadow">
            <h4 className="text-green-700 font-bold">
              {advice.categoryAdvice[lang].title}
            </h4>
            <p>{advice.categoryAdvice[lang].message}</p>
          </div>
        )}

      </div>
    </section>
  );
}