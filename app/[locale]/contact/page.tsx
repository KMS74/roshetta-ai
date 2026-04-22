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
    <div className="min-h-screen bg-brand-bg flex flex-col transition-colors duration-500">
      <Header />
      
      <main role="main" className="flex-grow container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-brand-teal/10 dark:bg-brand-teal/20 rounded-2xl text-brand-teal dark:text-brand-green">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white">{t('Navigation.contact')}</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <Mail className="h-5 w-5 text-brand-teal dark:text-brand-green" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Email</p>
                    <p className="text-slate-500 dark:text-slate-400">support@rosetta.ai</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <Phone className="h-5 w-5 text-brand-teal dark:text-brand-green" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Phone</p>
                    <p className="text-slate-500 dark:text-slate-400">+20 123 456 7890</p>
                  </div>
                </div>
              </div>
            </div>

            <form className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4 transition-colors">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2" htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-brand-teal focus:ring-brand-teal"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2" htmlFor="email">Email</label>
                <input 
                   type="email" 
                   id="email" 
                   className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-brand-teal focus:ring-brand-teal"
                   placeholder="Your Email"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2" htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  rows={4}
                  className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-brand-teal focus:ring-brand-teal"
                  placeholder="Your Message"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-brand-teal dark:bg-brand-green text-white font-bold py-4 rounded-xl hover:bg-brand-teal/90 dark:hover:bg-brand-green-dark transition-colors shadow-lg shadow-brand-teal/20 dark:shadow-brand-green/20"
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
