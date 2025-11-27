//frontend\src\services\userProfileService.ts
import api from './api';

export const updateUserProfileEmission = async (userId: string, emission_co2_lifestyle: number) => {
  // envoie un PUT vers /api/user_profiles/:userId
  const payload = { emission_co2_lifestyle };
  const res = await api.put(`/user_profiles/${encodeURIComponent(userId)}`, payload);
  return res.data;
};

export const getUserProfile = async (userId: string) => {
  const res = await api.get(`/user_profiles/${encodeURIComponent(userId)}`);
  return res.data;
};