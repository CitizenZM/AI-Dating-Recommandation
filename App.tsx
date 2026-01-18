
import React, { useState, useCallback } from 'react';
import { DatingProfile, Message } from './types';
import ProfileForm from './components/ProfileForm';
import ChatInterface from './components/ChatInterface';
import { generateDatingAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [profile, setProfile] = useState<DatingProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async (newProfile: DatingProfile) => {
    setProfile(newProfile);
    setIsLoading(true);
    
    try {
      const response = await generateDatingAdvice(newProfile, []);
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const groundingUrls = groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || 'External Link',
        uri: chunk.web?.uri || '#'
      })) || [];

      const initialMessage: Message = {
        role: 'model',
        content: response.text || "I've analyzed your request. Here are some tailored date ideas for you.",
        timestamp: Date.now(),
        groundingUrls: groundingUrls
      };
      
      setMessages([initialMessage]);
    } catch (error) {
      console.error("Failed to generate advice:", error);
      alert("Something went wrong. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!profile) return;

    const userMsg: Message = {
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await generateDatingAdvice(profile, [...messages, userMsg]);
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const groundingUrls = groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || 'External Link',
        uri: chunk.web?.uri || '#'
      })) || [];

      const modelMsg: Message = {
        role: 'model',
        content: response.text || "I'm processing your request...",
        timestamp: Date.now(),
        groundingUrls: groundingUrls
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setProfile(null);
    setMessages([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 glass border-b border-rose-100 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2" onClick={reset} style={{ cursor: 'pointer' }}>
          <div className="bg-rose-600 p-2 rounded-lg text-white">
            <i className="fa-solid fa-heart-pulse"></i>
          </div>
          <h1 className="text-xl font-serif font-bold tracking-tight text-slate-800">
            Amour<span className="text-rose-600">Plan</span>
          </h1>
        </div>
        {profile && (
          <button 
            onClick={reset}
            className="text-slate-500 hover:text-rose-600 text-sm font-medium transition-colors"
          >
            Start Over
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {!profile ? (
          <div className="animate-fade-in">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">
                Elevate Every <span className="text-rose-600 italic">Encounter</span>
              </h2>
              <p className="text-lg text-slate-600">
                Let AI find the perfect blend of venue, vibe, and conversation to make your special someone feel truly seen.
              </p>
            </div>
            <ProfileForm onStart={handleStart} isLoading={isLoading} />
            
            <section className="mt-20 grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-map-location-dot text-xl"></i>
                </div>
                <h3 className="font-bold mb-2">Local Gems</h3>
                <p className="text-sm text-slate-500">Real-time search grounding to find the hottest spots in your city.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-star text-xl"></i>
                </div>
                <h3 className="font-bold mb-2">Zodiac Insights</h3>
                <p className="text-sm text-slate-500">Analyze birthdays for thoughtful personality-driven gift ideas.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-brands fa-instagram text-xl"></i>
                </div>
                <h3 className="font-bold mb-2">Aesthetic Matches</h3>
                <p className="text-sm text-slate-500">Matching the date's vibe to her personal style and Instagram presence.</p>
              </div>
            </section>
          </div>
        ) : (
          <div className="h-[calc(100vh-12rem)] flex gap-6">
            {/* Sidebar Summary (Desktop) */}
            <div className="hidden lg:block w-80 space-y-4 overflow-y-auto">
              <div className="bg-white p-6 rounded-2xl shadow-md border border-rose-50">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-clipboard-list text-rose-500"></i>
                  Date Profile
                </h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex flex-col gap-1">
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Location</span>
                    <span className="text-slate-700 font-medium">{profile.location}</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Occasion</span>
                    <span className="text-slate-700 font-medium">{profile.occasion}</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Target Date</span>
                    <span className="text-slate-700 font-medium">{profile.time}</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Birthday</span>
                    <span className="text-slate-700 font-medium">{profile.birthday}</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Style/Vibe</span>
                    <span className="text-slate-700 font-medium italic">{profile.instagram || 'None provided'}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col h-full">
              <ChatInterface 
                messages={messages} 
                onSendMessage={handleSendMessage} 
                isLoading={isLoading} 
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-rose-100 text-center text-slate-400 text-sm bg-white">
        &copy; {new Date().getFullYear()} AmourPlan. Powered by Gemini.
      </footer>
    </div>
  );
};

export default App;
