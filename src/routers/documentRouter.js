import express from "express";

import {
  client_documents_upload,
  delete_document,
  get_documents,
  get_documents_By_Id,
  search_document,
  testingmailer,
} from "../controllers/DocumentController.js";

import multer from "multer";

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/document_upload_zipfiles/"); // Specify the destination folder for the zip file
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const documentRouter = express.Router();

documentRouter.post("/document_upload", client_documents_upload);
documentRouter.post("/get_document", get_documents);
documentRouter.post("/search_document", search_document);
documentRouter.post("/get_documents_By_Id", get_documents_By_Id);
documentRouter.put("/delete_document", delete_document);
documentRouter.post("/send_mail", upload.single("file"), testingmailer);
export default documentRouter;
