const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const caseSchema = new mongoose.Schema({
    caseNumber: {type: String, required: true},
    caseDate: {type: Date, required: true},
    caseType: {type: String, required: true},
    caseStatus: {type: String, required: true},
    caseNotes: {type: String, required: true},
    user: {type: ObjectId, required: true},
},
{
    timestamps: true
}
);

const Case = mongoose.model('case', caseSchema);

module.exports = Case;
