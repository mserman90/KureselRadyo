import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Radio, 
  Search, 
  Mic, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward, 
  Play, 
  Pause, 
  Sparkles,
  ListMusic,
  Heart,
  Globe,
  Loader2,
  Menu,
  X
} from 'lucide-react';
import { STATIONS } from './constants';
import { Station, PlayerState, ChatMessage } from './types';
import StationCard from './components/StationCard';
import Visualizer from './components/Visualizer';
import { getStationRecommendations } from './services/gemini';

const App: React.FC = () => {
  // State
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>(PlayerState.STOPPED);
  const [volume, setVolume] = useState<number>(0.75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStations, setFilteredStations] = useState<Station[]>(STATIONS);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid'); // Placeholder for map
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hey there! I\'m your AI DJ. Tell me what you\'re in the mood for.' }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Filter Logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStations(STATIONS);
      return;
    }
    const lower = searchQuery.toLowerCase();
    setFilteredStations(STATIONS.filter(s => 
      s.name.toLowerCase().includes(lower) || 
      s.genre.toLowerCase().includes(lower) ||
      s.tags.some(t => t.toLowerCase().includes(lower)) ||
      s.location.toLowerCase().includes(lower)
    ));
  }, [searchQuery]);

  // Audio Logic
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous";
    }

    const audio = audioRef.current;

    const handleWaiting = () => setPlayerState(PlayerState.BUFFERING);
    const handlePlaying = () => setPlayerState(PlayerState.PLAYING);
    const handleError = () => {
      console.error("Stream Error");
      setPlayerState(PlayerState.ERROR);
    };

    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentStation) {
      if (audio.src !== currentStation.streamUrl) {
        audio.src = currentStation.streamUrl;
        audio.load();
        setPlayerState(PlayerState.BUFFERING);
        audio.play().catch(e => {
          console.error("Playback failed", e);
          setPlayerState(PlayerState.ERROR);
        });
      } else if (playerState === PlayerState.STOPPED) {
        audio.play().catch(console.error);
      }
    } else {
      audio.pause();
      setPlayerState(PlayerState.STOPPED);
    }
  }, [currentStation]);

  // Toggle Play/Pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentStation) return;

    if (playerState === PlayerState.PLAYING) {
      audio.pause();
      setPlayerState(PlayerState.STOPPED);
    } else {
      audio.play().catch(console.error);
      setPlayerState(PlayerState.BUFFERING); // Assume buffering until playing event
    }
  };

  // Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // AI Chat Logic
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isAiLoading) return;

    const userText = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsAiLoading(true);

    const result = await getStationRecommendations(userText);
    
    setIsAiLoading(false);
    setChatMessages(prev => [...prev, { role: 'model', text: result.reasoning }]);

    if (result.stationIds.length > 0) {
      // Filter list to show recommended
      const recommended = STATIONS.filter(s => result.stationIds.includes(s.id));
      if (recommended.length > 0) {
        setFilteredStations(recommended);
        // Auto play the first one if stopped? Maybe just show them.
        // Let's just scroll to top of list
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatOpen]);

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Radio className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">RadioCast AI</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 mt-4 px-2">Discover</div>
          <button 
            onClick={() => { setFilteredStations(STATIONS); setSearchQuery(''); setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
          >
            <Globe size={18} /> All Stations
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md transition-colors">
            <Heart size={18} /> Favorites <span className="ml-auto text-xs bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">0</span>
          </button>
          
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 mt-6 px-2">AI Assistant</div>
          <button 
            onClick={() => { setChatOpen(true); setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 rounded-md transition-colors"
          >
            <Sparkles size={18} /> Ask AI DJ
          </button>

          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 mt-6 px-2">Genres</div>
          {['Jazz', 'News', 'Lofi', 'Electronic', 'Classical'].map(genre => (
             <button 
               key={genre}
               onClick={() => { setSearchQuery(genre); setSidebarOpen(false); }}
               className="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors"
             >
               <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span> {genre}
             </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-zinc-800">
           <div className="bg-zinc-800/50 rounded-lg p-3 text-xs text-zinc-400">
              <p>Powered by Gemini 2.5 Flash</p>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800 flex items-center px-6 gap-4 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-zinc-400 hover:text-white"
          >
            <Menu size={24} />
          </button>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Search stations, genres, or locations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-zinc-600"
            />
          </div>
          
          <div className="hidden sm:flex items-center gap-3 ml-auto">
             <button 
               className={`p-2 rounded-full transition-colors ${chatOpen ? 'bg-purple-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}
               onClick={() => setChatOpen(!chatOpen)}
             >
                <Sparkles size={20} />
             </button>
          </div>
        </header>

        {/* Scrollable Grid */}
        <div className="flex-1 overflow-y-auto p-6 pb-32">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              {searchQuery ? `Results for "${searchQuery}"` : 'Global Stations'}
            </h2>
            <span className="text-zinc-500 text-sm">{filteredStations.length} stations</span>
          </div>
          
          {filteredStations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <Radio size={48} className="mb-4 opacity-20" />
              <p>No stations found.</p>
              <button 
                onClick={() => { setSearchQuery(''); setFilteredStations(STATIONS); }} 
                className="mt-4 text-purple-400 hover:underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStations.map(station => (
                <StationCard 
                  key={station.id} 
                  station={station} 
                  isPlaying={playerState !== PlayerState.STOPPED}
                  isCurrent={currentStation?.id === station.id}
                  onClick={() => setCurrentStation(station)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Chat Drawer */}
        <div className={`
          absolute right-0 top-16 bottom-24 w-full sm:w-80 bg-zinc-900 border-l border-zinc-800 z-20 transform transition-transform duration-300 shadow-2xl flex flex-col
          ${chatOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
             <h3 className="font-semibold flex items-center gap-2">
               <Sparkles size={16} className="text-purple-500" /> AI DJ
             </h3>
             <button onClick={() => setChatOpen(false)} className="text-zinc-500 hover:text-white">
               <X size={18} />
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-900/50">
             {chatMessages.map((msg, i) => (
               <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-purple-600 text-white rounded-br-none' 
                      : 'bg-zinc-800 text-zinc-200 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
               </div>
             ))}
             {isAiLoading && (
               <div className="flex justify-start">
                 <div className="bg-zinc-800 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1">
                   <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                   <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-75"></span>
                   <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-150"></span>
                 </div>
               </div>
             )}
             <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleChatSubmit} className="p-4 border-t border-zinc-800 bg-zinc-900">
             <div className="relative">
               <input 
                 type="text" 
                 value={chatInput}
                 onChange={(e) => setChatInput(e.target.value)}
                 placeholder="Search by mood..."
                 className="w-full bg-zinc-800 border border-zinc-700 rounded-full pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
               />
               <button 
                 type="submit"
                 disabled={isAiLoading || !chatInput.trim()}
                 className="absolute right-1.5 top-1.5 p-1.5 bg-purple-600 text-white rounded-full hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
               >
                 <Play size={14} fill="currentColor" />
               </button>
             </div>
          </form>
        </div>

      </main>

      {/* Player Footer */}
      <footer className="fixed bottom-0 left-0 right-0 h-24 bg-zinc-950 border-t border-zinc-800 z-50 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Current Track Info */}
        <div className="flex items-center gap-4 w-1/3 min-w-0">
          {currentStation ? (
            <>
              <div className="relative h-14 w-14 rounded overflow-hidden flex-shrink-0 bg-zinc-900 group">
                <img src={currentStation.imageUrl} alt="cover" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center cursor-pointer">
                  <ListMusic size={20} className="text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-white truncate text-sm sm:text-base">{currentStation.name}</h4>
                <p className="text-xs text-zinc-400 truncate">{currentStation.location} • {currentStation.genre}</p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded bg-zinc-900 flex items-center justify-center">
                <Radio className="text-zinc-700" size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-zinc-500 text-sm sm:text-base">Select a station</h4>
                <p className="text-xs text-zinc-600">to start listening</p>
              </div>
            </div>
          )}
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center gap-1 flex-1 max-w-md">
           <div className="flex items-center gap-6">
              <button className="text-zinc-400 hover:text-white transition-colors" disabled={!currentStation}>
                <SkipBack size={20} />
              </button>
              
              <button 
                onClick={togglePlay}
                disabled={!currentStation || playerState === PlayerState.ERROR}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 shadow-lg
                  ${!currentStation ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-white text-black hover:bg-zinc-200'}
                `}
              >
                {playerState === PlayerState.BUFFERING ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : playerState === PlayerState.PLAYING ? (
                  <Pause size={24} fill="currentColor" />
                ) : (
                  <Play size={24} fill="currentColor" className="ml-1" />
                )}
              </button>

              <button className="text-zinc-400 hover:text-white transition-colors" disabled={!currentStation}>
                <SkipForward size={20} />
              </button>
           </div>
           
           {/* Visualizer Container - centered and below controls */}
           <div className="w-full h-8 px-4 opacity-50 hidden sm:block">
              <Visualizer isPlaying={playerState === PlayerState.PLAYING} />
           </div>
        </div>

        {/* Volume & Extras */}
        <div className="flex items-center justify-end gap-2 sm:gap-4 w-1/3 min-w-0">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-zinc-400 hover:text-white hidden sm:block"
          >
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          
          <div className="w-24 hidden sm:block group">
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
              className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white opacity-60 group-hover:opacity-100 transition-opacity"
            />
          </div>
          
          <button 
             className={`p-2 rounded-lg transition-colors lg:hidden ${chatOpen ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
             onClick={() => setChatOpen(!chatOpen)}
          >
             <Sparkles size={20} />
          </button>
        </div>
      </footer>

    </div>
  );
};

export default App;