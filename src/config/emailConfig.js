const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const EMAIL_CONFIG = {
  serviceId: SERVICE_ID,
  templateId: TEMPLATE_ID,
  publicKey: PUBLIC_KEY
};

export const sendEmail = (emailjs, form) => {
  const { serviceId, templateId, publicKey } = EMAIL_CONFIG;

  if (!serviceId || !templateId || !publicKey) {
    return Promise.reject(new Error('EmailJS environment variables não configuradas.'));
  }

  return emailjs.sendForm(serviceId, templateId, form, publicKey);
};
