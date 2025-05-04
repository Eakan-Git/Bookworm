import { useState, FormEvent, useRef, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [sessionExpired, setSessionExpired] = useState(false);
    const modalRef = useRef<HTMLDialogElement>(null);

    const { login, error, isAuthenticated, user } = useAuthStore();
    const { migrateGuestCart, setCurrentUserId } = useCartStore();

    // Reset session expired state when user authenticates
    // and migrate guest cart to user cart
    useEffect(() => {
        if (isAuthenticated) {
            setSessionExpired(false);

            // Migrate guest cart to user cart when user logs in
            if (user) {
                migrateGuestCart(user.id);
                setCurrentUserId(user.id);
            }
        }
    }, [isAuthenticated, user, migrateGuestCart, setCurrentUserId]);

    // Function to show session expired message
    const showSessionExpiredMessage = () => {
        setSessionExpired(true);
        setErrorMessage('Your session has expired. Please login again.');
    };

    // Expose the function globally for the axios interceptor to use
    useEffect(() => {
        // @ts-ignore - Adding a property to window
        window.showSessionExpiredMessage = showSessionExpiredMessage;

        return () => {
            // @ts-ignore - Cleanup
            delete window.showSessionExpiredMessage;
        };
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);
        setIsSubmitting(true);

        try {
            const success = await login(username, password);
            if (success) {
                setSuccessMessage('Login successful! Redirecting...');
                // Close the modal after a short delay
                setTimeout(() => {
                    modalRef.current?.close();
                    // Reset form
                    setUsername('');
                    setPassword('');
                    setSuccessMessage(null);
                }, 1500);
            } else {
                setErrorMessage(error || 'Login failed. Please try again.');
            }
        } catch (err) {
            setErrorMessage('An unexpected error occurred. Please try again.');
            console.error('Login error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setUsername('');
        setPassword('');
        setErrorMessage(null);
        setSuccessMessage(null);
        setSessionExpired(false);
        modalRef.current?.close();
    };

    return (
        <dialog id="login-modal" className="modal" ref={modalRef}>
            <div className="modal-box w-full max-w-md">
                <form method="dialog" onSubmit={(e) => e.preventDefault()} className="flex justify-end">
                    <button
                        className="btn btn-sm btn-circle btn-ghost"
                        onClick={closeModal}
                    >
                        ✕
                    </button>
                </form>

                <h3 className="font-bold text-2xl mb-2">Sign In</h3>

                {errorMessage && (
                    <div className="alert alert-error mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{errorMessage}</span>
                    </div>
                )}

                {successMessage && (
                    <div className="alert alert-success mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{successMessage}</span>
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            placeholder="example@email.com"
                            className="input input-bordered w-full"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="input input-bordered w-full"
                            required
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full flex items-center justify-center gap-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && (
                            <span className="loading loading-spinner loading-sm"></span>
                        )}
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </button>

                </form>
            </div>
        </dialog>

    );
}