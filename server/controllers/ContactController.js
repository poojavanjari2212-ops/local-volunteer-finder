const Contact = require("../models/Contact");

const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate fields
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

    // Send email using Resend API
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: [process.env.EMAIL_USER],
        reply_to: email,
        subject: subject,
        text: `
New Contact Message

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
        `,
      }),
    });

    const resendData = await resendResponse.json();

    // Check Resend response
    if (!resendResponse.ok) {
      console.log("RESEND ERROR:", resendData);

      throw new Error(
        resendData.message || "Failed to send email using Resend"
      );
    }

    console.log("📧 Email sent successfully:", resendData.id);

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