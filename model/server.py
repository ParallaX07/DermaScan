import base64
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pymongo
from bson import ObjectId
from predict import predict_thisImage
import shutil



app = FastAPI()

# Make connection to MongoDB
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
dermascanDB = myclient["dermascan"]
skinImagesCollection = dermascanDB["skinImages"]
analysisResultsCollection = dermascanDB["analysisResults"]

@app.get("/")
async def root():
    return {"message": "Server for DermaScan model running"}

# api to create a new image to the model folder
@app.get("/getPendingImage")
async def getPendingImage():
    pendingImage = analysisResultsCollection.find_one({"status": "pending image"})
    if pendingImage is None:
        raise HTTPException(status_code=404, detail="No pending image")
    imageId = pendingImage["imageId"]
    skinImage = skinImagesCollection.find_one({"_id": ObjectId(imageId)})
    image_base64 = skinImage["image"]
    gender = skinImage["gender"]
    age = skinImage["age"]
    bodyPart = skinImage["bodyPart"]

    # Convert base64 string to bytes
    image_bytes = base64.b64decode(image_base64)
    with open(f"./dataset/userImages/pending/{imageId}-{gender}-{age}-{bodyPart}.jpg", "wb") as file:
        file.write(image_bytes)

    # update pending image to pending result
    analysisResultsCollection.update_one({"_id": pendingImage["_id"]}, {"$set": {"status": "pending result"}})
    return {"imageId": str(imageId)}

@app.get("/runPrediction/{imageId}")
async def runPrediction(imageId: str):
    pendingImage = analysisResultsCollection.find_one({"status": "pending result"})
    if pendingImage is None:
        raise HTTPException(status_code=404, detail="No pending result for this image")

    skinImage = skinImagesCollection.find_one({"_id": ObjectId(imageId)})
    if skinImage is None:
        raise HTTPException(status_code=404, detail="Image not found")

    gender = skinImage["gender"]
    age = skinImage["age"]
    bodyPart = skinImage["bodyPart"]
    image_path = f"./dataset/userImages/pending/{imageId}-{gender}-{age}-{bodyPart}.jpg"

    # Run prediction
    result = predict_thisImage(image_path)
    if result == "Model could not be loaded":
        raise HTTPException(status_code=500, detail="Model could not be loaded")

    # Update the analysis result with the prediction
    analysisResultsCollection.update_one({"_id": pendingImage["_id"]}, {"$set": {"status": "completed", "result": result}})

    # move image to processed folder
    processed_image_path = f"./dataset/userImages/processed/{imageId}-{gender}-{age}-{bodyPart}.jpg"
    shutil.move(image_path, processed_image_path)
    
    return {"result": result}

# api to get all results of the user
@app.get("/allResults/{user}")
async def getResults(user: str):
    results = analysisResultsCollection.find({"user": user})
    results_list = []
    for result in results:
        result_dict = {
            "imageId": str(result["imageId"]),
            "status": result["status"],
            "result": result["result"],
            "image": skinImagesCollection.find_one({"_id": ObjectId(result["imageId"])})["image"]
        }
        results_list.append(result_dict)
    return {"results": results_list}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)