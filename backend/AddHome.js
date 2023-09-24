const mongoose = require('mongoose');

const AddHomeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    images: [String],  // URLs or paths to stored images
    price: Number,
    baths: Number,
    beds: Number,
    squareFeet: Number,
    features: [String],
    description: String,
    address: String,
    zipcode: String,
    city: String
});

const AddHome = mongoose.model('AddHome', AddHomeSchema);

module.exports = AddHome;
