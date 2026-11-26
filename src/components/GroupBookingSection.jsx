import React from 'react';
import { Phone, MessageCircle, Users } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';

const GROUP_BOOKING_CARDS = [
  {
    id: 'occasion-party',
    title: 'Host Any Occasion or Party',
    image: '/images/group-booking/host-occasion-party.webp',
    alt: 'Friends celebrating a private party with confetti and drinks at Boche Club Bangalore',
    description:
      'Make every milestone unforgettable—birthdays, anniversaries, reunions, farewells, kitty parties, and private DJ & karaoke nights in the heart of Bangalore.',
    accent: 'crimson',
    spanClass: 'md:col-span-3',
    aspectClass: 'aspect-[16/9]',
    objectPosition: 'object-[center_30%]',
  },
  {
    id: 'corporate-event',
    title: 'Host Any Corporate Event',
    image: '/images/group-booking/host-corporate-event.webp',
    alt: 'Corporate team dinner and office mixer at Boche Club on Brigade Road Bangalore',
    description:
      'From executive team dinners and office lunches to product launches, offsites, and Friday mixers—tailored hospitality for Bangalore’s corporate teams.',
    accent: 'gold',
    spanClass: 'md:col-span-3',
    aspectClass: 'aspect-[16/9]',
    objectPosition: 'object-center',
  },
  {
    id: 'private-party-rooms',
    title: 'Private Party Rooms',
    image: '/images/group-booking/private-party-rooms.webp',
    alt: 'Friends celebrating inside a private party room at Boche Club Bangalore',
    description:
      'Dedicated private party rooms featuring comfortable seating, custom celebration decor, private sound controls, and effortless food and drinks for your group.',
    accent: 'crimson',
    spanClass: 'md:col-span-2',
    aspectClass: 'aspect-[3/2]',
    objectPosition: 'object-center',
  },
  {
    id: 'unlimited-food-packages',
    title: 'Unlimited Food Packages',
    image: '/images/group-booking/unlimited-food-packages.webp',
    alt: 'Unlimited gourmet buffet spread and group dining packages at Boche Club Bangalore',
    description:
      'Abundant chef-curated buffets, sizzling starters, hearty main courses, and indulgent desserts crafted for groups—with flexible add-on drink options available.',
    accent: 'gold',
    spanClass: 'md:col-span-2',
    aspectClass: 'aspect-[3/2]',
    objectPosition: 'object-center',
  },
  {
    id: 'tailor-made-entertainment',
    title: 'Tailor Made Entertainment',
    image: '/images/group-booking/tailor-made-entertainment.webp',
    alt: 'Live DJ overlooking the dance floor with club lighting at Boche Club Bangalore',
    description:
      'Customize your entertainment for group bookings—curated music, vibes, and event setups tailored to match the energy of your celebration.',
    accent: 'crimson',
    spanClass: 'md:col-span-2',
    aspectClass: 'aspect-[3/2]',
    objectPosition: 'object-center',
  },
];

export const GroupBookingSection = () => {
  const cleanPhone = siteConfig.contact.phone.replace(/[^0-9+]/g, '');
  const whatsappDigits = cleanPhone.replace(/^\+/, '');

  const buildWhatsAppUrl = (topic) => {
    const message = encodeURIComponent(
      `Hi Boche Club Bangalore! I'd like to enquire about ${topic} for a group booking.`
    );
    return `https://wa.me/${whatsappDigits}?text=${message}`;
  };

  return (
    <section
      id="group-booking"
      aria-label="Group Booking & Corporate Events at Boche Club Bangalore"
      className="relative overflow-clip w-full bg-[#08090C] text-white py-20 sm:py-28 border-t border-white/10 scroll-mt-20"
    >
      {/* Anchor aliases for seamless navigation from Hero CTA & navbar links */}
      <span id="group-bookings" className="absolute -top-20" aria-hidden="true" />
      <span id="reservations" className="absolute -top-20" aria-hidden="true" />

      {/* 1. Atmospheric Dark Club Background with GPU Compositor Parallax & Vignettes */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-clip" aria-hidden="true">
        {/* Parallax Background Photo */}
        <div
          className="group-booking-parallax-bg absolute -top-44 -bottom-44 inset-x-0 w-full h-[calc(100%+352px)] pointer-events-none select-none"
          style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
        >
          <img
            src="/images/group-booking/group-booking-bg.webp"
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            className="w-full h-full object-cover object-center opacity-60 brightness-[0.65] contrast-[1.08]"
            style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
          />
        </div>

        {/* Subtle Club Color Accent Wash (Crimson Left + Warm Gold Right) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 65% 45% at 20% 10%, rgba(255, 23, 68, 0.18) 0%, transparent 65%), radial-gradient(ellipse 60% 45% at 82% 85%, rgba(245, 184, 46, 0.14) 0%, transparent 65%)',
          }}
        />

        {/* Dark Contrast Veil & Seamless Top/Bottom Edge Vignettes */}
        <div className="absolute inset-0 bg-[#08090C]/45 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08090C] via-[#08090C]/20 to-[#08090C] pointer-events-none" />
      </div>

      {/* GPU Compositor Scroll Parallax Keyframes */}
      <style>{`
        @keyframes group-booking-parallax {
          from {
            transform: translate3d(0, -140px, 0);
          }
          to {
            transform: translate3d(0, 140px, 0);
          }
        }
        @supports (animation-timeline: view()) {
          .group-booking-parallax-bg {
            animation: group-booking-parallax linear both;
            animation-timeline: view();
            animation-range: entry 0% exit 100%;
          }
        }
      `}</style>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#08090C]/90 text-[#f5b82e] text-[11px] font-bold tracking-widest uppercase select-none border-[1.2px] border-[#ff1744] mb-4"
            style={{
              boxShadow: '0 0 10px rgba(255, 23, 68, 0.4), inset 0 0 6px rgba(255, 23, 68, 0.18)',
            }}
          >
            <Users className="w-3.5 h-3.5 text-[#f5b82e]" />
            <span>Group Booking</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Celebrate Big at{' '}
            <span style={{ color: '#f5b82e' }}>Boche Club</span>{' '}
            <span
              className="block sm:inline"
              style={{
                color: '#ffe0e5',
                textShadow:
                  '0 0 4px #ffe0e5, 0 0 12px #ff1744, 0 0 26px rgba(255, 23, 68, 0.65)',
              }}
            >
              Together
            </span>
          </h2>

          <div
            className="w-[74px] h-[2px] bg-[#ffe0e5] mx-auto mt-4 mb-5 rounded-full"
            style={{ boxShadow: '0 0 6px #ff1744, 0 0 14px #ff1744' }}
          />

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            We can host your guests for any occasion ranging from anniversaries, birthdays, reunions, get-togethers, kitty parties, farewells, team dinners, private karaoke parties, DJ &amp; dance parties, romantic rooftop dining and more.
          </p>
        </div>

        {/* 5-Card Asymmetric Bento Grid: 2 Large Hero Cards on Row 1 + 3 Feature Cards on Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5 lg:gap-6">
          {GROUP_BOOKING_CARDS.map((card) => {
            const isGold = card.accent === 'gold';

            return (
              <article
                key={card.id}
                className={`${card.spanClass} group relative rounded-2xl overflow-hidden bg-[#0E1016] border transition-all duration-300 hover:-translate-y-1 flex flex-col ${
                  isGold
                    ? 'border-amber-500/25 hover:border-amber-400/60 hover:shadow-[0_14px_40px_rgba(245,184,46,0.14)]'
                    : 'border-[#ff1744]/25 hover:border-[#ff4d6d]/65 hover:shadow-[0_14px_40px_rgba(255,23,68,0.16)]'
                }`}
              >
                {/* Card Media */}
                <div className={`relative w-full ${card.aspectClass} overflow-hidden bg-[#0E1016]`}>
                  <img
                    src={card.image}
                    alt={card.alt}
                    loading="lazy"
                    decoding="async"
                    className={`w-full h-full object-cover ${card.objectPosition} transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform [backface-visibility:hidden]`}
                  />

                  {/* Smooth bottom fade into card body (extended by 2px past edges to prevent sub-pixel hover seams) */}
                  <div className="absolute -inset-x-px -bottom-0.5 top-0 bg-gradient-to-t from-[#0E1016] from-3% via-[#0E1016]/30 via-35% to-transparent pointer-events-none" />
                </div>

                {/* Card Body */}
                <div className="relative z-10 -mt-px bg-[#0E1016] p-5 sm:p-6 flex-1 flex flex-col">
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight mb-2.5 group-hover:text-amber-200 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Concierge Strip */}
        <div className="mt-10 sm:mt-12 rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[#140B0E] via-[#121118] to-[#16120B] border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left space-y-1.5">
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
              Need a Custom Package for Your Group?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Speak directly with our dedicated event concierge for tailored menus, private room layouts, and priority reservations.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href={buildWhatsAppUrl('a Custom Group Booking Package')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all duration-200 hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Booking</span>
            </a>

            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/12 text-white font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5"
            >
              <Phone className="w-4 h-4 text-[#ff4d6d]" />
              <span>Call Concierge</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GroupBookingSection;
