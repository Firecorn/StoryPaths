const MESSAGES = {
  'auth/email-already-in-use': 'There is already an account with that email. Try logging in instead.',
  'auth/invalid-email': 'That email address does not look right.',
  'auth/weak-password': 'Please choose a longer password (at least 8 characters).',
  'auth/missing-password': 'Please enter your password.',
  'auth/invalid-credential': 'The email or password is not correct.',
  'auth/wrong-password': 'The email or password is not correct.',
  'auth/user-not-found': 'The email or password is not correct.',
  'auth/too-many-requests': 'Too many tries. Please wait a few minutes and try again.',
  'auth/network-request-failed': 'No connection. Check your internet and try again.',
  'auth/requires-recent-login': 'For safety, please log out, log back in, and try again.',
  'auth/user-disabled': 'This account has been turned off. Please contact support.',
  'auth/operation-not-allowed': 'Changing email is not enabled yet. Please contact support.',
  'auth/missing-email': 'Please enter an email address.',
};

export const authMessage = (err) =>
  MESSAGES[err?.code] ?? 'Something went wrong. Please try again.';
