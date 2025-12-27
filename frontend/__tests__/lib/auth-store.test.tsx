import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/lib/store/auth-store';

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store before each test
    const { logout } = useAuthStore.getState();
    logout();
  });

  it('initializes with no user', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('sets auth data correctly', () => {
    const { result } = renderHook(() => useAuthStore());
    
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'customer' as const,
    };
    const mockToken = 'test-token-123';

    act(() => {
      result.current.setAuth(mockUser, mockToken);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(mockToken);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('logs out user correctly', () => {
    const { result } = renderHook(() => useAuthStore());
    
    // First login
    act(() => {
      result.current.setAuth(
        { id: 1, name: 'Test', email: 'test@example.com', role: 'customer' },
        'token'
      );
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Then logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('supports different user roles', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.setAuth(
        { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' },
        'token'
      );
    });

    expect(result.current.user?.role).toBe('admin');
  });
});
