const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./app')

// Connecting To DATABASE
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'))

// Connecting To SERVER
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server Listening at PORT: ${port}`))
