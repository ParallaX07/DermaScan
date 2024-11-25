import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array

classes = {
    0: ('akiec', 'Actinic keratoses and intraepithelial carcinomae'),
    1: ('bcc', 'basal cell carcinoma'),
    2: ('bkl', 'benign keratosis-like lesions'),
    3: ('df', 'dermatofibroma'),
    4: ('nv', 'melanocytic naevi'),
    5: ('vasc', 'pyogenic granulomas and hemorrhage'),
    6: ('mel', 'melanoma')
}


model = load_model('best_model_vgg16-15freeze-unfreeze.keras')


def preprocess_image(image_path):
    img = load_img(image_path, target_size=(32, 32))
    image_arr = img_to_array(img)
    image_arr = image_arr/255.0
    image_arr = np.expand_dims(image_arr, axis=0)
    return image_arr

#helper function for parsing
def parse_filename(filename):
    name = os.path.basename(filename).split('.')[0]
    imageID, gender, age, bodyPart = name.split('-')
    return imageID, gender, int(age), bodyPart


def predict_thisImage(image_path):
    image_arr = preprocess_image(image_path)
    predictions = model.predict(image_arr)
    imageID, gender, age, bodyPart = parse_filename(image_path)
    probabilities = {classes[i][1]: float(predictions[0][i]) for i in range(len(classes))}
    
    result = {
        **probabilities
    }
    return result