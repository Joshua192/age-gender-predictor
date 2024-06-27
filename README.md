# arg-detector
Age, Race, Gender detector with web application written with vanilla JS and Python

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

**TBD: Demonstration of features and visual aids for explanation of step-by-step process**
