
import React from 'react';
import { DatingProfile } from '../types';

interface ProfileFormProps {
  onStart: (profile: DatingProfile) => void;
  isLoading: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onStart, isLoading }) => {
  const [profile, setProfile] = React.useState<DatingProfile>({
    location: '',
    time: '',
    occasion: '',
    birthday: '',
    instagram: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(profile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-rose-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-rose-600 mb-2">Plan Your Perfect Date</h2>
        <p className="text-slate-500">Tell us a bit about the occasion and your partner.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Location</label>
          <div className="relative">
            <i className="fa-solid fa-location-dot absolute left-3 top-3 text-rose-400"></i>
            <input
              required
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all outline-none"
              placeholder="e.g. Brooklyn, NY"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Time & Date</label>
          <div className="relative">
            <i className="fa-solid fa-calendar absolute left-3 top-3 text-rose-400"></i>
            <input
              required
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all outline-none"
              placeholder="e.g. Sat at 7 PM"
              value={profile.time}
              onChange={(e) => setProfile({ ...profile, time: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Occasion</label>
          <div className="relative">
            <i className="fa-solid fa-heart absolute left-3 top-3 text-rose-400"></i>
            <input
              required
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all outline-none"
              placeholder="e.g. First Anniversary"
              value={profile.occasion}
              onChange={(e) => setProfile({ ...profile, occasion: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Her Birthday</label>
          <div className="relative">
            <i className="fa-solid fa-cake-candles absolute left-3 top-3 text-rose-400"></i>
            <input
              required
              type="date"
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all outline-none"
              value={profile.birthday}
              onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-semibold text-slate-700">Instagram / Style / Vibe</label>
          <div className="relative">
            <i className="fa-brands fa-instagram absolute left-3 top-3 text-rose-400"></i>
            <input
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all outline-none"
              placeholder="e.g. @username or 'loves minimalist art and jazz'"
              value={profile.instagram}
              onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
            />
          </div>
        </div>
      </div>

      <button
        disabled={isLoading}
        type="submit"
        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isLoading ? (
          <i className="fa-solid fa-circle-notch animate-spin"></i>
        ) : (
          <>
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            Generate Recommendations
          </>
        )}
      </button>
    </form>
  );
};

export default ProfileForm;
