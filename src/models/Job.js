const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    link: {
        type: String,
        required: true,
        unique: true // CRITICAL: This prevents duplicate entries in your DB
    },
    platform: {
        type: String,
        enum: ['Indeed', 'LinkedIn', 'Glassdoor', 'Other'],
        default: 'Other'
    },
    stack: [String], // e.g., ['React', 'Node.js', 'MongoDB']
    status: {
        type: String,
        enum: ['New', 'Applied', 'Interviewing', 'Rejected'],
        default: 'New'
    },
    dateFound: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', JobSchema);