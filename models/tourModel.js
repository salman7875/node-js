const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour must have less or equal then 40 characters'],
      minLength: [10, 'A tour must have more or equal then 10 characters']
      // validate: [validator.isAlpha, 'Tour name must only contain character']
    },
    slug: String,
    duration: {
      type: String,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          // 'THIS' only point to current document on NEW document creation
          return value < this.price ? true : false
        },
        message: 'Discount price ({VALUE}) should be below regular price!'
      }
    },
    summary: {
      type: String,
      require: [true, 'A tour must have a Summary'],
      trim: true
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must hav difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, diificult.'
      }
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// VIRTUAL
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7
})

// DOCUMENT MIDDLEWARE: runs before .save() and .create() command
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

// tourSchema.pre('save', function (next) {
//   console.log('Will save document...')
//   next()
// })

// tourSchema.post('save', function (doc, next) {
//   console.log(doc)
// })

// QUERY MIDDLEWARE
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } })

  this.start = Date.now()
  next()
})

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`)
  console.log(docs)
  next()
})

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
  next()
})

const Tour = mongoose.model('tour', tourSchema)

module.exports = Tour
