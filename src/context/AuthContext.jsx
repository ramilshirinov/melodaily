import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authDebug, setAuthDebug] = useState(null);

  const fetchProfile = useCallback(async (userId, userMeta = {}) => {
    if (!userId) {
      setProfile(null);
      return;
    }

    // maybeSingle() — 0 sətir qaytarsa XƏTA atmır, sadəcə data: null qaytarır
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('[Auth] Profil çəkilərkən xəta:', error.message);
      setAuthDebug(`Profil oxuma xətası: ${error.message}`);
      setProfile(null);
      return;
    }

    if (data) {
      setProfile(data);
      setAuthDebug(null);
      return;
    }

    // --- ÖZ-ÖZÜNÜ SAĞALTMA: profil sətri yoxdursa, indi yaradırıq ---
    console.warn('[Auth] Profil tapılmadı, avtomatik yaradılır:', userId);
    const fallbackUsername = userMeta.username || `user_${userId.slice(0, 8)}`;
    const fallbackName = userMeta.name || 'Yeni İstifadəçi';

    const { data: created, error: createError } = await supabase
      .from('profiles')
      .upsert(
        { id: userId, username: fallbackUsername, name: fallbackName, role: 'listener' },
        { onConflict: 'id' }
      )
      .select()
      .maybeSingle();

    if (createError) {
      console.error('[Auth] Profil avtomatik yaradıla bilmədi:', createError.message);
      setAuthDebug(`Profil yaradıla bilmədi: ${createError.message}`);
      setProfile(null);
    } else {
      setProfile(created);
      setAuthDebug(null);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
      if (!isMounted) return;
      if (error) console.error('[Auth] getSession xətası:', error.message);

      setSession(currentSession);
      fetchProfile(
        currentSession?.user?.id,
        currentSession?.user?.user_metadata
      ).finally(() => {
        if (isMounted) setLoading(false);
      });
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('[Auth] Auth hadisəsi:', event, newSession?.user?.id || '(sessiya yoxdur)');
      setSession(newSession);
      fetchProfile(newSession?.user?.id, newSession?.user?.user_metadata);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signUp = async ({ email, password, username, name }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, name } },
    });

    // Confirm-email AÇIQDIRSA, data.session === null olacaq — bu normaldır
    const needsEmailConfirmation = !error && data?.user && !data?.session;

    return { data, error, needsEmailConfirmation };
  };

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
  };

  const refreshProfile = () => fetchProfile(session?.user?.id, session?.user?.user_metadata);

  const value = {
    session,
    user: session?.user || null,
    profile,
    loading,
    authDebug,
    isAuthenticated: !!session,
    signUp,
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth() mütləq <AuthProvider> daxilində çağırılmalıdır');
  return ctx;
}