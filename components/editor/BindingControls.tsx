
import React from 'react';
import { Binding, EntityType } from '../../types';
import { Link2, Database, Users } from 'lucide-react';

interface BindingControlsProps {
    binding: Binding;
    onChange: (binding: Binding) => void;
}

const ENTITIES: EntityType[] = ['brand', 'product', 'feature', 'solution', 'useCase'];

export const BindingControls: React.FC<BindingControlsProps> = ({ binding, onChange }) => {
    const isSelf = binding.kind === 'self';

    return (
        <div className="space-y-4">
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                <button
                    onClick={() => onChange({ kind: 'self' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${isSelf ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/70'}`}
                >
                    <Link2 className="w-3.5 h-3.5" />
                    Self
                </button>
                <button
                    onClick={() => onChange({ kind: 'related', target: 'product', cardinality: 'many' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${!isSelf ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/70'}`}
                >
                    <Database className="w-3.5 h-3.5" />
                    Related
                </button>
            </div>

            {!isSelf && (
                <div className="space-y-3 p-3 bg-white/5 rounded-xl border border-white/5">
                    <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Target Entity</label>
                        <div className="flex flex-wrap gap-1">
                            {ENTITIES.map(ent => (
                                <button
                                    key={ent}
                                    onClick={() => onChange({ ...binding, target: ent } as any)}
                                    className={`px-2 py-1.5 rounded text-[10px] uppercase font-medium border ${binding.target === ent ? 'bg-blue-500/20 border-blue-500/50 text-blue-200' : 'bg-transparent border-white/10 text-white/40 hover:text-white'}`}
                                >
                                    {ent}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Cardinality</label>
                        <div className="flex gap-2">
                            {['one', 'many'].map((card) => (
                                <button
                                    key={card}
                                    onClick={() => onChange({ ...binding, cardinality: card } as any)}
                                    className={`flex-1 py-1.5 rounded text-[10px] uppercase font-medium border ${binding.cardinality === card ? 'bg-blue-500/20 border-blue-500/50 text-blue-200' : 'bg-transparent border-white/10 text-white/40 hover:text-white'}`}
                                >
                                    {card}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
