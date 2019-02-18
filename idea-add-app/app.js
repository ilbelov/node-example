const express = require('express');
const path = require('path');
const app = express();
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport config
require('./config/passport')(passport);

// DB Config
const db = require('./config/database');

const port = process.env.PORT || 5000;

mongoose
	.connect(db.mongoURI, {
		useNewUrlParser: true
	})
	.then(() => console.log('MongoDB connected...'))
	.catch(err => console.log(err));

app.engine(
	'handlebars',
	exphbs({
		defaultLayout: 'main'
	})
);
app.set('view engine', 'handlebars');

// body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// method-override
app.use(methodOverride('_method'));

// express-session
app.use(
	session({
		secret: 'keyboard cat',
		resave: true,
		saveUninitialized: true
	})
);
// Passport middleware shoud be after express-session!
app.use(passport.initialize());
app.use(passport.session());

// flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

// Use routes
app.use('/ideas', ideas);
app.use('/users', users);

app.get('/', (req, res) => {
	const title = 'Welcome';
	res.render('index', {
		title: title
	});
});

app.get('/about', (req, res) => {
	res.render('about');
});

app.listen(port, () => {
	console.log(`server started in port ${port}`);
});
