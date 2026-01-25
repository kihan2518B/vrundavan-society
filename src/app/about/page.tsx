// 'use client';

// import { useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// /* ---------------- Carousel Component ---------------- */

// function ImageCarousel({ images, altPrefix }: { images: string[]; altPrefix: string }) {
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setIndex((i) => (i + 1) % images.length);
//     }, 4000);
//     return () => clearInterval(timer);
//   }, [images.length]);

//   return (
//     <div className="relative w-full overflow-hidden rounded-xl border border-appBorder bg-appBg">
//       <div className="relative h-56 sm:h-72">
//         <Image
//           src={images[index]}
//           alt={`${altPrefix} ${index + 1}`}
//           fill
//           className="object-cover"
//           priority
//         />
//       </div>

//       {/* Left */}
//       <button
//         onClick={() => setIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
//         className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow"
//       >
//         <ChevronLeft className="w-5 h-5" />
//       </button>

//       {/* Right */}
//       <button
//         onClick={() => setIndex((i) => (i + 1) % images.length)}
//         className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow"
//       >
//         <ChevronRight className="w-5 h-5" />
//       </button>

//       {/* Dots */}
//       <div className="absolute bottom-2 w-full flex justify-center gap-2">
//         {images.map((_, i) => (
//           <button
//             key={i}
//             onClick={() => setIndex(i)}
//             className={`w-2 h-2 rounded-full ${i === index ? 'bg-appPrimary' : 'bg-appBorder'}`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// /* ---------------- Page ---------------- */

// export default function AboutPage() {
//   return (
//     <main className="min-h-fit bg-appBg font-['Noto Sans Gujarati',sans-serif]">
//       <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
//         {/* HEADER */}
//         <div className="flex items-center gap-3">
//           <Link
//             href="/"
//             className="px-3 py-1 rounded-lg bg-appSurface border border-appBorder text-sm"
//           >
//             ← પાછા જાઓ
//           </Link>
//           <h1 className="text-xl font-semibold text-appText">અમારા વિશે</h1>
//         </div>

//         {/* ================= APAXHUB ================= */}
//         <section className="bg-appSurface rounded-2xl p-6 shadow-card space-y-6">
//           <h1 className="text-2xl font-bold text-appText">
//             Apaxhub – ડિજિટલ ઉકેલો જે બિઝનેસ વધારશે 🚀
//           </h1>

//           <ImageCarousel
//             images={['/apaxhub/1.jpg', '/apaxhub/2.jpg', '/apaxhub/3.jpg', '/apaxhub/4.jpg']}
//             altPrefix="Apaxhub"
//           />

//           <div className="space-y-3 text-appText text-sm leading-relaxed">
//             <p>
//               Apaxhub એક પ્રોફેશનલ સોફ્ટવેર અને વેબ ડેવલપમેન્ટ એજન્સી છે, જે સ્ટાર્ટઅપ્સ અને
//               મેન્યુફેક્ચરિંગ યુનિટ્સ માટે ક્રિએટિવ અને ફંક્શનલ ડિજિટલ સોલ્યુશન્સ બનાવે છે.
//             </p>

//             <p>
//               અમે ફક્ત વેબસાઈટ નથી બનાવતા, અમે તમારા બિઝનેસ માટે સ્કેલેબલ સિસ્ટમ્સ ડિઝાઇન કરીએ છીએ
//               જે લાંબા ગાળે ફાયદો આપે.
//             </p>

//             <ul className="list-disc pl-5 space-y-1">
//               <li>🌐 પ્રીમિયમ વેબસાઇટ ડેવલપમેન્ટ</li>
//               <li>⚙️ કસ્ટમ સોફ્ટવેર (ERP, CRM, મેનેજમેન્ટ સિસ્ટમ્સ)</li>
//               <li>📱 PWA અને મોબાઈલ ફ્રેન્ડલી એપ્સ</li>
//               <li>🎨 બ્રાન્ડિંગ, UI/UX અને ડિઝાઇન</li>
//               <li>📢 સોશિયલ મીડિયા મેનેજમેન્ટ</li>
//             </ul>

//             <p className="font-medium">
//               Apaxhub નો ઉદ્દેશ એક જ છે – તમારા બિઝનેસને ટેકનોલોજી દ્વારા આગળ વધારવો.
//             </p>
//           </div>
//         </section>

//         {/* ================= SHIV BATTERY ZONE ================= */}
//         <section className="space-y-4">
//           <h2 className="text-lg font-semibold text-appText">શિવ બેટરી ઝોન</h2>

//           {/* Carousel */}
//           <ImageCarousel
//             images={[
//               '/shiv_battery_zone/image_1.jpg',
//               '/shiv_battery_zone/image_2.jpg',
//               '/shiv_battery_zone/image_3.jpeg',
//               '/shiv_battery_zone/image_4.jpeg',
//             ]}
//             altPrefix="Shiv Battery Zone"
//           />

//           {/* Content */}
//           <div className="bg-appSurface border border-appBorder rounded-xl p-5 space-y-3">
//             <p className="text-appText text-sm font-medium">
//               મોરબીનું સૌથી વિશ્વાસપાત્ર ઓનલાઇન બેટરી માર્કેટપ્લેસ 🔋
//             </p>

//             <p className="text-appMuted text-sm leading-relaxed">
//               શું તમે બેટરીની સમસ્યાથી પરેશાન છો? હવે ચિંતા છોડો! ૨૦૨૧થી કાર્યરત શિવ બેટરી ઝોન
//               લાવ્યું છે ઘરબેઠા બેટરી સોલ્યુશન.
//             </p>

//             <ul className="text-sm text-appMuted space-y-1 list-disc list-inside">
//               <li>🚗 કાર, બાઇક, ટ્રેક્ટર અને ટ્રક માટે બેટરી</li>
//               <li>🏠 ઘર અને ઓફિસ માટે ઇન્વર્ટર બેટરી</li>
//               <li>🛡️ ઓરિજિનલ કંપની વોરંટી</li>
//               <li>📄 ગાડી અને બાઇક ઇન્શ્યોરન્સ સર્વિસ</li>
//               <li>🚚 મોરબીમાં ઝડપી ડિલિવરી</li>
//             </ul>

//             <p className="text-sm text-appText font-medium">📞 સંપર્ક: 94272 50412 | 97232 50412</p>

//             <p className="text-xs text-appMuted">
//               📍 શોપ નં. 19–20, પ્રમુખ પ્લાઝા, અશ્વમેઘ હોટલ સામે, 8A નેશનલ હાઈવે, ટીંબડી પાટિયા,
//               મોરબી – 363642
//             </p>

//             <Link
//               href="https://share.google/2JPngVz5HFA8lbE1i"
//               target="_blank"
//               className="inline-block text-sm text-appPrimary underline"
//             >
//               Google પર જુઓ
//             </Link>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }

import React from 'react';

export default function Page() {
  return <div>page under construction</div>;
}
