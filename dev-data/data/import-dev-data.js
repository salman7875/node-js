const dotenv = require('dotenv').config()
const fs = require('fs')
const mongoose = require('mongoose')
const Tour = require('./../../models/tourModel')

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'))

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
)
console.log(tours)

// IMPORT DATA INTO DATABASE
const importData = async () => {
  try {
    await Tour.create(tours)
    console.log('Data successfully loaded')
  } catch (err) {
    console.log(err.message)
  }
  process.exit()
}

// DELETE ALL DATA FROM DATABASE
const deleteData = async () => {
  try {
    await Tour.deleteMany()
    console.log('Data succesfully deleted')
  } catch (err) {
    console.log(err.message)
  }
  process.exit()
}

if (process.argv[2] == '--import') {
  importData()
} else if (process.argv[2] == '--delete') {
  deleteData()
}

console.log(process.argv)
