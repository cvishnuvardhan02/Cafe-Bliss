const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 2019;
const app = express();

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/secproj');
const db = mongoose.connection;
db.once('open', () => {
    console.log("MongoDB connection successful");
});

// Define the schema and model
const userSchema = new mongoose.Schema({
    numb: String,
    name: String,
    email: String,
    coffee: String,
    coffee1: String,
    coffee2: String,
    coffee3: String
});
const Users = mongoose.model("data", userSchema);

// Route to create or update user data
app.post('/post', async (req, res) => {
    const { _id, numb, name, email, coffee, coffee1, coffee2, coffee3 } = req.body;

    try {
        if (_id) {
            // Update existing user
            const updatedUser = await Users.findByIdAndUpdate(
                _id,
                { numb, name, email, coffee,coffee1, coffee2, coffee3 },
                { new: true }
            );
            console.log("Updated User:", updatedUser);
            res.send("Order Update Successful");
        } else {
            // Create new user
            const newUser = new Users({ numb, name, email, coffee,coffee1, coffee2, coffee3 });
            await newUser.save();
            console.log("New User:", newUser);
            res.send("Order has been taken. Please pay the bill in the cash counter. Thankyou 😊 Visit us again!!");
        }
    } catch (error) {
        console.error("Error in order submission:", error);
        res.status(500).send("An error occurred");
    }
});

// Route to load data for a specific user by ID (to pre-fill form when editing)
app.get('/user/:id', async (req, res) => {
    try {
        const user = await Users.findById(req.params.id);
        res.json(user);
    } catch (error) {
        console.error("Error loading user data:", error);
        res.status(500).send("An error occurred");
    }
});

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
