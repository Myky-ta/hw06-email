import sgMail from '../config/sendgrid.js';

export const sendVerificationEmail = async (email, token) => {
  const msg = {
    to: email,
    from: 'your_verified_sender@example.com',
    subject: 'Email verification',
    html: `<a href="http://localhost:3000/api/auth/verify/${token}">Verify your email</a>`,
  };
  await sgMail.send(msg);
};
