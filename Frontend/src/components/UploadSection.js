import { useState } from "react";
import axios from "axios";

export default function UploadSection() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image first!");
      return;
    }

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

      console.log("API Response:", res.data);
      setResult({
        prediction: res.data.prediction,
        confidence: res.data.confidence,
        imageUrl: `https://Afzal-04-AgriLeafNet.hf.space/view_image/${file.name}`,
      });
    } catch (err) {
      console.error(err);
      alert("Error predicting disease. Check backend connection!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-green-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md transition-transform hover:scale-[1.01]">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
          🌿 AgriLeafNet
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Upload a potato leaf image to detect possible diseases using AI.
        </p>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border border-gray-300 rounded-md p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white font-semibold transition-all duration-300 ${
            loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Analyzing..." : "Predict Disease"}
        </button>

        {preview && (
          <div className="mt-6 flex flex-col items-center">
            <img
              src={preview}
              alt="Preview"
              className="w-48 h-48 object-cover rounded-lg border border-gray-300 shadow-sm"
            />
            <p className="text-gray-500 text-sm mt-2">Selected Image</p>
          </div>
        )}

        {result && (
          <div className="mt-8 bg-green-50 border border-green-200 p-4 rounded-lg shadow-sm text-center">
            <h4 className="text-xl font-semibold text-green-800 mb-1">
              Prediction: {result.prediction}
            </h4>
            <p className="text-green-600 font-medium">
              Confidence: {result.confidence}%
            </p>
            <img
              src={result.imageUrl}
              alt="Uploaded Leaf"
              className="mt-4 w-52 h-52 object-cover rounded-lg border border-gray-200 shadow-md mx-auto"
            />
          </div>
        )}
      </div>
    </section>
  );
}
