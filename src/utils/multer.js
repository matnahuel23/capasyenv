const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder;
    if (req.body.type === 'profile') {
      folder = 'src/public/img/profiles';
    } else if (req.body.type === 'product') {
      folder = 'src/public/img/products';
    } else {
      folder = 'src/public/img/documents';
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

module.exports = multer({ storage: storage }).single('file');
