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
            <div className="modal-box">
                <form method="dialog" onSubmit={(e) => e.preventDefault()}>
                    <button
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        onClick={closeModal}
                    >
                        ✕
                    </button>
                </form>

                <h3 className="font-bold text-lg mb-2">Sign In</h3>
                <p className="text-sm mb-4">Please login to your account</p>

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

                <form className="form-control w-full" onSubmit={handleSubmit}>
                    <fieldset className="border rounded-md p-4 mb-4">
                        <legend className="text-sm px-2">Account Information</legend>

                        <div className="form-control mb-3">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <label className="input input-bordered flex items-center gap-2">
                                <svg className="h-4 w-4 opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                    </g>
                                </svg>
                                <input
                                    type="email"
                                    className="grow"
                                    placeholder="example@email.com"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </label>
                        </div>

                        <div className="form-control mb-2">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <label className="input input-bordered flex items-center gap-2">
                                <svg className="h-4 w-4 opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path d="M16.5 10.5V6.5a4.5 4.5 0 1 0-9 0v4"></path>
                                        <rect width="18" height="12" x="3" y="10" rx="2"></rect>
                                    </g>
                                </svg>
                                <input
                                    type="password"
                                    className="grow"
                                    placeholder="Enter your password"
                                    required
                                    minLength={8}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </label>
                        </div>
                    </fieldset>

                    <button
                        className={`btn btn-primary w-full ${isSubmitting ? 'loading' : ''}`}
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </dialog>
    );
}