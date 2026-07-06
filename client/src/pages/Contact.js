import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Evergreen Depot Market</title>
        <meta name="description" content="Get in touch with Evergreen Depot Market. We're here to help with all your plant and gardening needs." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl">We're Here to Help You Grow!</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="03XX-XXXXXXX"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div>
                  <label className="form-label">Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Related</option>
                    <option value="plants">Plant Care Help</option>
                    <option value="delivery">Delivery Query</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-input"
                    rows="5"
                    required
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <FaMapMarkerAlt className="text-green-600 text-xl mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Main Nursery</h3>
                      <p className="text-gray-600">
                        GT Road, Near Botanical Garden<br />
                        Lahore, Punjab, Pakistan
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <FaPhone className="text-green-600 text-xl mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-gray-600">0300-1234567</p>
                      <p className="text-gray-600">042-35123456</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <FaWhatsapp className="text-green-600 text-xl mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">WhatsApp</h3>
                      <p className="text-gray-600">0300-1234567</p>
                      <p className="text-sm text-gray-500">Quick response on WhatsApp!</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <FaEnvelope className="text-green-600 text-xl mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-600">info@evergreendepot.pk</p>
                      <p className="text-gray-600">support@evergreendepot.pk</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <FaClock className="text-green-600 text-xl mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Business Hours</h3>
                      <p className="text-gray-600">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Sunday: 10:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Locations */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="font-bold mb-4">Also Available In:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold">Karachi Branch</p>
                    <p className="text-gray-600">Nursery Road, Karachi</p>
                  </div>
                  <div>
                    <p className="font-semibold">Islamabad Branch</p>
                    <p className="text-gray-600">F-10 Markaz, Islamabad</p>
                  </div>
                  <div>
                    <p className="font-semibold">Faisalabad Branch</p>
                    <p className="text-gray-600">Susan Road, Faisalabad</p>
                  </div>
                  <div>
                    <p className="font-semibold">Multan Branch</p>
                    <p className="text-gray-600">Bosan Road, Multan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
