const express = require('express')
const morgan = require('morgan')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

// 1) Middlewares
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev')) // returns the info of the request we made
}
app.use(express.json())
app.use(express.static(`${__dirname}/public`)) // Serve the static file

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

// 3) Routes
/*
app.get('/api/v1/tours', getAllTours);
app.get('/api/v1/tours/:id', getTour);
app.post('/api/v1/tours', createTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);
*/

// MOUNTING MIDDLEWARE
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// This will work on ALL HTTP Methods
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`), 404)
})

// GLOBAL ERROR HANDLING
app.use(globalErrorHandler)

module.exports = app
