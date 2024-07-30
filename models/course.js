const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const batchChoices = ["Batch 1", "Batch 2", "Batch 3"]; 
const lectureSchema = new Schema({
    instructor: { type: Schema.Types.ObjectId, ref: 'Instructor' },
    date: Date,
    
});
const courseSchema = new Schema({
    coursename: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    lecture: [lectureSchema]
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;

