import React from 'react';
import { Station } from '../types';
import { Play, Loader2, Radio } from 'lucide-react';

interface StationCardProps {
  station: Station;
  isPlaying: boolean;
  isCurrent: boolean;
  onClick: () => void;
}

const StationCard: React.FC<StationCardProps> = ({ station, isPlaying, isCurrent, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`group relative flex flex-col gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300 border 
        ${isCurrent ? 'bg-zinc-800/80 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700'}
      `}
    >
      <div className="relative aspect-square rounded-lg overflow-hidden bg-zinc-950">
        <img 
          src={station.imageUrl} 
          alt={station.name} 
          className={`w-full h-full object-cover transition-transform duration-500 ${isCurrent && isPlaying ? 'scale-110' : 'group-hover:scale-105'}`}
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 
          ${isCurrent || 'opacity-0 group-hover:opacity-100'} bg-black/40 backdrop-blur-[2px]`}
        >
          <div className="bg-white text-black rounded-full p-3 shadow-lg transform transition-transform hover:scale-110 active:scale-95">
             {isCurrent && isPlaying ? (
                // Visualizer icon or similar when playing
                <div className="flex gap-1 h-4 items-end justify-center w-4">
                  <div className="w-1 bg-black animate-[bounce_1s_infinite]"></div>
                  <div className="w-1 bg-black animate-[bounce_1.2s_infinite]"></div>
                  <div className="w-1 bg-black animate-[bounce_0.8s_infinite]"></div>
                </div>
             ) : (
                <Play size={20} fill="currentColor" className="ml-0.5" />
             )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className={`font-semibold truncate ${isCurrent ? 'text-purple-400' : 'text-zinc-100'}`}>
          {station.name}
        </h3>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">{station.genre}</span>
          <span className="truncate max-w-[100px]">{station.location}</span>
        </div>
      </div>
    </div>
  );
};

export default StationCard;