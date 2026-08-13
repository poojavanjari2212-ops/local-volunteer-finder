const express = require("express");

const router = express.Router();

const {
  createCertificate,
  getCertificates,
  deleteAllCertificates,
} = require("../controllers/CertificateController");

// Create Certificate
router.post("/", createCertificate);

// Get All Certificates
router.get("/", getCertificates);

router.delete("/delete-all", deleteAllCertificates);

module.exports = router;