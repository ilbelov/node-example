const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

// load model for MongoDB
const mongoose = require('mongoose');
require('../models/Idea');
const Idea = mongoose.model('ideas');

router.get('/', ensureAuthenticated,  (req, res) => {
    Idea.find({user: req.user.id})
        .sort({ date: 'desc' })
        .then( ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).then( idea => {
		if (idea.user != req.user.id) {
			req.flash('error_msg', 'Npt Authorized');
			res.redirect('/ides');
		} else {
			res.render('ideas/edit', {
				idea: idea
			});
		}
    });
});

router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: 'Please add a title!' });
    }
    if (!req.body.details) {
        errors.push({ text: 'Please add some details!' });
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
			details: req.body.details,
			user: req.body.id
        };
        new Idea(newUser).save().then(idea => {
            req.flash('success_msg', 'Idea added');
            res.redirect('/');
        });
    }
});

router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        (idea.title = req.body.title), (idea.details = req.body.details);

        idea.save().then(idea => {
            req.flash('success_msg', 'Idea updated');
            res.redirect('/');
        });
    });
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({ _id: req.params.id }).then(() => {
        req.flash('success_msg', 'Idea removed');
        res.redirect('/');
    });
});

module.exports = router;