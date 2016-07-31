var express     = require('express');
var router      = express.Router();
var controller  = require('./user.controller');
var auth        = require('./../auth/auth.controller');
var uuidRegex   = '[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4{1}[a-fA-F0-9]{3}-[89abAB]{1}[a-fA-F0-9]{3}-[a-fA-F0-9]{12}$'

// POST for creating a user
router.post('/', controller.create);

// GET for a single user with a given UUID (regex matched)
router.get('/:id(' + uuidRegex + ')', controller.read);

// PUT for updating a single user with a given UUID (regex matched)
router.put('/:id(' + uuidRegex + ')', controller.update);

// DELETE for removing a single user with a given UUID (regex matched)
router.delete('/:id(' + uuidRegex + ')', controller.delete);

// GET for reading full users docs
router.get('/', controller.list);

// GET a single end users profile information
router.get('/me', auth.isAuthenticated(),  controller.me);

// PUT a single end users profile infomation
router.put('/me', auth.isAuthenticated(),  controller.updateMe);

// // PUT a single users profile information
// router.put('/me', auth.isAuthenticated(),  controller.updateMe);

module.exports = router;
