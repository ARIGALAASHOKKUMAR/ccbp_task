const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas using your credentials
mongoose.connect('mongodb+srv://arigelaashok123:bGLvB9JacIOcbwYE@freecluster.j5uszjl.mongodb.net/userdb?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch((error) => console.error("Error connecting to MongoDB Atlas:", error));

// Define the user schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    dateOfBirth: Date,
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

// Add a new user
app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error adding user" });
    }
});

// Update a user
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error updating user" });
    }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
