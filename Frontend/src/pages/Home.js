import { useState } from "react";
import axios from "axios";
import { Loader2, Upload } from "lucide-react";
import { API_URL } from "../utils/constants";

export default function Home() {

  // =========================
  // STATE
  // =========================
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [result, setResult] = useState(null);

  const [medicinesData, setMedicinesData] = useState(null);
  const [medLoading, setMedLoading] = useState(false);

  const [loading, setLoading] = useState(false);

  const [lang, setLang] = useState("en");

  // =========================
  // 🌍 UI TEXT (5 LANGUAGES)
  // =========================
  const uiText = {
    en: {
      title: "AgriLeafNet 🌱",
      subtitle: "Upload a leaf image to detect disease.",
      analyze: "Analyze Leaf",
      select: "Click to select image",
      confidence: "Confidence",
      diseaseType: "Disease Type",
      medicines: "AI Recommended Medicines",
      loadingMed: "Fetching medicines...",
      noMed: "No medicines found"
    },

    bn: {
      title: "AgriLeafNet 🌱",
      subtitle: "পাতার ছবি আপলোড করুন রোগ শনাক্ত করতে।",
      analyze: "পাতা বিশ্লেষণ করুন",
      select: "ছবি নির্বাচন করুন",
      confidence: "নিশ্চয়তা",
      diseaseType: "রোগের ধরন",
      medicines: "AI ওষুধ",
      loadingMed: "ওষুধ আনা হচ্ছে...",
      noMed: "কোনো ওষুধ পাওয়া যায়নি"
    },

    hi: {
      title: "AgriLeafNet 🌱",
      subtitle: "पत्ती की तस्वीर अपलोड करें।",
      analyze: "पत्ती विश्लेषण करें",
      select: "छवि चुनें",
      confidence: "विश्वास",
      diseaseType: "रोग प्रकार",
      medicines: "AI दवाएं",
      loadingMed: "दवाएं लोड हो रही हैं...",
      noMed: "कोई दवा नहीं मिली"
    },

    ta: {
      title: "AgriLeafNet 🌱",
      subtitle: "இலை படத்தை பதிவேற்றவும்.",
      analyze: "இலையை பகுப்பாய்வு செய்யவும்",
      select: "படத்தை தேர்வு செய்யவும்",
      confidence: "நம்பிக்கை",
      diseaseType: "நோய் வகை",
      medicines: "AI மருந்துகள்",
      loadingMed: "மருந்துகள் ஏற்றப்படுகிறது...",
      noMed: "மருந்துகள் இல்லை"
    },

    te: {
      title: "AgriLeafNet 🌱",
      subtitle: "ఆకు చిత్రాన్ని అప్లోడ్ చేయండి.",
      analyze: "ఆకు విశ్లేషించండి",
      select: "చిత్రాన్ని ఎంచుకోండి",
      confidence: "నమ్మకం",
      diseaseType: "రోగ రకం",
      medicines: "AI మందులు",
      loadingMed: "మందులు లోడ్ అవుతున్నాయి...",
      noMed: "మందులు లభించలేదు"
    }
  };

  // =========================
  // FILE SELECT
  // =========================
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);

    setResult(null);
    setMedicinesData(null);
  };

  // =========================
  // FETCH MEDICINES (BACKGROUND)
  // =========================
  const fetchMedicines = async (disease) => {
    try {
      setMedLoading(true);

      const res = await axios.get(`${API_URL}/medicines`, {
        params: {
          disease,
          lang   // ✅ send language to backend
        }
      });
      console.log(res)

      setMedicinesData(res.data);

    } catch (err) {
      console.error("Medicine error:", err);
    } finally {
      setMedLoading(false);
    }
  };

  // =========================
  // UPLOAD
  // =========================
  const handleUpload = async () => {
    if (!file) return alert("Upload image first");

    setLoading(true);
    setResult(null);
    setMedicinesData(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // 🔥 FAST RESPONSE
      const res = await axios.post(
        `${API_URL}/predict`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const data = res.data;

      if (!data.is_leaf) {
        setResult({
          is_leaf: false,
          message: data.message,
          imageUrl: `${API_URL}/view_image/${data.filename}`
        });
        return;
      }

      const disease = data.disease_name;

      // ✅ SHOW RESULT FAST
      setResult({
        is_leaf: true,
        category: data.category_prediction,
        category_conf: data.category_confidence,
        type: data.disease_type_prediction,
        type_conf: data.disease_type_confidence,
        disease_name: disease,
        imageUrl: `${API_URL}/view_image/${data.filename}`
      });

      // 🚀 BACKGROUND AI CALL
      fetchMedicines(disease);

    } catch (err) {
      console.error(err);
      alert("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <section className="min-h-screen flex justify-center items-center bg-green-50 p-6">
      <div className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow">

        {/* 🌍 LANGUAGE SELECT */}
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="mb-4 p-2 border rounded"
        >
          <option value="en">English</option>
          <option value="bn">Bengali</option>
          <option value="hi">Hindi</option>
          <option value="ta">Tamil</option>
          <option value="te">Telugu</option>
        </select>

        <h1 className="text-3xl font-bold text-green-800 text-center">
          {uiText[lang].title}
        </h1>

        <p className="text-center text-gray-600 mt-2">
          {uiText[lang].subtitle}
        </p>

        {/* Upload */}
        <label className="mt-6 flex flex-col items-center border-2 border-dashed p-6 cursor-pointer">
          <Upload />
          <span>{uiText[lang].select}</span>
          <input type="file" hidden onChange={handleFileChange} />
        </label>

        {/* Preview */}
        {preview && (
          <img src={preview} className="w-48 mx-auto mt-4 rounded" />
        )}

        {/* Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full mt-4 bg-green-600 text-white py-2 rounded"
        >
          {loading ? <Loader2 className="animate-spin mx-auto" /> : uiText[lang].analyze}
        </button>

        {/* RESULT */}
        {result && result.is_leaf && (
          <div className="mt-6 p-4 bg-green-100 rounded">

            <h2 className="text-xl font-bold text-center">
              {result.category.replace(/_/g, " ")}
            </h2>

            <p className="text-center">
              {uiText[lang].confidence}: {result.category_conf}%
            </p>

            <p className="text-center mt-2">
              {uiText[lang].diseaseType}: {result.type}
            </p>

            {/* 💊 MEDICINES */}
            <div className="mt-6 bg-white p-4 rounded shadow">

              <h3 className="font-bold text-green-700">
                {uiText[lang].medicines}
              </h3>

              {medLoading && (
                <p className="flex gap-2 text-gray-600">
                  <Loader2 className="animate-spin" size={16} />
                  {uiText[lang].loadingMed}
                </p>
              )}

              {medicinesData && medicinesData.medicines?.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {medicinesData.medicines.map((m, i) => (
                    <li key={i} className="border p-2 rounded">

                      <p className="font-semibold">{m.medicine}</p>
                      <p className="text-sm text-gray-600">{m.usage}</p>

                      {m.link && (
                        <a
                          href={m.link}
                          target="_blank"
                          className="text-blue-600 text-sm"
                        >
                          View Product
                        </a>
                      )}

                    </li>
                  ))}
                </ul>
              )}

              {medicinesData && medicinesData.medicines?.length === 0 && (
                <p className="text-gray-500 mt-2">
                  {uiText[lang].noMed}
                </p>
              )}

            </div>
          </div>
        )}

        {/* NOT LEAF */}
        {result && !result.is_leaf && (
          <div className="mt-6 text-red-600 text-center">
            {result.message}
          </div>
        )}

      </div>
    </section>
  );
}