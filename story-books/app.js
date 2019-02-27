const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// Models
require('./models/User');
require('./models/Story');

// Passport
require('./config/passport')(passport);

// Routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');

// Keys
const keys = require('./config/keys');

// Helpers
const { truncate, stripTags, formatDate, select, editIcon } = require('./helpers/hbs');
 
// Mongoose
mongoose.connect(keys.mongoURI, {
	useNewUrlParser: true
})
	.then(() => console.log('MongoDB connected...'))
	.catch(error => console.log(error));

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Override method
app.use(methodOverride('_method'));

app.engine('handlebars', exphbs({
	helpers: {
		truncate: truncate,
		stripTags: stripTags,
		formatDate: formatDate,
		select: select,
		editIcon: editIcon
	},
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// use Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});