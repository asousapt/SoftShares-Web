const nodemailer = require('nodemailer');

exports.sendEmail = async ( to, subject, text) => {

    // Criar transporter 
    let transporter = nodemailer.createTransport({
        host: process.env[`SMTP_HOST`],
        port: process.env[`SMTP_PORT`], 
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env[`SMTP_USER`], 
            pass: process.env[`SMTP_PASS`], 
        },
    });

    // Configurar
    let mailOptions = {
        from: process.env[`EMAIL_SENDER`], 
        to: to, 
        subject: subject, 
        text: text, 
    };

    // Envio
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email: %s', error);
    }
};
