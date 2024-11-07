const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5001;
const cors = require('cors');
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Allow requests from your frontend with CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,  // Allow cookies/session to be sent
}));

// Middleware Includes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('build'));

// Passport Session Configuration
app.use(sessionMiddleware);

// Start Passport Sessions
app.use(passport.initialize());
app.use(passport.session());

// Route Includes
const userRouter = require('./routes/user.router');
const pantryRouter = require('./routes/pantry.router');
const fridgeRouter = require('./routes/fridge.router');

// Routes
app.use('/api/user', userRouter);
app.use('/api/pantry', pantryRouter);  // Use pantry routes
app.use('/api/fridge', fridgeRouter);  // Use fridge routes

// Listen on Server & Port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
