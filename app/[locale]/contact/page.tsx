'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'motion/react';
import { Mail, MessageSquare, Phone } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main role="main" className="flex-grow container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-brand-teal/10 rounded-2xl text-brand-teal">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-black text-slate-900">{t('Navigation.contact')}</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Mail className="h-5 w-5 text-brand-teal" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Email</p>
                    <p className="text-slate-500">support@rosetta.ai</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Phone className="h-5 w-5 text-brand-teal" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Phone</p>
                    <p className="text-slate-500">+20 123 456 7890</p>
                  </div>
                </div>
              </div>
            </div>

            <form className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full rounded-xl border-slate-200 focus:border-brand-teal focus:ring-brand-teal"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="email">Email</label>
                <input 
                   type="email" 
                   id="email" 
                   className="w-full rounded-xl border-slate-200 focus:border-brand-teal focus:ring-brand-teal"
                   placeholder="Your Email"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  rows={4}
                  className="w-full rounded-xl border-slate-200 focus:border-brand-teal focus:ring-brand-teal"
                  placeholder="Your Message"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-brand-teal text-white font-bold py-4 rounded-xl hover:bg-brand-teal/90 transition-colors"
                aria-label="Send Message"
              >
                Send Message
              </button>
            </form>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
