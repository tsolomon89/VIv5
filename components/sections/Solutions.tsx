import React from 'react';
import { Hexagon, Square, Triangle, CheckCircle } from 'lucide-react';

export const Solutions = () => (
    <section className="py-24 px-6 md:px-12 text-black border-t border-black/5 w-full h-full flex flex-col justify-center">
        <div className="max-w-7xl mx-auto w-full">
            <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="text-sm font-mono text-neutral-400 block mb-4">/ SERVICES</span>
                    <h2 className="text-4xl md:text-6xl font-medium tracking-tighter">Our Expertise.</h2>
                </div>
                <p className="max-w-md text-neutral-500">
                    We combine strategic thinking with design excellence to create brands that stand out in a crowded digital landscape.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: 'Brand Identity', desc: 'Crafting distinct visual languages that resonate with your audience and stand the test of time.', icon: Hexagon },
                    { title: 'Digital Products', desc: 'Building robust, scalable web applications with cutting-edge technologies and seamless UX.', icon: Square },
                    { title: 'Motion Design', desc: 'Bringing static interfaces to life with fluid animations and interactive 3D experiences.', icon: Triangle }
                ].map((s, i) => (
                    <div key={i} className="group p-8 bg-white border border-black/5 rounded-2xl hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-500">
                             <s.icon size={100} />
                        </div>
                        <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
                            <CheckCircle size={20} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 relative z-10">{s.title}</h3>
                        <p className="text-neutral-500 leading-relaxed relative z-10">{s.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);