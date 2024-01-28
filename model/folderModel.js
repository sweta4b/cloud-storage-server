// models/folderModel.js
const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'AppUser' },
  isDirectory:Boolean,
  path: String,
  size: Number,
  fileId: { type: mongoose.Schema.Types.ObjectId }
});

const MetaData = mongoose.model('MetaData', folderSchema);

module.exports = { MetaData };
