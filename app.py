#SOURCE: https://dev.to/healeycodes/talking-to-python-from-javascript-and-back-again-31jf
#SOURCE: "Python REST API Tutorial - Building a Flask REST API" - https://www.youtube.com/watch?v=GMppyAPbLYk 
# SOURCE:  Flask file upload documentation - https://flask.palletsprojects.com/en/2.3.x/patterns/fileuploads/ 
#
# env related import
from PIL import Image
import cv2
import numpy as np
from flask import Flask, jsonify, request, render_template, make_response
from flask_cors import CORS
import requests
from werkzeug.utils import secure_filename
from io import BytesIO

import os
# import sys


import improved_model

ID_GENDER_MAP = improved_model.ID_GENDER_MAP
IM_WIDTH = improved_model.IM_WIDTH
IM_HEIGHT = improved_model.IM_HEIGHT
image_processor = improved_model.image_processor
model_caller = improved_model.model_caller
predictor = improved_model.predictor


#SOURCE: https://stackabuse.com/step-by-step-guide-to-file-upload-with-flask/
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


app = Flask(__name__)
CORS(app)
# CORS(app, resources={r"/preprocess-image": {"origins" : ["http://127.0.0.1:5000"],"supports_credentials": True }, 
#                         r"/": {"origins" : ["http://127.0.0.1:5000"],"supports_credentials": True
#                                }})

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/preprocess-image", methods=["POST"])
# handle POST request with image data inside it, return cropped_faces_list
def preprocess():

    image_file = request.files['file']
    image_data = image_file.read()
    
    img_bytes = BytesIO(image_data)
    nparr = np.frombuffer(img_bytes.read(), np.uint8)
    img_cv = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # # image_file = request.files["file"]
    # image_file = request.files.get("file") #alt method
    # content = image_file.read()
    # print("image_file : ", image_file)
    
    # if 'file' in request.files:
    #     print("file found!")
    #     # if image_file and allowed_file(image_file.filename):
    #     #     filename = secure_filename(image_file.filename)
    #     # else:
    #     #     print("File upload failed: incorrect file type.")
            
    #     #     return jsonify("File upload failed: incorrect file type.")
    # else:
    #     print("Error: File not found in request body.")

    #     return jsonify("Error: File not found in request body.")
    
    # nparr = np.frombuffer(content, np.uint8)
      
    # # print("data/file received: ",image_file)
    # # print("type of file received:", type(image_file))
    # # print("contents of file.stream ", image_file.stream)
    # print("\n passing into predictor: ", img_cv, "\n")
    result = {}
    result = predictor(img_cv)

    
   
    return jsonify(result), 201

@app.errorhandler(413)
def too_large(e):
    return make_response(jsonify(message="File is too large"), 413)
    
if __name__ == "__main__":
    app.run(port= 5000, debug=True)
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB
    #arbitrary choice in sizing restriction. image file typically don't pass a few hundred kb or few mb in size.
    #TODO: attempt with ultra-high quality images?


# May have to later separate the routes into model and predictor for better structure.
# @app.route('/model', methods=['GET', 'POST'])

# ## WHAT DO I CALL ALL THE DIFFERENT FILES FOR ORGANISATION PURPOSES. This is a structure and planning issue. I need at least 2 days for this bullshit.
# def model_request():
#     predictor(practice_img)