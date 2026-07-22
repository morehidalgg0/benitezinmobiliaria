'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Send } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Credenciales de acceso incorrectas.');
      }
    } catch (err) {
      setError('Error al intentar iniciar sesión. Reintente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-850 rounded-lg p-8 shadow-2xl space-y-8">
        {/* LOGO */}
        <div className="text-center space-y-5">
          <BrandLogo size="lg" className="justify-center" />
          <div>
            <h1 className="font-semibold text-lg tracking-widest text-white uppercase">
              Acceso de Administrador
            </h1>
            <p className="text-[10px] tracking-[0.2em] text-neutral-500 uppercase mt-2">
              Panel privado
            </p>
          </div>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-950/30 border border-red-500/20 text-red-400 text-xs rounded p-4 text-center">
              {error}
            </div>
          )}

          {/* USERNAME */}
          <div>
            <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Usuario
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded px-10 py-3.5 text-white"
                placeholder="Usuario administrador"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded px-10 py-3.5 text-white"
                placeholder="Contraseña del sistema"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-brand w-full py-4 rounded text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            {loading ? 'Validando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
