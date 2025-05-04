import { useState, FormEvent, useRef, useEffect } from 'react';
import { Check, XCircle } from 'lucide-react';
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

    // Clear error message when user types
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        if (errorMessage) setErrorMessage(null);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (errorMessage) setErrorMessage(null);
    };

    const { login, error, isAuthenticated, user } = useAuthStore();
    const { migrateGuestCart, setCurrentUserId } = useCartStore();

    useEffect(() => {
        if (isAuthenticated && user) {
            setSessionExpired(false);
            migrateGuestCart(user.id);
            setCurrentUserId(user.id);
        }
    }, [isAuthenticated, user, migrateGuestCart, setCurrentUserId]);

    const showSessionExpiredMessage = () => {
        setSessionExpired(true);
        setErrorMessage('Your session has expired. Please login again.');
    };

    useEffect(() => {
        // @ts-ignore
        window.showSessionExpiredMessage = showSessionExpiredMessage;
        return () => {
            // @ts-ignore
            delete window.showSessionExpiredMessage;
        };
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;
        setErrorMessage(null);
        setSuccessMessage(null);
        setIsSubmitting(true);

        try {
            const success = await login(username, password);
            if (success) {
                setSuccessMessage('Login successful! Redirecting...');
                setTimeout(() => {
                    modalRef.current?.close();
                    setUsername('');
                    setPassword('');
                    setSuccessMessage(null);
                }, 500);
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
                        type="button"
                        className="btn btn-sm btn-circle btn-ghost"
                        onClick={closeModal}
                        disabled={isSubmitting}
                    >
                        ✕
                    </button>
                </form>

                <h3 className="font-bold text-2xl mb-4 text-center">Sign In</h3>

                {successMessage ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Check className="w-16 h-16 text-success mb-4" strokeWidth={2.5} />
                        <p className="text-success text-lg font-medium">{successMessage}</p>
                    </div>
                ) : (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {errorMessage && (
                            <div className="alert alert-error text-error-content">
                                <XCircle className="w-5 h-5" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {sessionExpired && !errorMessage && (
                            <div className="alert alert-warning">
                                <span>Your session has expired. Please login again.</span>
                            </div>
                        )}

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="example@email.com"
                                className={`input input-bordered w-full ${errorMessage ? 'input-error' : ''}`}
                                required
                                value={username}
                                onChange={handleUsernameChange}
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
                                className={`input input-bordered w-full ${errorMessage ? 'input-error' : ''}`}
                                required
                                minLength={8}
                                value={password}
                                onChange={handlePasswordChange}
                                disabled={isSubmitting}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full flex items-center justify-center gap-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && (
                                <span className="loading loading-spinner loading-sm" />
                            )}
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                )}
            </div>
        </dialog>
    );
}
