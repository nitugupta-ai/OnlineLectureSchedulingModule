const express = require("express");
const app = express();
const path= require("path");
const mongoose = require("mongoose");
const Course = require("./models/course.js");
const Instructor = require("./models/instructor.js");
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const MONGO_URL = "mongodb://127.0.0.1:27017/OnlineLecture";
async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("Connection Sucessful");
  })
  .catch((err) => {
    console.log(err);
 });



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// Flash messages middleware
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.user = req.user;
  next();
});
// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Instructor.authenticate()));
passport.serializeUser(Instructor.serializeUser());
passport.deserializeUser(Instructor.deserializeUser());


app.get("/", (req,res) => {
  res.render("main.ejs")
})

//admin panel
// show route
app.get("/courses", async (req, res) => {
    let allCourses = await Course.find({});
    console.log(allCourses)
    res.render("admin.ejs", { allCourses });
});

// new course
app.get("/courses/new", (req,res) => {
    res.render("newCourse.ejs");
});

//add course

app.post('/courses', (req, res) => {
    const { coursename, level, description, image } = req.body;
  
    const newCourse = new Course({
        coursename,
      level,
      description,
      image,
      
    });
    
    newCourse.save();
    res.redirect("/courses")
  });

// show instructors
app.get("/instructor", async (req,res) => {
    let allinstructors = await Instructor.find({});
    res.render("instructor.ejs", {allinstructors});
});

// create new lecture

app.get('/courses/:id/lecture/new', async (req, res) => {
    const course = await Course.findById(req.params.id);
    const instructors = await Instructor.find({});
    console.log(course, instructors);
    res.render('newLecture.ejs', { course, instructors });
});

// Add lecture

app.post('/courses/:id/lecture', async (req, res) => {
  const { instructorId, date } = req.body;
  const course = await Course.findById(req.params.id);
  const instructor = await Instructor.findById(instructorId);

  // Check for schedule conflict
  const conflict = await Course.findOne({ 'lecture.instructor': instructorId, 'lecture.date': new Date(date) });
  if (conflict) {
      // req.flash('error', 'Instructor is already assigned to a lecture on this date.');
      return res.redirect(`/courses/${course._id}/lecture/new`);
  }

  course.lecture.push({ instructor, date: new Date(date) });
  await course.save();

  // req.flash('success', 'Lecture added successfully!');
  res.redirect(`/courses`);
});




app.get('/lecture', async (req, res) => {
  const lectures = await Course.find({});
  res.send(lectures)
});




app.listen(8080, () => {
    console.log("App is listening on port 3030");
});
