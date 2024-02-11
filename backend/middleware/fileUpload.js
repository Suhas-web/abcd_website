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

function uploadMultiple(req, res, next) {
	upload.array("attachments")(req, res, (err) => {
		if (err) {
			// If there's an error during file upload, throw the error
			throw err;
		}
		next();
	});
}

export { uploadFile, uploadMultiple };
