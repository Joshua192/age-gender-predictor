# ag-detector
Age and Gender detector with web application written with vanilla JS and Python.
Transfer learned model from this github repo: https://github.com/Sobika2531/Age-Gender-And-Race-Detection-Using-CNN/tree/main

# What is this?
This is a web application that allows a user to take a picture and obtain a prediction for the age and gender for every face detected in the image provided.
This works for both the camera and file upload.

# How does it work?
The application can be run by running the app.py flask file and navigating to the localhost port 5500 (http://127.0.0.1:5000/).

JavaScript code found in capture.js is responsible for the handling of uploading, sending image data as well as handling the predicted responses from the age/gender prediction model.
Python code found in improved_model.py and app.py are responsible for:
- initialising model and saved weights
- hosting application route for POST requests

inside improved_model.ipynb, experimentation done with model can be found, namely:
- model loading and training
- testing and evaluation of model

# Why does this exist?
It initally started as a mandatory project for my final year dissertation, but has now evolved into an application I created to apply my knowledge of web real-time communications.

# Photo Guidelines:
1.	Any format that captures your whole face is acceptable. Portrait photos are preferred, selfies are accepted. The goal is to have you facing the camera, hair tucked back and as little as possible obstructing your face.
2.	Please do not crop or edit the photos with things such as filters or photo effects.
3.	Please try to take the pictures in a well-lit environment.
4.	Please remove any accessories such as hats, sunglasses, or face masks.
5.	If you wear eyeglasses, please take photos with and without the glasses if possible.
6.	There are no specific requirements for clothing, please wear what you feel is comfortable and appropriate.
7.	You’re welcome to keep any religious headwear on during picture taking. The same applies to accessories that are too difficult to remove readily such as piercings, bandages and hearing aids.
8.	Feel free to capture a wide range of photos; smiling, frowning, straight-faced, even pulling funny faces works for me. The more variety of pictures, the better.

# Visual Walkthrough of Web Application
Home Page

![image](https://github.com/user-attachments/assets/85928536-60af-4d73-931c-a2070fca6e13)

Beginning page. Buttons presented 'Upload File' or 'Take Picture'.


![image](https://github.com/user-attachments/assets/de641819-893a-4ed4-8deb-6b76bb2016ee)

Sample of Uploading File from local system


![image](https://github.com/user-attachments/assets/6a6f8eb1-7f56-4af9-af3f-104ee57accd5)

Camera is accessed and video stream shown


![image](https://github.com/user-attachments/assets/2f1bf45d-c539-4ab9-a8e4-838c48256bbf)

User Captured Image Displayed on Screen


![image](https://github.com/user-attachments/assets/bd011d46-71ac-4730-91da-44e1cdd76d9a)

Final Result Displayed on Screen
 

![image](https://github.com/user-attachments/assets/0f71b897-eeec-4d02-943b-e46f1031ce24)

* Web Application can handle multiple faces!

 
