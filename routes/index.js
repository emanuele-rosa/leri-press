const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Page = require("../model/page");
const validator = require("validator");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

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

router.post("/create", isAuthenticated, upload.single("image"), (req, res) => {
  const { url, title, content } = req.body;
  const image = req.file ? `/images/${req.file.filename}` : null;

  if (validator.isURL(url, { require_tld: false })) {
    Page.create(url, title, content, image);
    res.redirect("/");
  } else {
    res.render("create", { error: "Invalid URL" });
  }
});

router.get("/edit/:url", isAuthenticated, (req, res) => {
  const url = req.params.url;
  try {
    const pageContent = Page.read(url);
    const title = pageContent.match(/<h1>(.*?)<\/h1>/)[1];
    const content = pageContent.replace(/<h1>.*<\/h1>/, "");
    res.render("edit", { url, title, content });
  } catch (error) {
    res.status(404).send("Page not found");
  }
});

router.post(
  "/edit/:url",
  isAuthenticated,
  upload.single("image"),
  (req, res) => {
    const oldUrl = req.params.url;
    const { title, content, newUrl } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : null;

    try {
      Page.update(oldUrl, newUrl || oldUrl, title, content, image);
      res.redirect("/");
    } catch (error) {
      res.render("edit", {
        url: oldUrl,
        title,
        content,
        error: "Failed to update page",
      });
    }
  }
);

router.get("/delete/:url", isAuthenticated, (req, res) => {
  const url = req.params.url;
  try {
    Page.delete(url);
    res.redirect("/admin");
  } catch (error) {
    res.redirect("/admin");
  }
});

router.get("/", (req, res) => {
  const pages = Page.list().map((page) => ({ url: page }));
  res.render("index", { pages });
});

router.get("/:url", (req, res) => {
  const url = req.params.url;
  try {
    const pageContent = Page.read(url);
    const title = pageContent.match(/<h1>(.*?)<\/h1>/)[1];
    const content = pageContent.replace(/<h1>.*<\/h1>/, "");
    res.render("page", { title, content });
  } catch (error) {
    res.status(404).send("Page not found");
  }
});

module.exports = router;
