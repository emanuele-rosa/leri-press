const fs = require("fs");
const path = require("path");

const contentDir = path.join(__dirname, "../content");
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

const Page = {
  create: (url, title, content, image) => {
    const pageContent = `<h1>${title}</h1>${
      image ? `<img src="${image}" alt="Image"><br>` : ""
    }${content}`;
    fs.writeFileSync(`${contentDir}/${url}.html`, pageContent);
  },
  read: (url) => {
    const filePath = `${contentDir}/${url}.html`;
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf8");
    } else {
      throw new Error("Page not found");
    }
  },
  update: (oldUrl, newUrl, title, content, image) => {
    const oldFilePath = `${contentDir}/${oldUrl}.html`;
    const newFilePath = `${contentDir}/${newUrl}.html`;

    const pageContent = `<h1>${title}</h1>${
      image ? `<img src="${image}" alt="Image"><br>` : ""
    }${content}`;

    if (fs.existsSync(oldFilePath)) {
      if (oldUrl !== newUrl) {
        fs.renameSync(oldFilePath, newFilePath);
      }
      fs.writeFileSync(newFilePath, pageContent);
    } else {
      throw new Error("Page not found");
    }
  },
  delete: (url) => {
    const filePath = `${contentDir}/${url}.html`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      throw new Error("Page not found");
    }
  },
  list: () => {
    return fs.readdirSync(contentDir).map((file) => file.replace(".html", ""));
  },
};

module.exports = Page;
