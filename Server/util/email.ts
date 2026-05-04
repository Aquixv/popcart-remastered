import nodemailer from 'nodemailer'

export interface EmailOptions {
  email: string;
  subject: string;
  html: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER as string,
      pass: process.env.GOOGLE_APP_PASSWORD as string 
    }
  });

  const mailOptions = {
    from: 'PopCart Support <support@popcart.com>',
    to: options.email,
    subject: options.subject,
    html: options.html 
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;