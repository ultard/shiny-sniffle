import { useEffect, useState } from 'react';

import apiClient from './api/index.ts';
import { useAuthStore } from './stores/auth.ts';
import type { Product, User, UserRole } from './api/types';

import './App.scss';

import ProductModal from './components/ProductModal.tsx';
import ProductsList from './components/ProductsList.tsx';
import AuthModal from './components/AuthModal.tsx';

function App() {
  const { accessToken, isAuthenticated, clearTokens } = useAuthStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productModalMode, setProductModalMode] = useState<'create' | 'edit'>('create');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      if (!isAuthenticated()) {
        setProducts([]);
        setCurrentUser(null);
        setUsers([]);
        setLoading(false);
        return;
      }

      await Promise.all([loadProducts(), loadCurrentUser()]);
    };

    initialize();
  }, [accessToken]);

  const loadProducts = async () => {
    setLoading(true);
    const response = await apiClient.GET('/api/products');

    if (!response.data || response.error) {
      setLoading(false);
      return;
    }

    setProducts(response.data);
    setLoading(false);
  };

  const loadCurrentUser = async () => {
    const response = await apiClient.GET('/api/auth/me');
    if (!response.data || response.error) {
      setCurrentUser(null);
      setUsers([]);
      return;
    }

    setCurrentUser(response.data);
    if (response.data.role === 'admin') {
      await loadUsers();
    } else {
      setUsers([]);
    }
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    const response = await apiClient.GET('/api/users');
    if (!response.data || response.error) {
      setUsers([]);
      setUsersLoading(false);
      return;
    }
    setUsers(response.data);
    setUsersLoading(false);
  };

  const openCreate = () => {
    setProductModalMode('create');
    setEditingProduct(null);
    setProductModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setProductModalMode('edit');
    setEditingProduct(product);
    setProductModalOpen(true);
  };

  const closeModal = () => {
    setProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id: string) => {
    const ok = window.confirm('Delete this product?');
    if (!ok) return;
    try {
      const response = await apiClient.DELETE('/api/products/{id}', {
        params: { path: { id } }
      });

      if (response.error) {
        showError('Недостаточно прав или ошибка удаления');
        return;
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      showError('Ошибка удаления товара');
    }
  };

  const handleProductSubmit = async (payload: Product) => {
    if (productModalMode === 'create') {
      const { data } = await apiClient.POST('/api/products', { body: payload });

      if (data)
        setProducts((prev) => [...prev, data]);
    } else {
      const { data } = await apiClient.PUT('/api/products/{id}', {
        params: { path: { id: payload.id! } },
        body: payload,
      });

      if (data)
        setProducts((prev) => prev.map((p) => (p.id === payload.id ? data : p)));
    }
    setProductModalOpen(false);
  };

  const handleLogout = () => {
    clearTokens();
    setProducts([]);
    setCurrentUser(null);
    setUsers([]);
  };

  const showError = (message: string) => {
    setErrorModalMessage(message);
    setErrorModalOpen(true);
  };

  const handleRoleChange = async (userId: string, role: UserRole) => {
    setUpdatingUserId(userId);
    const response = await apiClient.PATCH('/api/users/{id}/role', {
      params: { path: { id: userId } },
      body: { role },
    });

    if (!response.data || response.error) {
      setUpdatingUserId(null);
      showError('Не удалось обновить роль');
      return;
    }

    setUsers((prev) => prev.map((user) => (user.id === userId ? response.data! : user)));
    if (currentUser?.id === userId) {
      setCurrentUser(response.data);
    }
    setUpdatingUserId(null);
  };

  const handleUserDelete = async (userId: string) => {
    const ok = window.confirm('Удалить пользователя?');
    if (!ok) return;

    setDeletingUserId(userId);
    const response = await apiClient.DELETE('/api/users/{id}', {
      params: { path: { id: userId } },
    });

    if (response.error) {
      setDeletingUserId(null);
      showError('Не удалось удалить пользователя');
      return;
    }

    setUsers((prev) => prev.filter((user) => user.id !== userId));
    setDeletingUserId(null);
  };

  return (
    <div className="page">
      <header className="header">
        <div className="header__inner">
          <div className="brand">Products Store</div>
          <div className="header__right">
            {isAuthenticated() ? (
              <button className="btn btn--danger" onClick={handleLogout}>
                Выйти
              </button>
            ) : (
              <button className="btn btn--primary" onClick={() => setAuthModalOpen(true)}>
                Войти / Регистрация
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="toolbar">
            <h1 className="title">Products</h1>
            {isAuthenticated() && (
              <button className="btn btn--primary" onClick={openCreate}>
                + Добавить товар
              </button>
            )}
          </div>

          {!isAuthenticated() ? (
            <div className="empty" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p>Для работы с товарами необходимо войти в систему</p>
              <button className="btn btn--primary" onClick={() => setAuthModalOpen(true)}>
                Войти в аккаунт
              </button>
            </div>
          ) : loading ? (
            <div className="empty">Загрузка товаров...</div>
          ) : (
            <ProductsList
              products={products}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          )}

          {currentUser?.role === 'admin' && (
            <section className="usersPanel">
              <h2 className="title usersPanel__title">Управление пользователями</h2>
              {usersLoading ? (
                <div className="empty">Загрузка пользователей...</div>
              ) : !users.length ? (
                <div className="empty">Пользователи не найдены</div>
              ) : (
                <div className="list">
                  {users.map((user) => (
                    <div key={user.id} className="userRow">
                      <div className="userMeta">
                        <div className="userName">{user.first_name} {user.last_name}</div>
                        <div className="userEmail">{user.email}</div>
                      </div>
                      <div className="userActions">
                        <select
                          className="input userRoleSelect"
                          value={user.role ?? 'customer'}
                          disabled={updatingUserId === user.id || deletingUserId === user.id}
                          onChange={(e) => handleRoleChange(user.id!, e.target.value as UserRole)}
                        >
                          <option value="customer">customer</option>
                          <option value="seller">seller</option>
                          <option value="admin">admin</option>
                        </select>
                        <button
                          className="btn btn--danger"
                          disabled={deletingUserId === user.id || currentUser?.id === user.id}
                          onClick={() => handleUserDelete(user.id!)}
                        >
                          {deletingUserId === user.id ? 'Удаление...' : 'Удалить'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="footer__inner">
          © {new Date().getFullYear()} Products Store
        </div>
      </footer>
      <ProductModal
        open={productModalOpen}
        mode={productModalMode}
        initialProduct={editingProduct}
        onClose={closeModal}
        onSubmit={handleProductSubmit}
      />

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {errorModalOpen && (
        <div className="backdrop" onMouseDown={() => setErrorModalOpen(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <div className="modal__title">Ошибка</div>
              <button className="iconBtn" onClick={() => setErrorModalOpen(false)}>✕</button>
            </div>
            <div className="form">
              <div className="error" style={{ textAlign: 'left' }}>{errorModalMessage}</div>
            </div>
            <div className="modal__footer" style={{ padding: '12px' }}>
              <button className="btn btn--primary" onClick={() => setErrorModalOpen(false)}>Ок</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;