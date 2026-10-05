import { useState, useEffect } from 'react';

export const DEFAULT_AVATAR = '/default-avatar.svg';
export const VOVO_AVATAR = '/vovo.jpg';

export function getUserAvatar(user) {
  if (user?.photo && user.photo !== VOVO_AVATAR && user.photo !== DEFAULT_AVATAR) {
    return user.photo;
  }
  if (user?.role === 'vovo') {
    return VOVO_AVATAR;
  }
  return DEFAULT_AVATAR;
}

export function useUserProfile() {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('bingo_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Garante que neto não fique com a foto da vovó caso tenha herdado
        if (parsed.role === 'neto' && parsed.photo === VOVO_AVATAR) {
          parsed.photo = null;
        }
        return parsed;
      }
    } catch (e) {}

    return {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      name: 'Vovó',
      role: 'vovo', // 'vovo' | 'neto'
      photo: VOVO_AVATAR,
      autoMark: false,
      autoBingo: false
    };
  });

  useEffect(() => {
    localStorage.setItem('bingo_user_profile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates) => {
    setProfile(prev => {
      const nextRole = updates.role !== undefined ? updates.role : prev.role;
      let nextPhoto = updates.photo !== undefined ? updates.photo : prev.photo;

      // Se mudou para neto e ainda estava com a foto da vovó, troca para o avatar provisório
      if (nextRole === 'neto' && (!nextPhoto || nextPhoto === VOVO_AVATAR)) {
        nextPhoto = null;
      } else if (nextRole === 'vovo' && !nextPhoto) {
        nextPhoto = VOVO_AVATAR;
      }

      return {
        ...prev,
        ...updates,
        role: nextRole,
        photo: nextPhoto
      };
    });
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
    isVovo: profile.role === 'vovo',
    avatarUrl: getUserAvatar(profile)
  };
}
