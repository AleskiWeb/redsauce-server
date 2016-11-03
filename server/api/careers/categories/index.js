var express     = require('express');
var router      = express.Router();
var controller  = require('./category.controller');
var auth        = require('./../../auth/auth.controller');
var uuidRegex   = '[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4{1}[a-fA-F0-9]{3}-[89abAB]{1}[a-fA-F0-9]{3}-[a-fA-F0-9]{12}$'

// POST for creating a document
router.post('/', controller.create);

// GET for a single document with a given UUID (regex matched)
router.get('/:id(' + uuidRegex + ')', controller.read);

// PUT for updating a single document with a given UUID (regex matched)
router.put('/:id(' + uuidRegex + ')', controller.update);

// DELETE for removing a single document with a given UUID (regex matched)
router.delete('/:id(' + uuidRegex + ')', controller.delete);

// GET for reading full docs
router.get('/', controller.list);

module.exports = router;
