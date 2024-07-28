const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../content');

const Page = {
  create: (url, content) => {
    fs.writeFileSync(`${contentDir}/${url}.html`, content);
  },
  read: (url) => {
    return fs.readFileSync(`${contentDir}/${url}.html`, 'utf8');
  },
  update: (url, content) => {
    fs.writeFileSync(`${contentDir}/${url}.html`, content);
  },
  delete: (url) => {
    fs.unlinkSync(`${contentDir}/${url}.html`);
  },
  list: () => {
    return fs.readdirSync(contentDir).map(file => file.replace('.html', ''));
  }
};

module.exports = Page;