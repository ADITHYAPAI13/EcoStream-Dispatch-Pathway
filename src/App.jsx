import React from 'react';

import AuthModal from './components/AuthModal.jsx';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import AppRoutes from './routes/AppRoutes.jsx';

export default function App() {
  const [user, setUser] = useLocalStorage('ecostream.user', null);
  const [authModal, setAuthModal] = React.useState({ open: false, mode: 'signin' });

  const openSignIn = React.useCallback(() => setAuthModal({ open: true, mode: 'signin' }), []);
  const openSignUp = React.useCallback(() => setAuthModal({ open: true, mode: 'signup' }), []);
  const closeAuth = React.useCallback(() => setAuthModal((s) => ({ ...s, open: false })), []);
  const signOut = React.useCallback(() => setUser(null), [setUser]);

  return (
    <>
      <AppRoutes user={user} onOpenSignIn={openSignIn} onOpenSignUp={openSignUp} onSignOut={signOut} />

      <AuthModal
        open={authModal.open}
        mode={authModal.mode}
        onClose={closeAuth}
        onSignIn={(u) => setUser(u)}
      />
    </>
  );
}
