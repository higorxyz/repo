import { useCallback, useState } from 'react';
import { Mail, Globe, Zap, Send } from 'lucide-react';
import { SiGithub, SiLinkedin, SiInstagram } from 'react-icons/si';
import emailjs from '@emailjs/browser';
import { useLanguage } from '../../hooks/useLanguage';
import { sendEmail } from '../../config';

const INITIAL_FORM = { name: '', email: '', message: '' };

export const ContactSection = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formStatus, setFormStatus] = useState('');

  const handleFormChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFormSubmit = useCallback(async (event) => {
    event.preventDefault();
    setFormStatus('sending');

    try {
      await sendEmail(emailjs, event.target);
      setFormStatus('success');
      setFormData(INITIAL_FORM);
      setTimeout(() => setFormStatus(''), 3000);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus(''), 3000);
    }
  }, []);

  return (
    <section id="contato" className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Mail className="text-purple-500 w-6 h-6 sm:w-8 sm:h-8" size={32} />
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            {t('contact.title')}
          </h3>
        </div>
        <p className="text-center text-gray-300 text-sm sm:text-base md:text-lg mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
          {t('contact.subtitle')}
        </p>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto mb-6 sm:mb-10">
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
            <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="name" className="block text-gray-300 font-semibold text-sm mb-2">
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder={t('contact.form.name')}
                  required
                  className="card-motion-input w-full bg-black/30 border border-purple-500/30 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/30"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-300 font-semibold text-sm mb-2">
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder={t('contact.form.email')}
                  required
                  className="card-motion-input w-full bg-black/30 border border-purple-500/30 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/30"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-300 font-semibold text-sm mb-2">
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  placeholder={t('contact.form.message')}
                  rows="5"
                  required
                  className="card-motion-input w-full bg-black/30 border border-purple-500/30 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/30 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-purple-500/50 disabled:opacity-60"
              >
                {formStatus === 'sending' ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('contact.form.sending')}
                  </>
                ) : formStatus === 'success' ? (
                  <>{t('contact.form.success')}</>
                ) : formStatus === 'error' ? (
                  <>❌ Erro ao enviar</>
                ) : (
                  <>
                    <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
                    {t('contact.form.send')}
                  </>
                )}
              </button>
              {formStatus === 'success' && (
                <p className="text-green-400 text-center font-semibold text-sm">
                  Mensagem enviada com sucesso! 🎉
                </p>
              )}
              {formStatus === 'error' && (
                <p className="text-red-400 text-center font-semibold text-sm">
                  Erro ao enviar mensagem. Tente novamente! ❌
                </p>
              )}
            </form>
          </div>

          <div className="space-y-4 sm:space-y-5">
            <div className="card-motion bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 p-4 sm:p-6 rounded-xl sm:rounded-2xl hover:-translate-y-2 text-center">
              <Mail className="text-purple-500 w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3" />
              <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">{t('contact.email')}</h4>
              <p className="text-gray-400 text-xs sm:text-sm">dev.higorxyz@gmail.com</p>
            </div>
            <div className="card-motion bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 p-4 sm:p-6 rounded-xl sm:rounded-2xl hover:-translate-y-2 text-center">
              <Globe className="text-purple-500 w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3" />
              <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">{t('contact.location')}</h4>
              <p className="text-gray-400 text-xs sm:text-sm">{t('contact.locationValue')}</p>
            </div>
            <div className="card-motion bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 p-4 sm:p-6 rounded-xl sm:rounded-2xl hover:-translate-y-2 text-center">
              <Zap className="text-purple-500 w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3" />
              <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">{t('contact.response')}</h4>
              <p className="text-gray-400 text-xs sm:text-sm">{t('contact.responseTime')}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 sm:gap-6 justify-center flex-wrap">
          <a
            href="https://github.com/higorxyz"
            target="_blank"
            rel="noopener noreferrer"
            className="card-motion w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500/20 to-purple-500/5 backdrop-blur-xl border border-purple-500/30 rounded-xl sm:rounded-2xl flex items-center justify-center hover:scale-110 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/50"
          >
            <SiGithub size={28} className="sm:w-8 sm:h-8" />
          </a>
          <a
            href="https://www.linkedin.com/in/higorbatista"
            target="_blank"
            rel="noopener noreferrer"
            className="card-motion w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500/20 to-blue-500/5 backdrop-blur-xl border border-blue-500/30 rounded-xl sm:rounded-2xl flex items-center justify-center hover:scale-110 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/50"
          >
            <SiLinkedin size={28} className="sm:w-8 sm:h-8" />
          </a>
          <a
            href="https://www.instagram.com/higorxyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="card-motion w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-500/20 to-pink-500/5 backdrop-blur-xl border border-pink-500/30 rounded-xl sm:rounded-2xl flex items-center justify-center hover:scale-110 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500/50"
          >
            <SiInstagram size={28} className="sm:w-8 sm:h-8" />
          </a>
        </div>
      </div>
    </section>
  );
};
