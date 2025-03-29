import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, Date.now() + '-' + file.originalname)
    },
    limits: { fileSize: 5 * 1024 * 1024}, // maxFile size 5MB
    fileFilter: function ( req, file, cb ) {
      if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg'){
        cb(null, true);
      }
      else{
        cb(new Error('only .png , .jpg , .jpeg format allowed'), false);
      }
    }

  })
  
export const upload = multer({ 
    storage,
})