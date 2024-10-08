const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({}));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("DermaScan API is running!");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb://localhost:27017`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        const database = client.db("dermascan");
        const collection = database.collection("users");

        // Create a new user
        app.post("/createUser", async (req, res) => {
            try {
                const newUser = req.body;
                const result = await collection.insertOne(newUser);
                res.send(result);
            } catch (error) {
                console.error(error);
            }
        });

        // get all users
        app.get("/allUsers", async (req, res) => {
            try {
                const allUsers = await collection.find().toArray();
                res.send(allUsers);
            } catch (error) {
                console.error(error);
            }
        });
    } finally {
    }
}

run().catch(console.dir);
