import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const Process: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      title: t('process_step1_title'),
      desc: t('process_step1_desc'),
      icon: "🏺",
      image: "https://images.unsplash.com/photo-1565191999001-551c187427bb?q=80&w=400&auto=format&fit=crop"
    },
    {
      title: t('process_step2_title'),
      desc: t('process_step2_desc'),
      icon: "🔥",
      image: "https://5.imimg.com/data5/SELLER/Default/2025/7/532370541/XW/LG/OK/2272432/dark-grey-smokeless-fire-pit.jpg"
    },
    {
      title: t('process_step3_title'),
      desc: t('process_step3_desc'),
      icon: "🥘",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&auto=format&fit=crop"
    }
  ];

  return (
    <section id="process" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-3xl mb-20"
        >
          <motion.span variants={itemVariants} className="text-sky-700 font-bold uppercase tracking-[0.2em] text-sm">{t('section_process')}</motion.span>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mt-4 leading-tight">{t('process_title')}</motion.h2>
          <motion.p variants={itemVariants} className="text-slate-500 text-lg mt-6">Our process hasn't changed in a century. We respect the time it takes to create perfection.</motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-12"
        >
          {steps.map((step, idx) => (
            <motion.div key={idx} variants={itemVariants} className="group relative">
              <div className="relative h-80 rounded-3xl overflow-hidden mb-8 shadow-lg">
                <img src={step.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={step.title} />
                <div className="absolute inset-0 bg-sky-900/10 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute top-6 left-6 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-xl">{step.icon}</div>
              </div>
              <div className="space-y-3">
                <span className="text-sky-100 font-serif text-5xl italic absolute -top-8 right-0 opacity-40">0{idx + 1}</span>
                <h3 className="text-2xl font-bold text-slate-900">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Process;
