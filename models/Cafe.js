const {
    Schema,
    model
} = require('mongoose')

const cafeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true
    }
})
module.exports = model('cafe', cafeSchema)