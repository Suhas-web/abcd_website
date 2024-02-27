import errorHandler from "../middleware/errorHandler.js";
import { google } from "googleapis";
import { Readable } from "stream";
const SCOPE = ["https://www.googleapis.com/auth/drive"];
const parentId = ["1VrfmDyqxcI5xrPxq_sEZrcZ_7Cep1IZV"]; //TODO: read from .env
const classicParentId = ["1pERUZXFLvvTqkNsCscI-8wav6qjxcGWZ"];

//FUNCTIONS START
// A Function that can provide access to google drive api
let cachedAuth = null;

const authorize = async () => {
	if (cachedAuth) {
		return cachedAuth;
	}

	const jwtClient = new google.auth.JWT(
		process.env.GOOGLE_CLIENT_EMAIL,
		null,
		process.env.GOOGLE_PRIVATE_KEY,
		SCOPE
	);

	await jwtClient.authorize();
	cachedAuth = jwtClient;

	return jwtClient;
};

// A Function that will upload the desired file to google drive folder
async function uploadFile(authClient, request) {
	const drive = google.drive({ version: "v3", auth: authClient });
	const buffer = await request.file.buffer;
	return new Promise((resolve, rejected) => {
		var fileMetaData = {
			name: `${request.body.userName}_${request.file.originalname}`,
			parents: parentId,
		};
		drive.files.create(
			{
				resource: fileMetaData,
				media: {
					body: Readable.from(buffer), // files that will get uploaded
					mimeType: "application/pdf",
				},
				fields: "id",
			},
			function (error, file) {
				if (error) {
					return rejected(error);
				}
				resolve(file);
			}
		);
	});
}

const getClassicPlan = errorHandler(async (req, res) => {
	try {
		const auth = await authorize();
		const query = `'${classicParentId}' in parents and trashed = false`;

		const files = await getFileId(auth, query);
		if (files && files.length > 0) {
			files.map((file) => console.log(file));
			res.status(200).json({ files });
		} else {
			console.log("No files found.");
			res.status(404).send("PDF Not found");
		}
	} catch (error) {
		console.log(error);
		res.status(500).send(`Server error: ${error}`);
	}
});

async function getFileId(auth, query) {
	const drive = google.drive({ version: "v3", auth: auth });
	const res = await drive.files.list({
		auth: auth,
		q: query,
		fields:
			"files(id, name, mimeType, parents, webViewLink, size, createdTime)",
		orderBy: "createdTime desc",
	});

	if (res.data.files.length === 0) {
		console.log("No files found.");
		return null;
	} else {
		res.data.files.map((file) => console.log(file));
		return res.data.files;
	}
}

// ENDPOINTS START
// desc: Get file from google Drive
// endpoint: POST /api/plans/retrieve
// Access: Private
const getPlan = errorHandler(async (req, res) => {
	try {
		const auth = await authorize();
		const drive = google.drive({ version: "v3", auth: auth });
		const query = `'${parentId}' in parents and trashed = false and name contains '${req.params.id}_'`;
		console.log("Download query: ", query);
		const files = await getFileId(auth, query);
		if (!files) {
			return res.status(404).send("File not found");
		}
		const file = files.at(0);
		console.log("Start download File: ", file);
		if (file) {
			console.log("filesResponse ID", file);
			const driveResponse = await drive.files.get(
				{
					fileId: file.id,
					alt: "media",
					auth: auth,
				},
				{ responseType: "stream" }
			);

			driveResponse.data
				.on("end", () => {
					console.log("Done downloading file.");
				})
				.on("error", (err) => {
					console.error("Error downloading file.", err);
				})
				.pipe(res); // pipe the stream data to the PDF document
			res.status(200);
		} else {
			return res
				.status(404)
				.json({ message: "No files found", isError: false });
		}
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.json({ message: "Server Error when fetching file", isError: true });
	}
});

// desc: Upload file to google Drive
// endpoint: POST /api/plans/upload
// Access: Private && Admin
const uploadPlan = errorHandler(async (req, res) => {
	try {
		await authorize().then((auth) => uploadFile(auth, req));
		res
			.status(201)
			.json({ message: "Uploaded file successfully", isError: false });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error uploading file", isError: true });
	}
});

//desc: Get all plans for premium users
//endpoint: POST /api/plans/history
//Access: Private
const getPlanList = errorHandler(async (req, res) => {
	const fileName = req.user._id.toString();
	try {
		const auth = await authorize();
		const query = `'${parentId}' in parents and trashed = false and name contains '${fileName}_'`;
		console.log("Query: ", query);
		const files = await getFileId(auth, query);

		if (files && files.length > 0) {
			console.log("Files in gdrive: ", files, files.length);
			return res.status(200).json({ fileList: files });
		} else {
			console.log("Files in gdrive: ", files);
			return res.status(404).send("No files found");
		}
	} catch (err) {
		console.log(err);
		return res.status(500).send("Error occured: ", err);
	}
});

export { uploadPlan, getPlan, getPlanList, getClassicPlan };
