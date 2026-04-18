import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, CheckCircle } from 'lucide-react';
import { saveEnquiry, genId } from '../store';

export default function ContactPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter valid 10-digit mobile number';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const result = await saveEnquiry({ 
        id: genId(), 
        name: form.name, 
        phone: form.phone, 
        message: form.message, 
        createdAt: new Date().toISOString() 
      });
      
      if (result.success) {
        setSubmitted(true);
      } else {
        setSubmitError(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setSubmitError('Failed to connect to server. Please check your internet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent('Hi Sunshine Solutions, I have a query. Please get in touch.');
    window.open(`https://wa.me/919828377776?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-950 to-blue-800 text-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-black mb-2">{t('contact_title')}</h1>
          <p className="text-blue-200 text-base">{t('contact_subtitle')}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-gray-800">Get in Touch</h2>

          {/* Quick Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href="tel:+919828377776"
              className="flex flex-col items-center gap-2 bg-blue-900 text-white rounded-2xl py-5 px-4 text-center hover:bg-blue-800 transition-colors"
            >
              <Phone size={24} className="text-yellow-400" />
              <div>
                <div className="font-bold text-sm">Call Us</div>
                <div className="text-blue-300 text-xs">+91 9828377776</div>
              </div>
            </a>
            <button
              onClick={handleWhatsApp}
              className="flex flex-col items-center gap-2 bg-green-500 text-white rounded-2xl py-5 px-4 text-center hover:bg-green-600 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <div>
                <div className="font-bold text-sm">WhatsApp</div>
                <div className="text-green-100 text-xs">Quick Response</div>
              </div>
            </button>
          </div>

          {/* Info Cards */}
          <div className="space-y-3">
            {[
              { Icon: Phone, label: t('contact_phone'), val: '+91 9828377776', href: 'tel:+919828377776' },
              { Icon: Mail, label: t('contact_email'), val: 'hr@sunshinesolution.in', href: 'mailto:hr@sunshinesolution.in' },
              { Icon: MapPin, label: t('contact_address'), val: t('contact_address_val'), href: null },
            ].map(c => {
              const Icon = c.Icon;
              const content = (
                <div className="flex items-start gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-blue-50 p-2 rounded-xl flex-shrink-0">
                    <Icon size={18} className="text-blue-700" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-medium">{c.label}</div>
                    <div className="text-gray-800 font-semibold text-sm">{c.val}</div>
                  </div>
                </div>
              );
              return c.href ? <a key={c.label} href={c.href}>{content}</a> : <div key={c.label}>{content}</div>;
            })}
          </div>

          {/* Map Embed */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-48">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.123456789!2d75.7873!3d26.9124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db40b9b3f07dd%3A0xddecccce7e5d697a!2sMetro%20Plaza%2C%20Jaipur!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Sunshine Solutions Location"
            />
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-5">Send us a Message</h2>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('contact_form_name')} *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('contact_form_phone')} *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('contact_form_message')} *</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help you?"
                  rows={4}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.message ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>
                {submitError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold mb-2">
                    {submitError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-blue-900 text-white font-bold py-3.5 rounded-xl transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-800'}`}
                >
                  {isSubmitting ? 'Sending...' : t('contact_form_submit')}
                </button>
            </form>
          ) : (
            <div className="text-center py-10">
              <CheckCircle size={56} className="text-green-500 mx-auto mb-3" />
              <h3 className="font-bold text-xl text-gray-800 mb-2">Message Sent!</h3>
              <p className="text-gray-600 text-sm mb-5">{t('contact_form_success')}</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', message: '' }); }}
                className="bg-blue-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-800 transition-colors"
              >
                Send Another
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
