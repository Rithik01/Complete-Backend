import multer from "multer";

// The null here signifies that we don't want to handle any errors here //
/// Here the req is the request that the user makes and the file which is present here iske andar aapko saari files miljaati hai yeh sirf multer ke pass hi hota hai islie hum multer use karte hai //

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    //  This file.originalname will be what user has named the file
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });
