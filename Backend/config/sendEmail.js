import sendEmail from '../config/emailService.js';

const sendEmailFun = async ({ sendTo, subject, text, html }) => {
  try {
    const result = await sendEmail(sendTo, subject, text, html);
    return result.success;
  } catch (err) {
    console.error('Error sending email:', err.message || err);
    return false;
  }
};

export default sendEmailFun;
