import React from "react";
import { motion } from "framer-motion";

export default function About() {

  // 🔥 SEQUENCE CONTROL
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.6,
      },
    },
  };

  const section = {
    hidden: { opacity: 0, y: 60 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-16 px-6 flex justify-center">

      <motion.div
        className="max-w-5xl w-full space-y-10"
        variants={container}
        initial="hidden"
        animate="show"
      >

        {/* HEADER */}
        <motion.div className="bg-white p-8 rounded-2xl shadow-xl text-center" variants={section}>
          <img
            src="/logo.png"
            className="w-20 h-20 mx-auto mb-4 rounded-full shadow"
          />
          <h1 className="text-4xl font-bold text-green-800">
            About AgriLeafNet
          </h1>
          <p className="text-gray-600 mt-4">
            Smart AI solution for modern agriculture
          </p>
        </motion.div>

        {/* INTRO */}
        <motion.div className="bg-white p-6 rounded-xl shadow-md space-y-4" variants={section}>
          <p className="text-lg text-gray-700">
            AgriLeafNet is an AI-based smart farming system designed to help farmers
            detect plant diseases quickly and easily.
          </p>

          <p className="text-gray-600">
            Instead of depending on guesswork or waiting for experts, farmers can
            simply upload an image of a leaf and instantly know the condition of
            their crop.
          </p>

          <p className="text-gray-600">
            The system not only detects the disease but also provides useful
            suggestions such as fertilizers and sprays, helping farmers take the
            right action at the right time.
          </p>
        </motion.div>

        {/* HOW IT WORKS */}
        <motion.div className="bg-white p-6 rounded-xl shadow-md" variants={section}>
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            🌿 How It Works
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Upload a clear image of the plant leaf",
              "System verifies if it is a leaf or not",
              "AI model analyzes the image",
              "Detects disease category and type",
              "Displays confidence level of prediction",
              "Provides treatment suggestions",
            ].map((item, i) => (
              <div key={i} className="bg-green-50 p-4 rounded-lg shadow-sm hover:scale-105 transition">
                ✔ {item}
              </div>
            ))}
          </div>
        </motion.div>

        {/* FEATURES */}
        <motion.div className="bg-white p-6 rounded-xl shadow-md" variants={section}>
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            🚀 Key Features
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              "Fast and real-time disease detection",
              "Simple and user-friendly interface",
              "Accurate AI-based predictions",
              "Smart fertilizer and spray suggestions",
              "Works on both mobile and desktop",
              "Supports multiple disease categories",
            ].map((f, i) => (
              <div key={i} className="bg-green-100 p-4 rounded-xl text-center shadow hover:scale-105 transition">
                {f}
              </div>
            ))}
          </div>
        </motion.div>

        {/* WHY IMPORTANT */}
        <motion.div className="bg-white p-6 rounded-xl shadow-md space-y-4" variants={section}>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            🌾 Why This Project is Important
          </h2>

          <p className="text-gray-700">
            Farmers often face difficulty in identifying plant diseases at an early
            stage. This delay can lead to serious crop damage and financial loss.
          </p>

          <p className="text-gray-600">
            AgriLeafNet helps solve this problem by providing quick and reliable
            results, allowing farmers to take preventive actions before the disease spreads.
          </p>

          <p className="text-gray-600">
            This leads to better crop health, increased yield, and improved farming outcomes.
          </p>
        </motion.div>

        {/* GOAL */}
        <motion.div className="bg-green-700 text-white p-6 rounded-xl shadow-md text-center" variants={section}>
          <h2 className="text-2xl font-bold mb-3">🎯 Goal of AgriLeafNet</h2>
          <p>
            Our goal is to make agriculture smarter using AI technology, reduce crop loss,
            and help farmers make better decisions for higher productivity and sustainable farming.
          </p>
        </motion.div>

      </motion.div>
    </section>
  );
}