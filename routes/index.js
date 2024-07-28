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