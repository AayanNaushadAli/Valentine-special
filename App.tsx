
import React, { useState, useEffect, Suspense } from 'react';
import { Heart, Sparkles, Music, Star, Send, Camera, Gift, Lock, Eye, EyeOff, MessageCircleHeart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Scene3D from './components/Scene3D';
import LoveLetter from './components/LoveLetter';
import FloatingHearts from './components/FloatingHearts';
import Gallery from './components/Gallery';
import Chat from './components/Chat';

const App: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'home' | 'letter' | 'gallery' | 'chat'>('home');
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(false);

  // Background music (optional auto-play can be added here)

  const handleLogin = () => {
    const validNames = ['shfq', 'sfq', 'shafaque', 'shafq'];
    const validPassword = '301220';

    if (validNames.includes(userName.toLowerCase().trim()) && password === validPassword) {
      // Success
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#ffb3c1', '#ffffff']
      });
      setShowWelcome(true);
      setTimeout(() => setIsStarted(true), 3000);
    } else {
      // Error
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);

      // Hints logic
      if (newAttempts === 1) setErrorMsg("Hmm, that doesn't seem right 💔");
      else if (newAttempts === 2) setErrorMsg("Hint: it's all about numbers… 🔢");
      else if (newAttempts === 3) setErrorMsg("Hint: think of a special date 💭");
      else if (newAttempts === 4) setErrorMsg("Hint: three dates combined into one… 🎂✨");
      else if (newAttempts === 5) setErrorMsg("Hint: 6 digits — Her Birthday + His Birthday + The day they met 💫");
      else {
        setErrorMsg("Take a breath, you'll get it 💕");
        setLoginAttempts(0); // Reset cycle
      }
    }
  };

  return (
    <div className="min-h-screen relative bg-[#fff5f7] text-[#ff4d6d] overflow-hidden font-sans">
      <FloatingHearts />

      <AnimatePresence mode="wait">
        {!isStarted ? (
          !showWelcome ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              className="flex flex-col items-center justify-center h-screen px-6 text-center z-10 relative"
            >
              <div className={`p-8 bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 max-w-md w-full transition-transform ${isShaking ? 'translate-x-[-10px]' : ''}`} style={{ transform: isShaking ? 'translateX(-10px)' : 'none', transition: 'transform 0.1s' }}>
                <Heart className="w-16 h-16 mx-auto mb-6 text-[#ff4d6d] animate-pulse" fill="#ff4d6d" />
                <h1 className="text-3xl font-romantic mb-2 text-[#ff4d6d]">This is for someone very special…</h1>
                <p className="text-gray-600 mb-8 font-medium italic">"Every love story is beautiful, but ours is my favorite."</p>

                <div className="space-y-4 mb-6">
                  {/* Name Input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Your beautiful name..."
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-6 py-4 pl-12 rounded-full bg-white/80 border-2 border-[#ffb3c1] focus:outline-none focus:border-[#ff4d6d] transition-all text-lg shadow-sm placeholder:text-pink-300 text-gray-700"
                    />
                    <Heart className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-300" />
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Our secret code..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      className="w-full px-6 py-4 pl-12 pr-12 rounded-full bg-white/80 border-2 border-[#ffb3c1] focus:outline-none focus:border-[#ff4d6d] transition-all text-lg shadow-sm placeholder:text-pink-300 text-gray-700"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-300" />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-300 hover:text-[#ff4d6d] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={errorMsg}
                    className="mb-6 p-3 bg-red-50 text-red-500 rounded-xl text-sm font-medium border border-red-100 flex items-center justify-center gap-2"
                  >
                    <span>{errorMsg}</span>
                  </motion.div>
                )}

                <button
                  onClick={handleLogin}
                  className="w-full bg-[#ff4d6d] text-white font-bold py-4 rounded-full shadow-lg hover:bg-[#ff758f] transition-all flex items-center justify-center gap-2 group active:scale-95"
                >
                  Unlock Our Story 💕
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-screen px-6 text-center z-20 relative bg-[#ff4d6d] text-white"
            >
              <Heart className="w-32 h-32 animate-bounce mb-8" fill="white" />
              <h1 className="text-5xl font-romantic mb-4">Welcome back, my love 💕</h1>
              <p className="text-xl opacity-90">Get ready for some magic...</p>
            </motion.div>
          )
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-screen flex flex-col relative"
          >
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-30 pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-lg border border-pink-100 pointer-events-auto flex items-center gap-3">
                <Heart className="w-6 h-6 text-[#ff4d6d] animate-pulse" fill="#ff4d6d" />
                <span className="font-romantic text-2xl font-bold text-[#ff4d6d]">Happy Valentine's Day, {userName}! 💝</span>
              </div>
              <div className="flex gap-4 pointer-events-auto">
                <button className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-md hover:scale-110 transition-transform text-[#ff4d6d]">
                  <Music className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto pt-24 pb-32">
              <AnimatePresence mode="wait">
                {activeTab === 'home' && (
                  <motion.div
                    key="tab-home"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="h-full flex flex-col items-center justify-center"
                  >
                    <div className="w-full h-[50vh] cursor-pointer active:scale-95 transition-transform">
                      <Suspense fallback={<div className="flex items-center justify-center h-full"><Heart className="animate-spin text-[#ff4d6d]" /></div>}>
                        <Scene3D />
                      </Suspense>
                    </div>
                    <div className="px-6 text-center mt-8">
                      <h2 className="text-3xl font-romantic mb-2">You are my whole world</h2>
                      <p className="text-gray-500 max-w-sm mx-auto">Tap the floating heart to feel the love, or browse your special surprises below.</p>

                      <div className="flex flex-wrap justify-center gap-4 mt-8">
                        <div onClick={() => setActiveTab('letter')} className="cursor-pointer p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-pink-100 flex flex-col items-center gap-2 hover:bg-white transition-colors group">
                          <Gift className="text-pink-400 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold uppercase tracking-widest text-pink-400">Letter</span>
                        </div>
                        <div onClick={() => setActiveTab('gallery')} className="cursor-pointer p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-pink-100 flex flex-col items-center gap-2 hover:bg-white transition-colors group">
                          <Camera className="text-blue-400 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Memories</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'letter' && <LoveLetter userName={userName} key="tab-letter" />}
                {activeTab === 'gallery' && <Gallery key="tab-gallery" />}
                {activeTab === 'chat' && <Chat userName={userName} key="tab-chat" />}
              </AnimatePresence>
            </main>

            {/* Sticky Navigation */}
            <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl px-2 py-2 rounded-full shadow-xl border border-pink-100 flex items-center gap-1 z-40">
              <NavButton
                active={activeTab === 'home'}
                onClick={() => setActiveTab('home')}
                icon={<Heart className="w-5 h-5" />}
                label="Home"
              />
              <NavButton
                active={activeTab === 'letter'}
                onClick={() => setActiveTab('letter')}
                icon={<Send className="w-5 h-5" />}
                label="Letter"
              />
              <NavButton
                active={activeTab === 'gallery'}
                onClick={() => setActiveTab('gallery')}
                icon={<Camera className="w-5 h-5" />}
                label="Memories"
              />
              <NavButton
                active={activeTab === 'chat'}
                onClick={() => setActiveTab('chat')}
                icon={<MessageCircleHeart className="w-5 h-5" />}
                label="Chat"
              />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${active ? 'bg-[#ff4d6d] text-white shadow-md scale-105' : 'text-gray-400 hover:text-[#ff4d6d] hover:bg-pink-50'
      }`}
  >
    {icon}
    {active && <span className="font-bold text-sm tracking-tight">{label}</span>}
  </button>
);

export default App;
