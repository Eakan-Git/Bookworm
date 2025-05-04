/**
 * Shows the login modal
 */
export const showLoginModal = () => {
  const loginModal = document.getElementById('login-modal') as HTMLDialogElement;
  if (loginModal) {
    loginModal.showModal();
  }
};

/**
 * Closes the login modal
 */
export const closeLoginModal = () => {
  const loginModal = document.getElementById('login-modal') as HTMLDialogElement;
  if (loginModal) {
    loginModal.close();
  }
};
