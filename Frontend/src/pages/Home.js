import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();

  // ✨ Animation config
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  // 🔥 Carousel State
  const [index, setIndex] = useState(0);

  const features = [
    {
      title: "Leaf Detection",
      desc: "Detect whether the uploaded image is a leaf or not.",
    },
    {
      title: "Disease Classification",
      desc: "Identify early blight, late blight or healthy leaves.",
    },
    {
      title: "Infection Type",
      desc: "Detect bacteria, fungi, virus and other infections.",
    },
    {
      title: "Smart Suggestions",
      desc: "Get fertilizers and spray recommendations instantly.",
    },
  ];

  // 🔄 Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % features.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">

      {/* 🌿 HERO SECTION */}
      <div
        className="h-screen bg-cover bg-center flex flex-col justify-center items-center text-white text-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef')",
        }}
      >
        <div className="bg-black/50 w-full h-full flex flex-col justify-center items-center px-6">

          {/* TEXT ANIMATION */}
          <motion.div variants={container} initial="hidden" animate="show">
            <h1 className="text-5xl md:text-6xl font-bold flex flex-wrap justify-center">
              {"AgriLeafNet 🌱".split(" ").map((word, i) => (
                <motion.span key={i} variants={item} className="mr-2">
                  {word}
                </motion.span>
              ))}
            </h1>

            <p className="mt-4 text-lg md:text-xl max-w-xl flex flex-wrap justify-center">
              {"AI-powered potato leaf disease detection system for smarter farming decisions."
                .split(" ")
                .map((word, i) => (
                  <motion.span key={i} variants={item} className="mr-1">
                    {word}
                  </motion.span>
                ))}
            </p>
          </motion.div>

          {/* BUTTON */}
          <motion.button
            onClick={() => navigate("/detector")}
            className="group relative mt-10 px-12 py-4 text-lg font-semibold text-white rounded-full border border-green-400 backdrop-blur-md bg-white/10 shadow-xl"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
          >
            Start Detection
          </motion.button>

        </div>
      </div>

      {/* 🌿 PROJECT INTRO */}
      <motion.div
  className="py-16 px-6 bg-gradient-to-b from-white to-green-50"
  initial="hidden"
  whileInView="show"
  viewport={{ once: true }}
>
  <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

    {/* LEFT CONTENT */}
    <motion.div className="relative max-w-lg">

      {/* 🌿 Background Shape */}
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-green-100 rounded-full blur-3xl opacity-40"></div>

      <div className="relative">
        <motion.h4
          className="text-green-600 font-medium tracking-wide text-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          ABOUT PROJECT
        </motion.h4>

        <motion.h2
          className="text-4xl font-semibold text-gray-900 mt-2 leading-snug"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Smart Agriculture with <span className="text-green-600">AI</span>
        </motion.h2>

        <motion.p
          className="text-gray-600 mt-4 leading-relaxed text-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          AgriLeafNet helps farmers detect potato leaf diseases using deep learning.
          It analyzes leaf images to identify disease type and provides practical
          recommendations like fertilizers and sprays.
        </motion.p>
      </div>

    </motion.div>

    {/* RIGHT IMAGES (RESTORED ✅) */}
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9 }}
      className="relative flex justify-center items-center"
    >

      {/* 🌿 Background Glow */}
      <div className="absolute w-[460px] h-[460px] bg-green-100 rounded-full blur-2xl opacity-40"></div>

      {/* BACK IMAGE */}
      <motion.img
        src="https://media.istockphoto.com/id/2229924133/photo/sugar-beet-agricultural-field.webp?a=1&b=1&s=612x612&w=0&k=20&c=_7qrE8qN17HGaU9O-hY2MEhJUBUaIEaaSvdg4xGzRZY="
        className="w-[460px] h-[320px] object-cover rounded-2xl shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
      />

      {/* FRONT IMAGE */}
      <motion.img
        src="https://static.vecteezy.com/system/resources/thumbnails/036/047/553/small_2x/ai-generated-environmental-stewardship-a-tree-being-planted-to-contribute-to-climate-change-mitigation-ai-generated-photo.jpg"
        className="w-[340px] h-[220px] object-cover rounded-2xl shadow-xl absolute top-20 -left-16 border-4 border-white rotate-[-3deg]"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
      />

    </motion.div>

  </div>
</motion.div>
      {/* 🌿 FEATURES CAROUSEL */}
      <div
        className="py-16 px-6 text-center text-white bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://wallpaperaccess.com/full/1598256.jpg')",
        }}
      >
        <div className="bg-green-900/70 py-16">

          <h2 className="text-3xl font-bold mb-10">
            AgriLeafNet Features
          </h2>

          <div className="relative max-w-2xl mx-auto">

            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                className="bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-lg"
                initial={{ opacity: 0, x: 120 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -120 }}
              >
                <div className="text-4xl font-bold text-green-300 mb-4">
                  0{index + 1}
                </div>

                <h3 className="text-2xl font-semibold">
                  {features[index].title}
                </h3>

                <p className="mt-3 text-gray-200">
                  {features[index].desc}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between items-center mt-6">

              <button
                onClick={() =>
                  setIndex((index - 1 + features.length) % features.length)
                }
                className="bg-green-700 px-4 py-2 rounded-lg"
              >
                ←
              </button>

              <div className="flex gap-2">
                {features.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`w-3 h-3 rounded-full cursor-pointer ${
                      i === index ? "bg-green-400" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() =>
                  setIndex((index + 1) % features.length)
                }
                className="bg-green-700 px-4 py-2 rounded-lg"
              >
                →
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* 🌿 FOOTER */}
      <div className="text-center py-4 text-gray-600">
        © 2026 AgriLeafNet
      </div>

    </div>
  );
}