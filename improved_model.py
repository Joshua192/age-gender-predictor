import numpy as np # ver 1.22.4
import pandas as pd # ver 2.2.1
import os
import glob
import matplotlib.pyplot as plt # ver 3.8.0
import seaborn as sns # ver 0.12.2
import tensorflow as tf # ver 2.10.0


IM_WIDTH = IM_HEIGHT = 198
ID_GENDER_MAP = {0: 'male', 1: 'female'}
GENDER_ID_MAP = dict((g, i) for i, g in ID_GENDER_MAP.items())

from keras.layers import Input, Dense, BatchNormalization, Conv2D, MaxPool2D, GlobalMaxPool2D, Dropout
from keras.optimizers import SGD
from keras.models import Model

def conv_block(inp, filters=32, bn=True, pool=True):
    _ = Conv2D(filters=filters, kernel_size=3, activation='relu')(inp)
    if bn:
        _ = BatchNormalization()(_)
    if pool:
        _ = MaxPool2D()(_)
    return _

input_layer = Input(shape=(IM_HEIGHT, IM_WIDTH, 3))
_ = conv_block(input_layer, filters=32, bn=False, pool=False)
_ = conv_block(_, filters=32*2)
_ = conv_block(_, filters=32*3)
_ = conv_block(_, filters=32*4)
_ = conv_block(_, filters=32*5)
_ = conv_block(_, filters=32*6)
bottleneck = GlobalMaxPool2D()(_)

_ = Dense(units=128, activation='relu')(bottleneck)
age_output_linear = Dense(units=1, activation='linear', name='age_output_linear')(_)

_ = Dense(units=128, activation='relu')(bottleneck)
gender_output = Dense(units=len(GENDER_ID_MAP), activation='softmax', name='gender_output')(_)


# Instantiate model without race output found in original model
new_model = Model(inputs=input_layer, outputs=[age_output_linear, gender_output])

#hyperparameter tuning will come from these.
new_model.compile(optimizer='rmsprop', 
              loss={'age_output_linear': 'mse', 'gender_output': 'categorical_crossentropy'},
              loss_weights={'age_output_linear': 2., 'gender_output': 1.},
              metrics={'age_output_linear': ['mse', 'mae'], 'gender_output': 'accuracy'})


new_model.load_weights('./model_checkpoint/linear_train_result.h5')

## going to reprocess the data, making effort to make data sample based on gender distribution. potentially also age so every training sample is spread evenly?

#Maybe binning the age variable into categories and treating the problem like a categorical problem is the solution? (if binning make sure to account for the 15-65 age spread given, maybe remove that restriction, it removed ~ 5k rows)



from keras.preprocessing import image
import cv2 
import json

IM_WIDTH = IM_HEIGHT = 198 

def predictor(img_cv):
    _ = image_processor(img_cv)    
    return model_caller(_)

def image_processor(img_cv): 

    # print(f"img_cv type:{type(img_cv)} ")
    #debugging. remove this
    if img_cv is None or img_cv.size == 0:
        print("Error: Failed to load image")
        return "Error: Failed to load image"

    
    # SOURCE: https://www.geeksforgeeks.org/cropping-faces-from-images-using-opencv-python/
    face_cascade = cv2.CascadeClassifier('./haarcascade/haarcascade_frontalface_alt2.xml')
    
    gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)    

    # use opencv cascade classifier for face recognition
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)

    if len(faces) <= 0: #idk why im making it less than, not like it will detect negative faces or somthing
        raise ValueError("Error! No faces detected in the image.")
        return "Error! No faces detected in the image."

    # Draw rectangle around the faces and store the cropped face.

    #cropped face list is a list of opencv images, which are thhe cropped faces detected in the image. 
    cropped_faces_list = []
    for (x, y, w, h) in faces: 
        cv2.rectangle(img_cv, (x, y), (x+w, y+h), (0, 0, 255), 2) 
        faces = img_cv[y:y + h, x:x + w]
        cropped_faces_list.append(faces)
    
    # plt.imshow(cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB))
    # plt.title(' Scanned Image ')
    # plt.show()
      
    # Take each face in the list, resize it.
    cropped_faces_list = [cv2.resize(face, (IM_WIDTH, IM_HEIGHT)) for face in cropped_faces_list]
    
   
    return cropped_faces_list 
#need to change structure of return value and model caller. make them iterate through list and return all information as json
    
    
def model_caller(cropped_faces_list): #TODO: for every cropped image in the list, normalise and replace. create batch and replace. call predictor.
    
    # initialiase empty dictionary variable {age, gender}
    list_of_predictions = []
    
    #normalisation and batch creation . . .
    for cropped_img_cv in cropped_faces_list:
        img_normalized = cropped_img_cv / 255.0
        img_batch = np.expand_dims(img_normalized, axis=0)
        
        # Make predictions
        predictions = new_model.predict(img_batch) # calculate a prediction and store it? then iterate and print them all
        
        # Extract age and gender predictions, store in data dictionary
        
        # Initalise a new dictionary of prediction values.
        data = {"age_pred" : 0.0,
        "gender_pred" : "",
        "cropped_image": []}
            
        #Modified to keep up with linear activation
        data['age_pred'] = float(predictions[0][0][0])
        data['gender_pred'] = ID_GENDER_MAP[np.argmax(predictions[1][0])]
        ## attach cropped image to dictionary value "cropped_image"
        data['cropped_image'] = cropped_img_cv.tolist()
        list_of_predictions.append(data)
        

    # Print predictions.
    person_count = 1
    for (image,prediction_value) in zip(cropped_faces_list, list_of_predictions):
        # plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        # plt.title(f'Person {person_count}')
        # plt.show()
        # for key in prediction_value:
        #     print(key, " : ", prediction_value[key])
        
        person_count+=1
    return list_of_predictions
 



