import React from "react";

export default function About() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-16 px-6 flex justify-center">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-3xl p-8 md:p-12">

        {/* Header */}
        <div className="text-center mb-10">
          <img
            src="/logo.png"
            alt="AgriLeafNet Logo"
            className="w-20 h-20 rounded-full object-cover mx-auto mb-4 shadow-md"
          />

          <h1 className="text-4xl font-extrabold text-green-800">
            About AgriLeafNet
          </h1>
        </div>

        {/* Main Content */}
        <div className="text-gray-700 leading-relaxed space-y-6 text-lg">

          <p>
            <strong className="text-green-900">AgriLeafNet</strong> is an AI-powered crop disease
            detection system designed to support farmers with instant, accurate,
            and reliable disease diagnosis. By simply uploading a crop leaf
            image, farmers receive predictions backed by a deep learning model
            trained on thousands of real plant disease samples.
          </p>

          {/* Section: Model */}
          <h2 className="text-2xl font-bold text-green-900 mt-10">🔬 AI Model Used</h2>
          <p>
            AgriLeafNet uses <strong>MobileNetV2</strong> — a lightweight,
            efficient convolutional neural network pre-trained on ImageNet.
            This makes it ideal for building a fast, mobile-friendly agricultural
            disease classifier.
          </p>

          <p>
            The model architecture includes:
          </p>

          <ul className="list-disc ml-6 space-y-2">
            <li>MobileNetV2 as base (pretrained on ImageNet)</li>
            <li>Global Average Pooling for feature extraction</li>
            <li>Batch Normalization for stability</li>
            <li>Dense layers with ReLU activation</li>
            <li>Dropout layers to reduce overfitting</li>
            <li>Final Softmax layer for multi-class disease prediction</li>
          </ul>

          <pre className="bg-green-900 text-green-100 p-4 rounded-lg overflow-x-auto text-sm mt-4">
MobileNetV2 → GAP → BatchNorm → Dense → Dropout → Dense(softmax)
          </pre>

          {/* Section: Dataset */}
          <h2 className="text-2xl font-bold text-green-900 mt-10">🌱 Dataset Used</h2>
          <p>
            The model is trained using a combination of curated agricultural datasets
            containing <strong>healthy and diseased crop leaves</strong>.  
            Each image is preprocessed, augmented, and resized to 224×224 before training.
          </p>

          <p>
            Data preprocessing includes:
          </p>

          <ul className="list-disc ml-6 space-y-2">
            <li>Normalization (rescaling pixel values)</li>
            <li>Augmentation (rotation, zoom, flip, brightness shift)</li>
            <li>Dataset splitting into Train, Validation, and Test sets</li>
          </ul>

          {/* Section: Training Pipeline */}
          <h2 className="text-2xl font-bold text-green-900 mt-10">⚙️ Training Pipeline</h2>
          <p>
            AgriLeafNet is trained in two phases for maximum accuracy:
          </p>

          <h3 className="font-semibold text-green-800">1️⃣ Stage 1 – Training Top Layers Only</h3>
          <p>
            The MobileNetV2 base is frozen and only the custom layers are trained for
            <strong>12 epochs</strong>.
          </p>

          <pre className="bg-green-900 text-green-100 p-4 rounded-lg overflow-x-auto text-sm">
history = model.fit(train_data, validation_data=val_data, epochs=12)
          </pre>

          <h3 className="font-semibold text-green-800 mt-4">2️⃣ Stage 2 – Fine-Tuning Entire Model</h3>
          <p>
            Deeper MobileNet layers are unfrozen and the entire network is fine-tuned
            for <strong>25 additional epochs</strong> to boost accuracy.
          </p>

          <pre className="bg-green-900 text-green-100 p-4 rounded-lg overflow-x-auto text-sm">
history_ft = model.fit(train_data, validation_data=val_data, epochs=25)
          </pre>

          <p>
            The model is optimized using <strong>Adam</strong> with a learning rate of
            <strong> 0.0008</strong> and trained using <strong>categorical crossentropy</strong>
            loss for multi-class classification.
          </p>

          {/* Final Summary */}
          <h2 className="text-2xl font-bold text-green-900 mt-10">🌾 Goal of AgriLeafNet</h2>
          <p>
            AgriLeafNet aims to support farmers globally by enabling quick,
            AI-powered plant disease detection—reducing crop loss, improving yields,
            and promoting sustainable agriculture.
          </p>
        </div>
      </div>
    </section>
  );
}
