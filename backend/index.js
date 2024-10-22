const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.get("/", (req, res) => {
    res.send("DermaScan API is running!");
});

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
        await client.connect(); // Ensure the client connects to the database
        const database = client.db("dermascan");
        const users = database.collection("users");
        const skinImages = database.collection("skinImages");

        // Create a new user
        app.post("/createUser", async (req, res) => {
            try {
                const newUser = req.body;
                const result = await users.insertOne(newUser);
                res.send(result);
            } catch (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            }
        });

        // Upload image
        app.post("/upload-image", async (req, res) => {
            try {
                const newImage = req.body;
                const result = await skinImages.insertOne(newImage);
                res.send(result);
            } catch (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            }
        });

        // Get all users
        app.get("/allUsers", async (req, res) => {
            try {
                const allUsers = await users.find().toArray();
                res.send(allUsers);
            } catch (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            }
        });

        // Get user image by email
        app.get("/userImage/:email", async (req, res) => {
            try {
                const email = req.params.email;
                const userImages = await skinImages.find({ user: email }).toArray();
                res.send(userImages);
            } catch (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            }
        });

    } catch (error) {
        console.error(error);
    } finally {

    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});