# DermaScan

DermaScan is a **machine learning-based web application** designed to assist in the early detection and classification of common skin diseases. By analyzing medical images, DermaScan helps users identify conditions such as **Benign keratosis-like lesions, Basal cell carcinoma, Melanocytic naevi, Melanoma, Pyogenic granulomas and hemorrhage, Actinic keratoses and intraepithelial carcinomae, and Dermatofibroma**, particularly in resource-constrained areas with limited access to dermatological care.

## Features

- **AI-Powered Image Classification**: Detects and classifies various skin diseases using deep learning.
- **User-Friendly Interface**: Simple web application for users to upload images and receive preliminary results.
- **Data Collection & Improvement**: Optionally stores anonymized data to enhance model accuracy over time.

## How It Works

1. **Image Upload**: Users upload a clear image of the affected skin area.
2. **AI Analysis**: The DermaScan model, based on the **VGG16 architecture**, analyzes the image.
3. **Predictions**: The system provides a preliminary diagnosis and lists possible conditions.

## Demo

https://github.com/user-attachments/assets/ed7ea087-551c-419a-ac3e-8846e7436cfd

https://github.com/user-attachments/assets/4faa4bc9-c00d-4c6f-85fd-d40b845455ca

https://github.com/user-attachments/assets/ef1154de-82a3-421f-98fb-805d1bb8ae94

## Datasets Used
- **HAM10000 Dataset** (10,015 images)
- **DermNet Dataset** (19,500 images)
- **ISIC Challenge Datasets** [2016-2020]
- **fitzpatrick17k Dataset** (16,577 images)

## Tech Stack

### Frontend
<img src="https://raw.githubusercontent.com/tandpfun/skill-icons/refs/heads/main/icons/React-Dark.svg" width="25" height="25"> **React.js**

### Backend
<img src="https://raw.githubusercontent.com/tandpfun/skill-icons/refs/heads/main/icons/PyTorch-Dark.svg" width="25" height="25"> **PyTorch**

### Database
<img src="https://raw.githubusercontent.com/tandpfun/skill-icons/refs/heads/main/icons/MongoDB.svg" width="25" height="25"> **MongoDB**

### Machine Learning
<img src="https://raw.githubusercontent.com/tandpfun/skill-icons/refs/heads/main/icons/PyTorch-Dark.svg" width="25" height="25"> **PyTorch**  
<img src="https://raw.githubusercontent.com/tandpfun/skill-icons/refs/heads/main/icons/OpenCV-Dark.svg" width="25" height="25"> **OpenCV**  
<img src="https://raw.githubusercontent.com/tandpfun/skill-icons/refs/heads/main/icons/ScikitLearn-Dark.svg" width="25" height="25"> **scikit-learn**  
<img src="https://raw.githubusercontent.com/devicons/devicon/refs/heads/master/icons/keras/keras-original.svg" width="25" height="25"> **Keras**  

## Getting Started

### Prerequisites
- Python 3
- Flask
- MongoDB
- PyTorch

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ParallaX07/DermaScan.git
   ```

## DermaDoc: Your Virtual Dermatology Assistant

**DermaDoc** is an AI-powered virtual assistant integrated with **DermaScan**, specializing in dermatology and skin health.

### **Core Functions**
- **Skin Health Only**: Responds exclusively to skin-related concerns.
- **Medical Disclaimer**: Does not provide medical prescriptions or definitive diagnoses; always recommends consulting a healthcare professional.
- **Conversational & Clear Responses**: Provides concise, structured, and friendly explanations about skin conditions.

### **How DermaDoc Helps**
- Answers common dermatology-related questions.
- Provides general information about skin diseases detected by **DermaScan**.
- Guides users on next steps after receiving AI-generated results.

## Team Members

- **Saalim Saadman Araf** @[ParallaX07](https://github.com/ParallaX07)  
- **Shaheer Farrubar Shamsi** @[shaheer-shamsi](https://github.com/shaheer-shamsi)

## Acknowledgement

**Muhammad Shafayat Oshman**, Lecturer at North South University, acted as the supervisor and mentor during the development of this project in **Summer 2024**, as part of **CSE299 (Junior Design Project).**

