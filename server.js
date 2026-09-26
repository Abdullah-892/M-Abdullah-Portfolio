const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

/* =========================================
   MIDDLEWARE
========================================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Serve frontend static files */
app.use(express.static(__dirname));

/* Fix for "Cannot GET /" error */
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


/* =========================================
   EMAIL TRANSPORTER
========================================= */

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});


/* =========================================
   TEST EMAIL CONNECTION
========================================= */

transporter.verify(function (error) {

    if (error) {

        console.error(
            "Email configuration error:",
            error.message
        );

    } else {

        console.log(
            "Email server is ready."
        );

    }

});


/* =========================================
   CONTACT FORM API
========================================= */

app.post("/api/contact", async (req, res) => {

    try {

        const {
            name,
            email,
            subject,
            message
        } = req.body;


        /* -----------------------------------------
           VALIDATION
        ----------------------------------------- */

        if (
            !name ||
            !email ||
            !subject ||
            !message
        ) {

            return res.status(400).json({
                success: false,
                message: "Please fill in all fields."
            });

        }


        /* Basic email validation */

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(email)) {

            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });

        }


        /* -----------------------------------------
           EMAIL CONTENT
        ----------------------------------------- */

        const mailOptions = {

            from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,

            to: process.env.EMAIL_TO,

            replyTo: email,

            subject: `Portfolio Contact: ${subject}`,

            text: `
New message from your portfolio website.

Name:
${name}

Email:
${email}

Subject:
${subject}

Message:
${message}
            `,

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 700px;
                    margin: 0 auto;
                    padding: 30px;
                    background: #f8fafc;
                    color: #0f172a;
                ">

                    <div style="
                        background: #0d1221;
                        padding: 25px;
                        border-radius: 12px;
                        color: white;
                    ">

                        <h2 style="
                            margin: 0 0 8px;
                            color: #818cf8;
                        ">
                            New Portfolio Message
                        </h2>

                        <p style="
                            margin: 0;
                            color: #cbd5e1;
                        ">
                            Someone submitted the contact form
                            on your portfolio website.
                        </p>

                    </div>


                    <div style="
                        margin-top: 20px;
                        padding: 25px;
                        background: white;
                        border-radius: 12px;
                        border: 1px solid #e2e8f0;
                    ">

                        <p>
                            <strong>Name:</strong>
                            ${escapeHtml(name)}
                        </p>

                        <p>
                            <strong>Email:</strong>
                            ${escapeHtml(email)}
                        </p>

                        <p>
                            <strong>Subject:</strong>
                            ${escapeHtml(subject)}
                        </p>

                        <div style="
                            margin-top: 20px;
                            padding: 18px;
                            background: #f1f5f9;
                            border-radius: 8px;
                            line-height: 1.7;
                        ">

                            <strong>Message:</strong>

                            <p style="
                                white-space: pre-wrap;
                                margin-bottom: 0;
                            ">
                                ${escapeHtml(message)}
                            </p>

                        </div>

                    </div>

                    <p style="
                        margin-top: 20px;
                        color: #64748b;
                        font-size: 13px;
                    ">
                        This email was sent from your
                        M Abdullah portfolio contact form.
                    </p>

                </div>
            `
        };


        /* -----------------------------------------
           SEND EMAIL
        ----------------------------------------- */

        await transporter.sendMail(mailOptions);


        /* -----------------------------------------
           SUCCESS RESPONSE
        ----------------------------------------- */

        return res.status(200).json({

            success: true,

            message:
                "Your message has been sent successfully."

        });

    }


    catch (error) {

        console.error(
            "Contact form error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Something went wrong while sending your message."

        });

    }

});


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHtml(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================
   START SERVER
========================================= */

app.listen(PORT, () => {

    console.log(
        `Portfolio server running at http://localhost:${PORT}`
    );

});