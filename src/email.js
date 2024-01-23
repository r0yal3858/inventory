import emailjs from "@emailjs/browser";

const sendEmail = async (data, email) => {
  await emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICEID,
    import.meta.env.VITE_EMAILJS_TEMPLATEID,
    {
      reply_to: email,
      inventory: data,
    },
    import.meta.env.VITE_EMAILJS_PUBLICKEY
  );
};

export default sendEmail;
