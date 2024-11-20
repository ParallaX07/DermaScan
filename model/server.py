import base64
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pymongo
from bson import ObjectId

app = FastAPI()

# Make connection to MongoDB
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
dermascanDB = myclient["dermascan"]
skinImagesCollection = dermascanDB["skinImages"]
analysisResultsCollection = dermascanDB["analysisResults"]

# api to create a new image to the model folder
@app.get("/getPendingImage")
async def getPendingImage():
    pendingImage = analysisResultsCollection.find_one({"status": "pending"})
    if pendingImage is None:
        raise HTTPException(status_code=404, detail="No pending image")
    imageId = pendingImage["imageId"]
    skinImage = skinImagesCollection.find_one({"_id": ObjectId(imageId)})
    image_base64 = skinImage["image"]

    # Convert base64 string to bytes
    image_bytes = base64.b64decode(image_base64)
    with open(f"./dataset/userImages/pending/{imageId}.jpg", "wb") as file:
        file.write(image_bytes)

    # update pending image to pending result
    analysisResultsCollection.update_one({"_id": pendingImage["_id"]}, {"$set": {"status": "pending result"}})
    return {"imageId": str(imageId)}

    # api to update analysisResultsCollection with the result and status of the image


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)