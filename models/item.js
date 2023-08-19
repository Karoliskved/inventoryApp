const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, minLength: 2, maxLength: 100 },
  description: { type: String, required: true, maxLength: 400 },
  amount: { type: Number, required: true },
  price: { type: Schema.Types.Decimal128, required: true },
  category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  photoURL: { type: String, maxLength: 400 },
});
ItemSchema.virtual('url').get(function () {
  return `/inventory/item/${this._id}`;
});
module.exports = mongoose.model('item', ItemSchema);
