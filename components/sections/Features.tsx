import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '../../data';

export const Features = () => (
  <section className="py-24 px-6 md:px-12 text-black border-t border-black/5 w-full h-full">
    <div className="flex items-end justify-between mb-8 border-b border-black/10 pb-8">
      <h2 className="text-5xl md:text-7xl font-medium tracking-tighter">Latest <br/> Projects.</h2>
      <span className="hidden md:block font-mono text-sm">( _04 )</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 h-full overflow-hidden">
      {projects.map((project, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: i * 0.1 }}
          className="group cursor-pointer"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 rounded-sm mb-4">
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute top-4 right-4 bg-white rounded-full p-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <ArrowUpRight size={20} />
            </div>
          </div>
          <div className="flex justify-between items-start border-t border-black/10 pt-4">
            <div>
              <h3 className="text-2xl font-medium tracking-tight mb-1">{project.title}</h3>
              <p className="text-neutral-500">{project.category}</p>
            </div>
            <span className="font-mono text-sm text-neutral-400">{project.year}</span>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);