'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { PhoneCall } from 'lucide-react';

const ImageCarousel = ({ images, alt }: { images: string[]; alt: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full aspect-square group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={images[currentIndex]}
            alt={`${alt} ${currentIndex + 1}`}
            className="w-full h-full object-cover rounded-2xl"
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        aria-label="Previous image"
      >
        <svg className="w-5 h-5 text-appText" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        aria-label="Next image"
      >
        <svg className="w-5 h-5 text-appText" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_: string, idx: number) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'bg-white w-8' : 'bg-white/60 hover:bg-white/80 w-2'
            }`}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default function AboutPage() {
  const apaxhubImages = [
    '/apaxhub/apaxhub-approach.png',
    '/apaxhub/service_2.png',
    '/apaxhub/service_3.png',
    '/apaxhub/service_4.png',
  ];

  const shivBatteryImages = [
    '/shiv_battery_zone/image_1.jpg',
    '/shiv_battery_zone/image_2.jpg',
    '/shiv_battery_zone/image_3.jpeg',
    '/shiv_battery_zone/image_4.jpeg',
  ];

  return (
    <main className="bg-appBg text-appText min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-24">
        {/* ===================== APAXHUB ===================== */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Carousel - Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ImageCarousel images={apaxhubImages} alt="Apaxhub service" />
            </motion.div>

            {/* Content - Right */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-5 font-['Noto Sans Gujarati',sans-serif]"
            >
              <h1 className="text-2xl md:text-3xl text-appText font-semibold leading-snug">
                Apaxhub – ટેકનોલોજી જે બિઝનેસને આગળ વધારે
              </h1>

              <p className="text-base md:text-lg leading-relaxed text-appText ">
                Apaxhub એ એક સંપૂર્ણ ડિજિટલ માર્કેટિંગ અને સોફ્ટવેર ડેવલોપમેન્ટ એજંસી છે, જે
                બિઝનેસને ઓનલાઈન હાજરી, તેને વિકસિત, વિશ્વસનીય અને સ્કેલેબલ બનાવે છે.
              </p>

              <p className="text-base md:text-lg leading-relaxed text-appText">
                અમે પ્રીમિયમ વેબસાઇટ ડેવલપમેન્ટ <br />
                કસ્ટમ સોફ્ટવેર સોલ્યુશન્સ - મોબાઇલ એપ્લિકેશન્સ, સાથે <br />
                સોશિયલ મીડિયા મેનેજમેન્ટ <br />
                ડિજિટલ માર્કેટિંગ અને બ્રાન્ડિંગ સેવાઓ દ્વારા બિઝનેસને યોગ્ય <br />
                ગ્રાહકો સુધી અસરકારક રીતે પહોંચાડીએ છીએ.
              </p>

              <p className="text-base md:text-lg leading-relaxed text-appText">
                Apaxhub માં અમે બિઝનેસની જરૂરિયાતોને સમજી, ટેકનોલોજી અને માર્કેટિંગને એકસાથે ઉપયોગ
                કરીને તમારા બ્રાન્ડની વિશ્વસનીયતા, ઓનલાઈન પહોંચ અને લાંબા ગાળાની કિંમત સતત વધારીએ
                છીએ.
              </p>

              <p className="text-base md:text-lg font-medium text-appText">
                👉 જ્યાં ટેકનોલોજી અને માર્કેટિંગ યોગ્ય દિશામાં મળે, ત્યાં બિઝનેસ વધે છે.
              </p>

              <p className="text-base md:text-lg font-medium text-appText hover:text-success transition flex items-center gap-2">
                <Link
                  href="tel:+918401442160"
                  suppressHydrationWarning
                  aria-label="Call Apaxhub"
                  className="text-appMuted hover:text-appPrimary transition"
                >
                  <PhoneCall className="w-8 h-8" />
                </Link>
                <Link
                  href="https://wa.me/918401442160?text=Hi%20Apaxhub,%20I%20need%20a%20custom%20app%20for%20my%20business."
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Apaxhub"
                  className=""
                >
                  <Image
                    src={'/whatsapp_logo.png'}
                    alt="W"
                    height={200}
                    width={200}
                    className="w-10 h-10"
                  />
                </Link>
                8401442160
              </p>

              {/* CTA */}
              <div className="pt-2">
                <motion.a
                  href="https://apaxhub.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="
                    inline-flex items-center gap-2
                    px-6 py-3 rounded-lg
                    bg-appPrimary text-white
                    font-medium text-sm
                    hover:bg-appPrimaryHover
                    transition
                  "
                >
                  Apaxhub આગળ જુઓ
                </motion.a>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ===================== SHIV BATTERY ZONE ===================== */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="font-['Noto Sans Gujarati',sans-serif]"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-semibold text-appText mb-12"
          ></motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Carousel - Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ImageCarousel images={shivBatteryImages} alt="Shiv Battery Zone" />
            </motion.div>

            {/* Content - Right */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              <h1 className="text-2xl md:text-3xl text-appText font-semibold leading-snug">
                શિવ બેટરી ઝોન
              </h1>
              <p className="text-lg font-medium text-appText">
                મોરબીનું સૌથી વિશ્વાસપાત્ર ઓનલાઇન બેટરી માર્કેટપ્લેસ 🔋
              </p>

              <p className="text-appMuted leading-relaxed">
                શું તમે બેટરીની સમસ્યાથી પરેશાન છો? હવે ચિંતા છોડો! ૨૦૨૧થી કાર્યરત શિવ બેટરી ઝોન
                લાવ્યું છે ઘરબેઠા બેટરી સોલ્યુશન. Amaron અને Exide જેવી ટોચની બ્રાન્ડ્સ હવે માત્ર એક
                કોલ પર!
              </p>

              <ul className="space-y-1 text-appMuted">
                <li>🚗 તમામ વાહનો માટે બેટરી: કાર, બાઇક, ટ્રેક્ટર અને ટ્રક.</li>
                <li>🏠 ઇન્વર્ટર બેટરી: ઘર કે ઓફિસ માટે પાવરફુલ બેકઅપ.</li>
                <li>🛡️ ફુલ વોરંટી: દરેક પ્રોડક્ટ પર કંપનીની ઓરિજિનલ વોરંટી.</li>
                <li>📄 ઇન્શ્યોરન્સ સર્વિસ: ગાડી અને બાઇક ઇન્શ્યોરન્સ પણ અહીં જ.</li>
                <li>🚚 ફાસ્ટ ડિલિવરી: સમગ્ર મોરબીમાં સર્વિસ.</li>
              </ul>

              <p className="font-medium text-appText">ખરીદો વિશ્વાસ, ખરીદો ગુણવત્તા!</p>

              <p className="font-medium text-appText flex items-center gap-2">
                <Link
                  href="tel:+919427250412"
                  suppressHydrationWarning
                  aria-label="Call Apaxhub"
                  className="text-appMuted hover:text-appPrimary transition"
                >
                  <PhoneCall className="w-8 h-8" />
                </Link>
                <Link
                  href="https://wa.me/919427250412"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Apaxhub"
                  className="text-appText hover:text-success transition flex items-center gap-2"
                >
                  <Image
                    src={'/whatsapp_logo.png'}
                    alt="W"
                    height={200}
                    width={200}
                    className="w-10 h-10"
                  />
                </Link>{' '}
                સંપર્ક: 94272 50412 | 97232 50412
              </p>

              <p className="text-sm text-appMuted">
                📍 શોપ નંબર 19 -20, પ્રમુખ પ્લાઝા, અશ્વમેઘ હોટલની સામે, 8 A નેશનલ હાઈવે, ટીંબડી
                પાટિયા, મોરબી – 363642
              </p>

              {/* CTA */}
              <div className="pt-2">
                <motion.a
                  href="https://share.google/2JPngVz5HFA8lbE1i"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="
                    inline-flex items-center gap-2
                    px-6 py-3 rounded-lg
                    bg-red-600 text-white
                    font-medium text-sm
                    hover:opacity-90
                    transition
                  "
                >
                  Shiv Battery Zone જુઓ
                </motion.a>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
