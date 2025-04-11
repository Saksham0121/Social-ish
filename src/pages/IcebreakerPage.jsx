// src/pages/IcebreakersPage.jsx
import React from 'react';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const IcebreakersPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 paper-texture overflow-x-hidden">
      
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="py-6 bg-amber-800 text-amber-50 shadow-md"
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={28} />
            <h1 className="text-2xl font-serif tracking-wide">Conversation Starters</h1>
          </div>
          <nav>
            <ul className="flex gap-6 text-lg">
              {['Home', 'Icebreakers', 'Topics', 'About'].map((item) => (
                <motion.li
                  key={item}
                  whileHover={{ scale: 1.1, color: '#fcd34d' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`transition-colors ${item === 'Icebreakers' ? 'font-bold' : ''}`}
                >
                  <a href="#">{item}</a>
                </motion.li>
              ))}
            </ul>
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        className="container mx-auto py-16 px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <IcebreakersBook />
      </motion.main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="bg-amber-800 text-amber-100 py-6"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.p whileHover={{ scale: 1.02 }} className="transition-all">
            &copy; {new Date().getFullYear()} Conversation Starters. All rights reserved.
          </motion.p>
          <p className="text-sm mt-2 text-amber-300">
            These icebreakers are designed to spark meaningful conversations.
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default IcebreakersPage;
