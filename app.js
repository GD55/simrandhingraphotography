var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStatergy = require("passport-local"),
	nodemailer = require('nodemailer'),
	multer = require('multer'),
	fs = require('fs'),
	MakeUpImage = require("./models/makeup"),
	FashionImage = require("./models/fashion"),
	PortraitImage = require("./models/portrait"),
	Blog = require("./models/blogs"),
	Video = require("./models/videos"),
	User = require("./models/user"),
	port = process.env.PORT || 3000,
	expressSanitizer = require("express-sanitizer"),
	methodOverride = require("method-override");


// mongoose.connect("mongodb://localhost/simran", { useNewUrlParser: true });
mongoose.connect("mongodb+srv://simran:QpzfpWC5M3yrm6G@photography-omvnp.mongodb.net/test?retryWrites=true", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var transport = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'simrandhingraphotographym@gmail.com',
		pass: 'htP9WSUrhVcY7Hh'
	}
});
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});
var upload = multer({ storage: storage });

var storageMakeUp = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/images/photographs/makeup/')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});
var uploadMakeUp = multer({ storage: storageMakeUp });

var storageFashion = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/images/photographs/fashion/')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});
var uploadFashion = multer({ storage: storageFashion });

var storagePortrait = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/images/photographs/portrait/')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});
var uploadPortrait = multer({ storage: storagePortrait });

// for (var i = 0; i <= 58; i++) {
// 	MakeUpImage.create({
// 		order: i,
// 		img: "images/photographs/makeup/m" + i + ".jpg"
// 	});
// }

// for (var i = 0; i <= 34; i++) {
// 	FashionImage.create({
// 		order: i,
// 		img: "images/photographs/fashion/f" + i + ".jpg"
// 	});
// }

// for (var i = 0; i <= 10; i++) {
// 	PortraitImage.create({
// 		order: i,
// 		img: "images/photographs/portrait/p" + i + ".jpg"
// 	});
// }

// Blog.create({
// 	title: "Test Blog",
// 	image: "https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_auto:good%2Cw_300/MTE4MDAzNDEwNzkxOTI1MjYy/scarlett-johansson-13671719-1-402.jpg",
// 	body: "THIS IS A BLOG POST!"
// });

// Video.create({
// 	order: 0,
// 	link: "N91nxRqvhlg",
// 	title: "MakeUp Tutorial"
// });

//passport Config
app.use(require("express-session")({
	secret: "my favorite color is light blue",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStatergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

//////////////////////////////////////
//index routes
//////////////////////////////////////

app.get("/", function (req, res) {
	res.render("landing");
});

app.get("/aboutMe", function (req, res) {
	res.render("aboutMe");
});

app.get("/contactUs", function (req, res) {
	res.render("contactUs");
});

app.post('/contactUs', function (req, res) {
	// Message object
	var message = {
		// sender info
		from: req.body.name,
		// Comma separated list of recipients
		to: 'simrandhingraphotography@gmail.com',
		// Subject of the message
		subject: req.body.subject,//'Nodemailer is unicode friendly ✔', 
		// plaintext body
		text: req.body.text + "\nName: " + req.body.name + "\nEmail: " + req.body.email + "\nPhone no.: " + req.body.no
	};
	console.log('Sending Mail');
	transport.sendMail(message, function (error) {
		if (error) {
			console.log('Error occured');
			console.log(error.message);
			return;
		}
		console.log('Message sent successfully!');
	});
	res.redirect('/contactUs');
});

app.get("/modelsWanted", function (req, res) {
	res.render("modelsWanted");
});

app.post('/modelsWanted', upload.array('photos', 12), function (req, res) {
	// Message object
	var body = "\nName: " + req.body.name + "\nEmail: " + req.body.email + "\nPhone no.: " + req.body.no + "\nD.O.B.: " + req.body.age + "\nActing: " + req.body.acting + "\nModelling: " + req.body.modelling + "\nPrint-Ads: " + req.body.ads + "\ninstagram Id: " + req.body.instagram + "\nPortfolio: " + req.body.portfolio + "\nWork-Experience: " + req.body.workExperience;
	var arr = [];
	for (var i = 0; i < req.files.length; i++) {
		arr[i] =
			{
				path: String(req.files[i].path)
			}
	}

	var message = {
		// sender info
		from: req.body.name,
		// Comma separated list of recipients
		to: 'simrandhingraphotography@gmail.com',
		// Subject of the message
		subject: "Models Wanted",//'Nodemailer is unicode friendly ✔', 
		// plaintext body
		text: body,
		attachments: arr
	};
	console.log("sending mail");
	transport.sendMail(message, function (error) {
		if (error) {
			console.log('Error occured');
			console.log(error.message);
			return;
		}
		console.log('Message sent successfully!');
		for (var i = 0; i < req.files.length; i++) {
			fs.unlink(req.files[i].destination + req.files[i].filename, function (err) {
				if (err) {
					console.log(err);
				} else {
					console.log("File was deleted");
				}
			});
		}
	});
	res.redirect('/modelsWanted');
});

//////////////////////////////////////
//makeUP Gallery routes
//////////////////////////////////////

app.get("/makeUp", function (req, res) {
	MakeUpImage.find({}).sort({ order: 1 }).exec(function (err, makeUpImages) {
		if (err) {
			console.log("ERROR");
		} else {
			res.render("makeUp/index", { makeUpImages: makeUpImages })
		}
	});
});

//New route
app.get("/makeUp/new", isLoggedIn, function (req, res) {
	res.render("makeUp/new");
});

//create route
app.post("/makeUp", isLoggedIn, uploadMakeUp.single('photo'), function (req, res) {
	MakeUpImage.create({
		order: req.body.order,
		img: "images/photographs/makeup/" + req.file.filename
	}, function (err, newImage) {
		if (err) {
			res.render("makeUp/new");
		} else {
			//then redirect to the index
			res.redirect("/makeUp");
		}
	});
});

//Edit Route
app.get("/makeUp/:id/edit", isLoggedIn, function (req, res) {
	MakeUpImage.findById(req.params.id, function (err, foundImage) {
		if (err) {
			res.redirect("/makeUp");
		} else {
			//then redirect to the index
			res.render("makeUp/edit", { makeUpImage: foundImage });
		}
	});
});

//Update Route
app.put("/makeUp/:id", isLoggedIn, function (req, res) {
	MakeUpImage.findByIdAndUpdate(req.params.id, req.body.makeUpImage, function (err, updatedMakeUpImage) {
		if (err) {
			res.redirect("/makeUp/" + req.params.id + "/edit");
		} else {
			res.redirect("/makeUp");
		}
	});
});

//DELETE ROUTE
app.delete("/makeUp/:id", isLoggedIn, function (req, res) {
	MakeUpImage.findById(req.params.id, function (err, foundImage) {
		if (err) {
			res.redirect("/makeUp");
		} else {
			//then redirect to the index
			var filePath = "public/" + foundImage.img;
			fs.unlink(filePath, function (err) {
				if (err) {
					console.log(err);
				} else {
					console.log("File was deleted");
				}
			});
		}
	});
	MakeUpImage.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			res.redirect("/makeUp");
		} else {
			res.redirect("/makeUp");
		}
	});
	//redirect
});

//////////////////////////////////////
//fashion Gallery routes
//////////////////////////////////////

app.get("/fashion", function (req, res) {
	FashionImage.find({}).sort({ order: 1 }).exec(function (err, fashionImages) {
		if (err) {
			console.log("ERROR");
		} else {
			res.render("fashion/index", { fashionImages: fashionImages })
		}
	});
});

//New route
app.get("/fashion/new", isLoggedIn, function (req, res) {
	res.render("fashion/new");
});

//create route
app.post("/fashion", isLoggedIn, uploadFashion.single('photo'), function (req, res) {
	FashionImage.create({
		order: req.body.order,
		img: "images/photographs/fashion/" + req.file.filename
	}, function (err, newImage) {
		if (err) {
			res.render("fashion/new");
		} else {
			//then redirect to the index
			res.redirect("/fashion");
		}
	});
});

//Edit Route
app.get("/fashion/:id/edit", isLoggedIn, function (req, res) {
	FashionImage.findById(req.params.id, function (err, foundImage) {
		if (err) {
			res.redirect("/fashion");
		} else {
			//then redirect to the index
			res.render("fashion/edit", { fashionImage: foundImage });
		}
	});
});

//Update Route
app.put("/fashion/:id", isLoggedIn, function (req, res) {
	FashionImage.findByIdAndUpdate(req.params.id, req.body.fashionImage, function (err, updatedImage) {
		if (err) {
			res.redirect("/fashion/" + req.params.id + "/edit");
		} else {
			res.redirect("/fashion");
		}
	});
});

//DELETE ROUTE
app.delete("/fashion/:id", isLoggedIn, function (req, res) {
	FashionImage.findById(req.params.id, function (err, foundImage) {
		if (err) {
			res.redirect("/fashion");
		} else {
			//then redirect to the index
			var filePath = "public/" + foundImage.img;
			fs.unlink(filePath, function (err) {
				if (err) {
					console.log(err);
				} else {
					console.log("File was deleted");
				}
			});
		}
	});
	FashionImage.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			res.redirect("/fashion");
		} else {
			res.redirect("/fashion");
		}
	});
	//redirect
});

//////////////////////////////////////
//Portrait Gallery routes
//////////////////////////////////////

app.get("/portrait", function (req, res) {
	PortraitImage.find({}).sort({ order: 1 }).exec(function (err, portraitImages) {
		if (err) {
			console.log("ERROR");
		} else {
			res.render("portrait/index", { portraitImages: portraitImages })
		}
	});
});

//New route
app.get("/portrait/new", isLoggedIn, function (req, res) {
	res.render("portrait/new");
});

//create route
app.post("/portrait", isLoggedIn, uploadPortrait.single('photo'), function (req, res) {
	PortraitImage.create({
		order: req.body.order,
		img: "images/photographs/portrait/" + req.file.filename
	}, function (err, newImage) {
		if (err) {
			res.render("portrait/new");
		} else {
			//then redirect to the index
			res.redirect("/portrait");
		}
	});
});

//Edit Route
app.get("/portrait/:id/edit", isLoggedIn, function (req, res) {
	PortraitImage.findById(req.params.id, function (err, foundImage) {
		if (err) {
			res.redirect("/portrait");
		} else {
			//then redirect to the index
			res.render("portrait/edit", { portraitImage: foundImage });
		}
	});
});

//Update Route
app.put("/portrait/:id", isLoggedIn, function (req, res) {
	PortraitImage.findByIdAndUpdate(req.params.id, req.body.portraitImage, function (err, updatedImage) {
		if (err) {
			res.redirect("/portrait/" + req.params.id + "/edit");
		} else {
			res.redirect("/portrait");
		}
	});
});

//DELETE ROUTE
app.delete("/portrait/:id", isLoggedIn, function (req, res) {
	PortraitImage.findById(req.params.id, function (err, foundImage) {
		if (err) {
			res.redirect("/portrait");
		} else {
			//then redirect to the index
			var filePath = "public/" + foundImage.img;
			fs.unlink(filePath, function (err) {
				if (err) {
					console.log(err);
				} else {
					console.log("File was deleted");
				}
			});
		}
	});
	PortraitImage.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			res.redirect("/portrait");
		} else {
			res.redirect("/portrait");
		}
	});
	//redirect
});

//////////////////////////////////////
//auth routes
//////////////////////////////////////

// //show register form
// app.get("/register",function(req,res){
// 	res.render("register");
// });

// //handle signup logic
// app.post("/register",function(req,res){
// 	var newUser = new User({username: req.body.username});
// 	User.register(newUser, req.body.password,function(err,user){
// 		if(err){
// 			return res.redirect("/register");
// 		}
// 		passport.authenticate("local")(req,res,function(){
// 			res.redirect("/campgrounds");
// 		});
// 	});
// });

//login Routes
//render login form
app.get("/secret", function (req, res) {
	res.render("secret");
});

//handle login logic 
app.post("/secret", passport.authenticate("local", {
	successRedirect: "/secret",
	failureRedirect: "/secret"
}), function (req, res) {
});

app.get("/logout", function (req, res) {
	req.logOut();
	res.redirect("/secret")
});

//(middleware)
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.send("You are not authorised");
}


//////////////////////////////////////
//blogs routes
//////////////////////////////////////

app.get("/blogs", function (req, res) {
	Blog.find({}).sort({ created: -1 }).exec(function (err, blogs) {
		if (err) {
			console.log("ERROR");
		} else {
			res.render("blogs/index", { blogs: blogs })
		}
	});
});

//New route
app.get("/blogs/new", isLoggedIn, function (req, res) {
	res.render("blogs/new");
});

//create route
app.post("/blogs", isLoggedIn, function (req, res) {
	//create blog
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function (err, newBlog) {
		if (err) {
			res.render("blogs/new");
		} else {
			//then redirect to the index
			res.redirect("/blogs");
		}
	});
	//redirect to index
});

//Show Route
app.get("/blogs/:id", function (req, res) {
	Blog.findById(req.params.id, function (err, foundBlog) {
		if (err) {
			res.redirect("/blogs");
		} else {
			//then redirect to the index
			res.render("blogs/show", { blog: foundBlog });
		}
	});
});

//Edit Route
app.get("/blogs/:id/edit", isLoggedIn, function (req, res) {
	Blog.findById(req.params.id, function (err, foundBlog) {
		if (err) {
			res.redirect("/blogs");
		} else {
			//then redirect to the index
			res.render("blogs/edit", { blog: foundBlog });
		}
	});
});

//Update Route
app.put("/blogs/:id", isLoggedIn, function (req, res) {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
		if (err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//DELETE ROUTE
app.delete("/blogs/:id", isLoggedIn, function (req, res) {
	//destroy blog
	Blog.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	});
	//redirect
});

//////////////////////////////////////
//videos routes
//////////////////////////////////////

app.get("/videos", function (req, res) {
	Video.find({}).sort({ order: 1 }).exec(function (err, videos) {
		if (err) {
			console.log("ERROR");
		} else {
			res.render("videos/index", { videos: videos })
		}
	});
});

//New route
app.get("/videos/new", isLoggedIn, function (req, res) {
	res.render("videos/new");
});

//create route
app.post("/videos", isLoggedIn, function (req, res) {
	//create video
	Video.create(req.body.video, function (err, newVideo) {
		if (err) {
			res.render("videos/new");
		} else {
			//then redirect to the index
			res.redirect("/videos");
		}
	});
	//redirect to index
});

//Show Route
app.get("/videos/:id", function (req, res) {
	Video.findById(req.params.id, function (err, foundVideo) {
		if (err) {
			res.redirect("/videos");
		} else {
			//then redirect to the index
			res.render("videos/show", { video: foundVideo });
		}
	});
});

//Edit Route
app.get("/videos/:id/edit", isLoggedIn, function (req, res) {
	Video.findById(req.params.id, function (err, foundVideo) {
		if (err) {
			res.redirect("/videos");
		} else {
			//then redirect to the index
			res.render("videos/edit", { video: foundVideo });
		}
	});
});

//Update Route
app.put("/videos/:id", isLoggedIn, function (req, res) {
	Video.findByIdAndUpdate(req.params.id, req.body.video, function (err, updatedVideo) {
		if (err) {
			res.redirect("/videos");
		} else {
			res.redirect("/videos/" + req.params.id);
		}
	});
});

//DELETE ROUTE
app.delete("/videos/:id", isLoggedIn, function (req, res) {
	//destroy video
	Video.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			res.redirect("/videos");
		} else {
			res.redirect("/videos");
		}
	});
	//redirect
});

app.listen(port, process.env.IP, function () {
	console.log("Simran server started on port " + port);
});