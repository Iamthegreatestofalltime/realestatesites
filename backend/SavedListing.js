// SavedListing.js
const mongoose = require('mongoose');

const SavedListingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'AddHome', required: true },
    dateSaved: { type: Date, default: Date.now }
});

const SavedListing = mongoose.model('SavedListing', SavedListingSchema);
module.exports = SavedListing;