import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiFishSpot from '../api/apiFishSpot';

export interface UserRoles {
  isModerator: boolean;
  isUser: boolean;
  roles: string[];
}

export const useUserRoles = (): UserRoles & { loading: boolean } => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user) {
        setRoles([]);
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        const res = await apiFishSpot.get(`/usuario/${user.uid}/roles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoles(res.data || []);
      } catch (error) {
        console.error('Error obteniendo roles:', error);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoles();
  }, [user]);

  return {
    roles,
    isModerator: roles.includes('moderador'),
    isUser: roles.includes('usuario'),
    loading,
  };
};
