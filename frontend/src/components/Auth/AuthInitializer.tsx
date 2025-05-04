import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { authService } from '@/api/authService';

/**
 * Component that initializes authentication state when the app loads
 * It attempts to refresh the access token using the HTTP-only refresh token cookie
 */
export default function AuthInitializer() {
  const [isInitializing, setIsInitializing] = useState(true);
  const { setAccessToken, user } = useAuthStore();
  const { migrateGuestCart, setCurrentUserId } = useCartStore();

  // Effect to handle user authentication state changes
  useEffect(() => {
    if (user) {
      // User logged in - migrate guest cart and set current user ID
      migrateGuestCart(user.id);
      setCurrentUserId(user.id);
    } else {
      // User logged out - set current user ID to null (guest mode)
      setCurrentUserId(null);
    }
  }, [user, migrateGuestCart, setCurrentUserId]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Attempt to refresh the token
        const response = await authService.refresh();
        const { access_token } = response.data;

        // Set the access token in the store
        setAccessToken(access_token);
        console.log('Authentication initialized successfully');
      } catch (error) {
        // If refresh fails, the user is not authenticated
        console.log('Not authenticated or refresh token expired');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [setAccessToken]);

  // This component doesn't render anything visible when initialization is complete
  if (!isInitializing) return null;

  // Show a loading indicator while initializing
  return (
    <div className="fixed inset-0 bg-base-100 bg-opacity-50 flex items-center justify-center z-50">
      <div className="loading loading-spinner loading-lg"></div>
    </div>
  );
}
