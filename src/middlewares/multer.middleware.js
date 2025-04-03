import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/temp");
    },
    filename: function (req, file, cb) {
      const suffix = Date.now();
        cb(null, file.originalname + suffix)
    },
  })
const upload = multer({
    fileFilter: function (req, file, cb) {
        const allowedFields = ['avatar', 'coverImage'];
        if (!allowedFields.includes(file.fieldname)) {
          console.log(file);
            return cb(new multer.MulterError('Unexpected field'), false);
        }
        cb(null, true);
    },
    storage: storage,
})

export {upload}