var express         = require('express');
var router          = express.Router();
var controller      = require('./career.controller');
var auth            = require('./../auth/auth.controller');
var careerCategories  = require('./categories');

var uuidRegex   = '[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4{1}[a-fA-F0-9]{3}-[89abAB]{1}[a-fA-F0-9]{3}-[a-fA-F0-9]{12}$';

router.use('/categories', careerCategories);

// POST for creating a user
router.post('/', controller.create);

// GET for a single user with a given UUID (regex matched)
router.get('/:id(' + uuidRegex + ')', controller.read);

// PUT for updating a single user with a given UUID (regex matched)
router.put('/:id(' + uuidRegex + ')', controller.update);

// DELETE for removing a single user with a given UUID (regex matched)
router.delete('/:id(' + uuidRegex + ')', controller.delete);

// GET for reading full career docs
router.get('/', controller.list);

// GET for reading full career with categories
router.get('/list', controller.listWithCareers);

module.exports = router;
