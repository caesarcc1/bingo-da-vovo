import { useState, useEffect } from 'react';

export function useUserProfile() {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('bingo_user_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    return {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      name: 'Vovó',
      role: 'vovo', // 'vovo' | 'neto'
      photo: '/vovo.jpg',
      autoMark: false,
      autoBingo: false
    };
  });

  useEffect(() => {
    localStorage.setItem('bingo_user_profile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const uploadPhoto = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        updateProfile({ photo: base64 });
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return {
    profile,
    updateProfile,
    uploadPhoto,
    isVovo: profile.role === 'vovo'
  };
}
