const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const {Strategy: LocalStrategy} = require("passport-local");
const session = require('express-session');
let requirejs = require('requirejs');
const user_dao = require('./models/user_dao');
const bodyParser = require('body-parser');
const flash = require('connect-flash');


const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
//const checkoutRouter = require('./routes/checkout');
//const productRouter = require('./routes/product');
//const cartRouter = require('./routes/cart');
const layoutRouter = require('./routes/layout');
const categsRouter = require('./routes/categories');
const vendiRouter = require('./routes/vendi');
//const categoriaRouter = require('./routes/categoria');

//const adminDashboardRouter = require('./routes/admin/dashboard');
//const adminProductsRouter = require('./routes/admin/products');
//const adminUsersRouter = require('./routes/admin/users');
//const adminCategoriesRouter = require('./routes/admin/categories');

const app = express();
/*
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
*/
requirejs.config({
	baseUrl: __dirname,
	nodeRequire: require
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
//app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


passport.use(new LocalStrategy
(function (username, password, done) {
		user_dao.getUser(username, password).then(({user, check}) => {
			if (!user && !check) {
				return done(null, false, {message: 'Email e Password non corretti!'});
			}
			if (!user) {
				return done(null, false, {message: 'Email non corretta!'});
			}
			if (!check) {
				return done(null, false, {message: 'Password non corretta!'});
			}
			return done(null, user);
		});
	}
));

passport.serializeUser(function (user, done) {
	done(null, user.email);
});

passport.deserializeUser(function (email, done) {
	user_dao.getUserByEmail(email).then(user => {
		done(null, user);
	});
});

app.use(session({
	secret: 'SecretSession',
	resave: false,
	saveUninitialized: false,
}));

app.use(flash());

app.use((req, res, next) => {
	res.locals.messages = req.flash();
	next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/', layoutRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/categories', categsRouter);
app.use('/vendi', vendiRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
