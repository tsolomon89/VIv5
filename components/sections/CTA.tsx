import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export const CTA = () => (
   <section className="py-32 px-6 md:px-12 text-white relative w-full h-full flex flex-col justify-center overflow-hidden">
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
       <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
       <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm mb-8">
                    <Sparkles size={14} className="text-yellow-200" />
                    <span className="text-white/80">Open for new collaborations</span>
               </div>
               <h2 className="text-5xl md:text-8xl font-medium tracking-tighter mb-8">Ready to start?</h2>
               <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto">
                   Let's build something extraordinary together. Reach out to discuss your next project.
               </p>
               <button className="px-10 py-5 bg-white text-black rounded-full text-lg font-bold hover:bg-neutral-200 transition-colors inline-flex items-center gap-2 group">
                   Get in touch <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
               </button>
           </motion.div>
       </div>
   </section>
);