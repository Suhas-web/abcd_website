import errorHandler from "../middleware/errorHandler.js";
import fs from "fs";
import { google } from "googleapis";
import apiKey from "../apiKey.json" assert { type: "json" };
import { Readable } from "stream";
const SCOPE = ["https://www.googleapis.com/auth/drive"];
const parentId = ["1VrfmDyqxcI5xrPxq_sEZrcZ_7Cep1IZV"];
import pkg from "pdfkit";
const { PDFKit } = pkg;

//FUNCTIONS START
// A Function that can provide access to google drive api
const authorize = async () => {
  const jwtClient = new google.auth.JWT(
    apiKey.client_email,
    null,
    apiKey.private_key,
    SCOPE
  );
  await jwtClient.authorize();
  return jwtClient;
};

// A Function that will upload the desired file to google drive folder
async function uploadFile(authClient, request) {
  const drive = google.drive({ version: "v3", auth: auth });
  const buffer = await request.file.buffer;
  return new Promise((resolve, rejected) => {
    var fileMetaData = {
      name: request.body.userName,
      parents: parentId,
    };
    drive.files.create(
      {
        resource: fileMetaData,
        media: {
          body: Readable.from(buffer), // files that will get uploaded
          mimeType: "application/vnd.ms-excel",
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

async function getFileId(auth, fileName) {
  const drive = google.drive({ version: "v3", auth: auth });
  const res = await drive.files.list({
    auth: auth,
    q: `name='${fileName}' and '${parentId}' in parents and trashed = false`,
    fields:
      "files(id, name, mimeType, parents, webViewLink, size, createdTime)",
    orderBy: "createdTime desc",
  });

  if (res.data.files.length === 0) {
    console.log("No files found.");
    return null;
  } else {
    // res.data.files.map((file) => {
    //   console.log("File: ", file);
    // });
    // console.log("files[0]", res.data.files[0]);
    return res.data.files[0];
  }
}

const downloadFile = async (auth, fileId) => {
  const drive = google.drive({ version: "v3", auth: auth });
  const driveResponse = await drive.files.get(
    {
      fileId: fileId,
      alt: "media",
      auth: auth,
    },
    { responseType: "stream" }
  );

  const fileData = driveResponse.data
    .on("end", () => {
      console.log("Done downloading file.");
    })
    .on("error", (err) => {
      console.error("Error downloading file.");
    })
    .console.log("FileData", fileData);
  return fileData;
};

// ENDPOINTS START
// desc: Get file from google Drive
// endpoint: POST /api/plans/retrieve
// Access: Private
const getPlan = errorHandler(async (req, res) => {
  try {
    const auth = await authorize();
    const drive = google.drive({ version: "v3", auth: auth });
    const file = await getFileId(auth, "Suhas4545");
    if (file) {
      console.log("filesResponse ID", file);
      if (file) {
        console.log("File ID: ", file.id);
        const driveResponse = await drive.files.get(
          {
            fileId: file.id,
            alt: "media",
            auth: auth,
          },
          { responseType: "stream" }
        );

        // // Create a new PDFDocument
        // const doc = new PDFKit.PDFDocument();

        // // Pipe its output to the response
        // doc.pipe(res);

        driveResponse.data
          .on("end", () => {
            console.log("Done downloading file.");
          })
          .on("error", (err) => {
            console.error("Error downloading file.");
          })
          .pipe(res); // pipe the stream data to the PDF document

        res.status(200);
      } else {
        return res
          .status(404)
          .json({ message: "No files found", isError: false });
      }
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

export { uploadPlan, getPlan };
