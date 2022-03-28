const router = require('express').Router();
const Case = require('../models/caseModel');
const auth = require('../middleware/auth');


router.get('/', auth, async (req, res) => {
    try{
        const cases = await Case.find({user: req.user});
        res.json(cases);
    } catch(err){
        res.status(500).json({message: err.message});
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { caseNumber, caseType, caseStatus, caseNotes } = req.body;

        if (!caseNumber || !caseType || !caseStatus || !caseNotes) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }
        const newCase = new Case({
            caseNumber,
            caseType,
            caseStatus,
            caseNotes,
            user: req.user
        });
        const savedCase = await newCase.save();
        res.json(savedCase);
    } catch (err) {
        res.status(500).send();
    }
});

router.put('/:id', auth, async(req, res) => {
    try{
        const { caseNumber, caseType, caseStatus, caseNotes } = req.body;
        const caseId = req.params.id;

        if (!caseNumber || !caseType || !caseStatus || !caseNotes)
            return res.status(400).json({ message: 'Please enter all fields' });

        if (!caseId)
            return res.status(400).json({ message: 'Case ID not given. Please contact the developer.' });
        
        const originalCase = await Case.findById(caseId);
        if (!originalCase)
            return res.status(400).json({ message: 'Case not found. If you believe this is an error, please contact the developer.' });
        
        if (originalCase.user.toString() !== req.user)
        return res.status(401).json({ message: 'You are not authorized to edit this case.' });

        originalCase.caseNumber = caseNumber;
        originalCase.caseType = caseType;
        originalCase.caseStatus = caseStatus;
        originalCase.caseNotes = caseNotes;

        const savedCase = await originalCase.save();

        res.json(savedCase);

    } catch(err){
         res.status(500).send();   
        }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const caseId = req.params.id;

        if (!caseId)
            return res.status(400).json({ message: 'Case ID not given. Please contact the developer.' });
        
        const existingCase = await Case.findById(caseId);
        if (!existingCase)
            return res.status(400).json({ message: 'Case not found. If you believe this is an error, please contact the developer.' });

        if (existingCase.user.toString() !== req.user)
            return res.status(401).json({ message: 'You are not authorized to delete this case.' });

            await existingCase.delete();

            res.json(existingCase);
    } catch (err) {
        res.status(500).send();
    }
});

module.exports = router;