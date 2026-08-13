const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

const createContact = async (req, res) => {

  console.log("EMAIL USER IN CONTACT:", process.env.EMAIL_USER);
console.log("EMAIL PASS LENGTH IN CONTACT:", process.env.EMAIL_PASS?.length);
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // Save message in MongoDB
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    console.log("📩 Contact saved in MongoDB");

    // Gmail transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // Send email to your own email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: subject,
      text: `
New Contact Message

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
    });

    console.log("📧 Email sent successfully:", info.messageId);

    return res.status(201).json({
      message: "Message sent successfully!",
      contact,
    });

  } catch (error) {
    console.log("========== CONTACT ERROR ==========");
    console.log("MESSAGE:", error.message);
    console.log("CODE:", error.code);
    console.log("===================================");

    return res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      contacts,
    });
  } catch (error) {
    console.log("GET CONTACT ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

module.exports = {
  createContact,
  getContacts,
};