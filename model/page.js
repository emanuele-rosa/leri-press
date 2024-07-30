const fs = require("fs");
const path = require("path");

const contentDir = path.join(__dirname, "../content");
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

const Page = {
  create: (url, content) => {
    fs.writeFileSync(`${contentDir}/${url}.html`, content);
  },
  read: (url) => {
    const filePath = `${contentDir}/${url}.html`;
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8');
    } else {
      throw new Error('Page not found');
    }
  },
  update: (oldUrl, newUrl, content) => {
    const oldFilePath = `${contentDir}/${oldUrl}.html`;
    const newFilePath = `${contentDir}/${newUrl}.html`;

    if (fs.existsSync(oldFilePath)) {
      fs.renameSync(oldFilePath, newFilePath);
      fs.writeFileSync(newFilePath, content);
    } else {
      throw new Error('Page not found');
    }
  },
  delete: (url) => {
    const filePath = `${contentDir}/${url}.html`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      throw new Error('Page not found');
    }
  },
  list: () => {
    return fs.readdirSync(contentDir).map((file) => file.replace(".html", ""));
  },
};

module.exports = Page;
