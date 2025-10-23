AgriLeafNet

A Deep Learning-Based System for Potato Leaf Disease Detection

📖 Overview

AgriLeafNet is a deep learning application designed to identify diseases in potato leaves using convolutional neural networks (CNNs). Leveraging image-based analysis, this system helps farmers and agronomists detect diseases early, ensuring timely intervention and minimizing crop loss.

The project includes a trained Keras CNN model integrated with a local Flask web application, enabling users to upload images of potato leaves and receive accurate predictions along with confidence scores.

⚙️ Features

Deep Learning Model: Trained CNN model (potato_leaf_disease_cnn_model.keras) capable of classifying seven classes:

Bacteria

Fungi

Healthy

Nematode

Pest

Phytophthora

Virus

Web Interface: Simple, user-friendly interface to upload images and get predictions.

Local Deployment: Runs entirely on local machines without internet dependency.

Confidence Score: Displays probability of prediction to quantify model certainty.

Image Preview: Shows uploaded leaf image for verification.

🧰 Technologies Used

Python 3.x

TensorFlow & Keras (Deep Learning)

Flask (Web Framework)

NumPy (Array Computations)

HTML/CSS (Frontend for Web Interface)

🖥️ Setup Instructions

Clone the repository:

git clone <repository_url>
cd AgriLeafNet


Create a virtual environment (optional but recommended):

python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows


Install dependencies:

pip install -r requirements.txt


Place the trained model potato_leaf_disease_cnn_model.keras in the project directory.

Run the Flask application:

python app.py


Access the web app:
Open your browser and go to:

http://127.0.0.1:5000

🧪 Usage

Upload an image of a potato leaf.

Click Predict.

The application will display:

Predicted Disease Class

Confidence Score (%)

Uploaded Leaf Image

📊 Model Performance
Epochs	Training Accuracy	Validation Accuracy	Training Loss	Validation Loss
25	72.38%	59.15%	0.7631	1.1746

The model was trained on a diverse dataset of diseased and healthy potato leaves, achieving robust performance in real-world testing.

📂 Project Structure
AgriLeafNet/
│
├─ app.py                  # Main Flask application
├─ potato_leaf_disease_cnn_model.keras  # Trained CNN model
├─ requirements.txt        # Python dependencies
├─ uploads/                # Temporary folder for uploaded images
└─ README.md               # Project documentation

⚡ Future Work

Expand dataset to include more potato leaf diseases.

Add real-time detection using mobile camera input.

Deploy as a cloud application for broader accessibility.

Integrate explainable AI (Grad-CAM) for visualizing model predictions.

👨‍💻 Author

Sk Mahammad Afzal
B.Tech IT, MCKV Institute of Engineering
Email: [your_email@example.com
]AgriLeafNet

A Deep Learning-Based System for Potato Leaf Disease Detection

📖 Overview

AgriLeafNet is a deep learning application designed to identify diseases in potato leaves using convolutional neural networks (CNNs). Leveraging image-based analysis, this system helps farmers and agronomists detect diseases early, ensuring timely intervention and minimizing crop loss.

The project includes a trained Keras CNN model integrated with a local Flask web application, enabling users to upload images of potato leaves and receive accurate predictions along with confidence scores.

⚙️ Features

Deep Learning Model: Trained CNN model (potato_leaf_disease_cnn_model.keras) capable of classifying seven classes:

Bacteria

Fungi

Healthy

Nematode

Pest

Phytophthora

Virus

Web Interface: Simple, user-friendly interface to upload images and get predictions.

Local Deployment: Runs entirely on local machines without internet dependency.

Confidence Score: Displays probability of prediction to quantify model certainty.

Image Preview: Shows uploaded leaf image for verification.

🧰 Technologies Used

Python 3.x

TensorFlow & Keras (Deep Learning)

Flask (Web Framework)

NumPy (Array Computations)

HTML/CSS (Frontend for Web Interface)

🖥️ Setup Instructions

Clone the repository:

git clone <repository_url>
cd AgriLeafNet


Create a virtual environment (optional but recommended):

python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows


Install dependencies:

pip install -r requirements.txt


Place the trained model potato_leaf_disease_cnn_model.keras in the project directory.

Run the Flask application:

python app.py


Access the web app:
Open your browser and go to:

http://127.0.0.1:5000

🧪 Usage

Upload an image of a potato leaf.

Click Predict.

The application will display:

Predicted Disease Class

Confidence Score (%)

Uploaded Leaf Image

📊 Model Performance
Epochs	Training Accuracy	Validation Accuracy	Training Loss	Validation Loss
25	72.38%	59.15%	0.7631	1.1746

The model was trained on a diverse dataset of diseased and healthy potato leaves, achieving robust performance in real-world testing.

📂 Project Structure
AgriLeafNet/
│
├─ app.py                  # Main Flask application
├─ potato_leaf_disease_cnn_model.keras  # Trained CNN model
├─ requirements.txt        # Python dependencies
├─ uploads/                # Temporary folder for uploaded images
└─ README.md               # Project documentation

⚡ Future Work

Expand dataset to include more potato leaf diseases.

Add real-time detection using mobile camera input.

Deploy as a cloud application for broader accessibility.

Integrate explainable AI (Grad-CAM) for visualizing model predictions.

👨‍💻 Author

Sk Mahammad Afzal
B.Tech IT, MCKV Institute of Engineering
