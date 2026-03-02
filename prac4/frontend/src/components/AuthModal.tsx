import { type SubmitEventHandler, useState } from 'react';
import apiClient from '../api/index.ts';
import { useAuthStore } from '../stores/auth.ts';
import type { AuthResponse } from '../api/types';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { setTokens } = useAuthStore();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setError('');
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let data: AuthResponse | undefined;
    if (tab === 'login') {
      const response = await apiClient.POST('/api/auth/login', {
        body: { email, password },
      });

      if (response.error) {
        setError(response.error)
        setLoading(false)
        return;
      }

      data = response.data
    } else {
      const response = await apiClient.POST('/api/auth/register', {
        body: { email, password, first_name: firstName, last_name: lastName },
      });

      if (response.error) {
        setError(response.error)
        setLoading(false)
        return;
      }

      data = response.data
    }

    if (!data?.accessToken || !data?.refreshToken) {
      setError('Токены не найдены');
      return;
    }

    setTokens(data.accessToken, data.refreshToken);

    resetForm();
    onClose();

    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <div className="modal__title">
            {tab === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
          </div>
          <button className="iconBtn" onClick={onClose}>✕</button>
        </div>

        <div className="modal__tabs">
          <button
            className={`modal__tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setTab('login');
              resetForm();
            }}
          >
            Вход
          </button>
          <button
            className={`modal__tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => {
              setTab('register');
              resetForm();
            }}
          >
            Регистрация
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label className="label">
            Email
            <input
              className="input"
              type="email"
              name="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="label">
            Пароль
            <input
              className="input"
              type="password"
              name="password"
              value={password}
              autoComplete={tab === 'login' ? "current-password" : "new-password"}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {tab === 'register' && (
            <>
              <label className="label">
                Имя
                <input
                  className="input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </label>
              <label className="label">
                Фамилия
                <input
                  className="input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </label>
            </>
          )}

          {error && <div className="error">{error}</div>}

          <div className="modal__footer">
            <button type="button" className="btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? 'Загрузка...' : tab === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}