const express = require("express");
const router = express.Router();
const Page = require("../model/page");
const validator = require("validator");

function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    req.session.user = username;
    res.redirect("/admin");
  } else {
    res.render("login", { error: "Invalid credentials" });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

router.get("/admin", isAuthenticated, (req, res) => {
  const pages = Page.list().map((page) => ({ url: page }));
  res.render("admin", { pages });
});

router.get("/create", isAuthenticated, (req, res) => {
  res.render("create");
});

router.post("/create", isAuthenticated, (req, res) => {
  const { url, content } = req.body;
  if (validator.isURL(url, { require_tld: false })) {
    Page.create(url, content);
    res.redirect("/");
  } else {
    res.render("create", { error: "Invalid URL" });
  }
});

router.get("/edit/:url", isAuthenticated, (req, res) => {
  const url = req.params.url;
  const content = Page.read(url);
  res.render("edit", { url, content });
});

router.post("/edit/:url", isAuthenticated, (req, res) => {
  const oldUrl = req.params.url;
  const { newUrl, content } = req.body;
  if (validator.isURL(newUrl, { require_tld: false })) {
    Page.update(oldUrl, newUrl, content);
    res.redirect("/");
  } else {
    res.render("edit", { url: oldUrl, content, error: "Invalid URL" });
  }
});

router.get("/delete/:url", isAuthenticated, (req, res) => {
  const url = req.params.url;
  Page.delete(url);
  res.redirect("/admin");
});

router.get("/", (req, res) => {
  const pages = Page.list().map((page) => ({ url: page }));
  res.render("index", { pages });
});

router.get("/:url", (req, res) => {
  const url = req.params.url;
  const content = Page.read(url);
  res.render("page", { content });
});
