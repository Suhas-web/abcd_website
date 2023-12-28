import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

function uploadFile(req, res, next) {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).send({ error: err.message });
    }
    next();
  });
}

export default uploadFile;
