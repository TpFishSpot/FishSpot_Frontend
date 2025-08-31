import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface UserRoles {
  isModerator: boolean;
  isUser: boolean;
  roles: string[];
}

export const useUserRoles = (): UserRoles & { loading: boolean } => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user) {
        setRoles([]);
        return;
      }

      setLoading(true);
      try {
        await user.getIdToken();
        setRoles(['usuario']);
      } catch (error) {
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
