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
const bcrypt = require('bcrypt');


const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const checkoutRouter = require('./routes/checkout');
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
const indexRouter = require('./routes/index');
const categsRouter = require('./routes/categories');
const vendiRouter = require('./routes/vendi');
const categoriaRouter = require('./routes/categoria');
const contactRouter = require('./routes/contact');
const searchRouter = require('./routes/search');
const profileRouter = require('./routes/profile');

const adminProductsRouter = require('./routes/admin/products');
const adminUsersRouter = require('./routes/admin/users');
const adminCategoriesRouter = require('./routes/admin/categories');

const app = express();

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


app.use(session({
	secret: 'il_tuo_segreto',
	resave: false,
	saveUninitialized: false
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
	{usernameField: 'username'},
	async (email, password, done) => {
		console.log("Tentativo di login con email:", email);

		try {
			const user = await user_dao.getUserByEmail(email);
			console.log("Utente trovato:", user);

			if (!user) {
				return done(null, false, {message: 'Utente non trovato'});
			}

			const isMatch = await bcrypt.compare(password, user.password);
			console.log("Password corretta:", isMatch);

			if (!isMatch) {
				return done(null, false, {message: 'Password errata'});
			}

			user.password = "";
			return done(null, user);
		} catch (err) {
			console.error("Errore durante l'autenticazione:", err);
			return done(err);
		}
	}
));

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await user_dao.getUserById(id);
		if (!user) {
			return done(new Error('Utente non trovato'));
		}
		done(null, user);
	} catch (err) {
		done(err);
	}
});

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/categories', categsRouter);
app.use('/categoria', categoriaRouter);
app.use('/vendi', vendiRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use('/contact', contactRouter);
app.use('/search', searchRouter);
app.use('/profile', profileRouter);

app.use('/admin/users', adminUsersRouter);
app.use('/admin/categories', adminCategoriesRouter);
app.use('/admin/products', adminProductsRouter);

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
