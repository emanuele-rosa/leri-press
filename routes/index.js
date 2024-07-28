const express = require('express');
const router = express.Router();
const Page = require('../model/page');
const validator = require('validator');
const multer = require('multer');
const upload = multer({ dest: 'public/images/' });

function isAuthenticated(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/login');
    }
  }

  router.get('/login', (req, res) => {
    res.render('login');
  });

  router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      req.session.user = username;
      res.redirect('/admin');
    } else {
      res.render('login', { error: 'Invalid credentials' });
    }
  });

  router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
  });