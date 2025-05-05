'use client';
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-blue-200 py-10 px-4 md:px-16">
      <h1 className="text-3xl font-bold text-center text-slate-800 mb-3">Contact Us</h1>

      <div className="bg-slate-500 rounded-2xl shadow-lg grid md:grid-cols-2 gap-5 p-3 md:p-12">
        
        {/* Contact Info */}
        <div>
        <h2 className="text-xl font-semibold mb-4 text-white ">Get in Touch</h2>

          <img src="/contact.jpg" alt="Contact Illustration" className="w-full mb-6 md:mb-0 rounded-full" />
        </div>

        <div className="flex flex-col justify-between text-white ">
          <div className='mt-20'>
            <p className="mb-6">
              We&apos;d love to hear from you. Reach out with any questions, feedback, or support needs.
            </p>
            <div className="space-y-4 text-white  text-sm">
              <div className="flex items-center gap-3">
                <Mail size={18} /> support@estore.com
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} /> +91 9999999999
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} /> India
              </div>
            </div>
          </div>
        </div>

        {/* Exclude Contact Form */}
        {/* You can leave this part empty or add other details if necessary */}
      </div>
    </div>
  );
}
