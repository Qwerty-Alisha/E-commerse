const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
  items: { type: [Schema.Types.Mixed], required: true },
  totalAmount: { type: Number },
  totalItems: { type: Number },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: 'pending' },
  status: { type: String, default: 'pending' },
  selectedAddress: { type: Schema.Types.Mixed, required: true },
  serialNumber: { type: String, required: false }, // optional for old orders
  orderPlacedAt: { type: String, required: false },
}, { timestamps: true }); // Added timestamps to track createdAt

const virtual = orderSchema.virtual('id');
virtual.get(function () {
  return this._id;
});
orderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Order = mongoose.model('Order', orderSchema);