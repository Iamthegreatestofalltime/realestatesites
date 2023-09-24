const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const multer = require('multer');  // Multer for image uploads
const AddHome = require('./AddHome');
const SavedListing = require('./SavedListing');
const nodemailer = require('nodemailer');
const path = require('path');  // Add this line

const app = express();

const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

mongoose.connect('mongodb+srv://alexlotkov124:Cupworld1@cluster0.m3hxfli.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected...');
}).catch(err => console.error(err.message));

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: { type: String, required: true }  // Email is required
});

const User = mongoose.model('User', UserSchema);

app.use('/uploads', express.static('uploads'));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.json({ limit: '5000mb' }));
app.use(express.urlencoded({ limit: '5000mb', extended: true }));

const JWT_SECRET = 'someRandomSecret';

app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    const userExists = await User.findOne({ username });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists.' });
    }

    const emailExists = await User.findOne({ email });

    if (emailExists) {
        return res.status(400).json({ message: 'Email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        password: hashedPassword,
        email
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ 
        message: 'User registered.', 
        token,
        userId: user._id
    });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ 
        message: 'Logged in successfully.',
        token,                // equivalent to token: token
        userId: user._id      // sending user ID
    });
});

// Fetch a list of homes
app.get('/api/homes', async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;  // Get the limit from query params
    
    // Check if there's a userId in the query parameters
    const userId = req.query.userId;

    let filter = {};  // Initializing an empty filter

    // If userId is provided, modify the filter to include it
    if (userId) {
        filter.userId = new mongoose.Types.ObjectId(userId);
    }

    const homes = await AddHome.find(filter).limit(limit);  // Fetch homes from the database with a limit and filter

    res.json(homes);  // Return the homes as JSON
});

app.get('/api/homes/:homeId', async (req, res) => {
    try {
        const homeId = req.params.homeId;
        const home = await AddHome.findById(homeId);

        if (!home) {
            return res.status(404).json({ message: 'Home not found' });
        }

        res.status(200).json(home);
    } catch (err) {
        console.error("Error fetching home:", err); // Log the actual error for debugging
        res.status(500).json({ message: 'Error fetching home', error: err.message });
    }
});

const verifyJWT = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(400).json({ message: 'No authorization header provided.' });
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(400).json({ message: 'No token provided.' });
    }
    try {
        req.decoded = jwt.verify(token, JWT_SECRET);
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
}

app.delete('/api/homes/:homeId', verifyJWT, async (req, res) => {
    try {
        await AddHome.findByIdAndRemove(req.params.homeId);
        res.status(200).json({ message: 'Home removed successfully' });
    } catch (err) {
        console.error("Error removing home:", err);
        res.status(500).json({ message: 'Error removing home' });
    }
});

app.put('/api/homes/:homeId', verifyJWT, upload.array('newImages', 12), async (req, res) => {
    try {
        if (!req.headers.authorization) {
            return res.status(400).json({ message: 'No authorization header provided.' });
        }

        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(400).json({ message: 'No token provided.' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(400).json({ message: 'Invalid token.' });
        }

        const userId = decoded.id;
        const existingImageURLs = JSON.parse(req.body.existingImageURLs || "[]");

        const imagePaths = req.files ? req.files.map(file => file.path) : [];

        const homeId = req.params.homeId;
        const home = await AddHome.findById(homeId);
 
        if (!home) {
            return res.status(404).json({ message: 'Home not found' });
        }

        // Check if the user trying to edit is the owner of the listing
        if (home.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Permission denied' });
        }

        // Merge new image paths with existing ones
        const combinedImages = [...existingImageURLs, ...imagePaths];

        // Update the listing
        const updatedData = { ...req.body, images: combinedImages };  // Here we override any 'images' field in req.body

        const updatedHome = await AddHome.findByIdAndUpdate(homeId, updatedData, { new: true });
        console.log("Received files:", req.files);
        console.log("Received body:", req.body);

        res.status(200).json(updatedHome);
    } catch (err) {
        console.error("Error updating home:", err); // Log the actual error for debugging
        res.status(500).json({ message: 'Error updating home', error: err.message });
    }
});

app.post('/addhome', verifyJWT, upload.array('newImages', 12), async (req, res) => {
    try {
        console.log('Received image upload request');
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const userId = decoded.id;
        console.log('Processing uploaded image');

        const imagePaths = req.files.map(file => file.path); // Get paths of uploaded files

        const home = new AddHome({
            userId: userId,
            images: imagePaths,
            price: req.body.price,
            baths: req.body.baths,
            beds: req.body.beds,
            squareFeet: req.body.squareFeet,
            features: req.body.features,
            description: req.body.description,
            address: req.body.address,
            zipcode: req.body.zipcode,
            city: req.body.city
        });

        await home.save();

        console.log('Image saved successfully:');

        res.status(201).json({ message: 'Home added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error adding home', error: err.message });
        console.error('Error saving image:', err);
    }
});

app.get('/api/search', async (req, res) => {
    console.log("Received a request to /api/search");
    try {
        console.log("try block worked")
        const query = req.query.q.toLowerCase();
        const homes = await AddHome.find({
            $or: [
                { address: new RegExp(query, 'i') },
                { city: new RegExp(query, 'i') },
                { zipcode: new RegExp(query, 'i') }
            ]
        });
        res.status(200).json(homes);
    } catch (err) {
        console.log("we in the catch block");
        console.error("Error fetching search results:", err);
        res.status(500).json({ message: 'Error fetching search results' });
    }
});

app.post('/api/save-listing', verifyJWT, async (req, res) => {
    try {
        const { listingId } = req.body;
        const userId = req.decoded.id;

        const savedListing = new SavedListing({
            userId,
            listingId
        });
        
        await savedListing.save();
        
        res.status(201).json({ message: 'Listing saved successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving listing.', error: error.message });
    }
});

app.delete('/api/unsave-listing/:listingId', verifyJWT, async (req, res) => {
    try {
        const { listingId } = req.params;
        const userId = req.decoded.id;
        
        await SavedListing.findOneAndRemove({ userId, listingId });

        res.status(200).json({ message: 'Listing unsaved successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error unsaving listing.', error: error.message });
    }
});

app.get('/api/saved-listings', verifyJWT, async (req, res) => {
    try {
        const userId = req.decoded.id;

        // Find all saved listings by this user
        const savedListings = await SavedListing.find({ userId });

        // Extract all listingIds from the saved listings
        const listingIds = savedListings.map(listing => listing.listingId);

        // Fetch the actual home details using the listingIds
        const homes = await AddHome.find({
            '_id': { $in: listingIds }
        });

        res.status(200).json(homes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching saved listings.', error: error.message });
    }
});

app.post('/api/contact-lister/:homeId', async (req, res) => {
    console.log("Accessed /api/contact-lister with data:", req.body);
    const { name, phone, email, message, user_email, user_password } = req.body;

    // Fetch the home from the database
    const homeId = req.params.homeId;
    const home = await AddHome.findById(homeId);
    console.log("Found home:", home);

    if (!home) {
        console.log("Home not found for ID:", homeId);
        return res.status(404).send("Listing not found");
    }    

    // Fetch the user (lister) from the database
    const user = await User.findById(home.userId); // Again, this is an example with Mongoose.

    if (!user) {
        return res.status(404).send("User not found");
    }

    const listerEmail = user.email;

    // NodeMailer setup
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user_email,
            pass: user_password
        }
    });

    const mailOptions = {
        from: email,
        to: listerEmail,
        subject: `Message from ${name}`,
        text: `
            Name: ${name}
            Phone: ${phone}
            Email: ${email}
            Message: ${message}
        `
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.error("Error sending mail:", error);
            console.log(error);
            res.status(500).send('Error sending email.');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Message sent successfully.');
        }
    });
});

if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('frontend/build'));
    
    // Catch-all route handler
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});