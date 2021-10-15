const {
    Schema,
    model
} = require('mongoose')

const foodSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    categoryId: {
        ref: 'categorys',
        type: Schema.Types.ObjectId,
        required: true
    }
})

module.exports = model('food', foodSchema)