import moment from 'moment';

export const convertFirestoreTimestampToMoment = (timestamp: { seconds: number; nanoseconds: number }) => {
  const milliseconds = timestamp.seconds * 1000;
  const nanosecondsToMilliseconds = timestamp.nanoseconds / 1000000;
  const momentDate = moment(milliseconds + nanosecondsToMilliseconds);
  return momentDate.toDate();
};

export const getFirebaseErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email address is already in use.';
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    case 'auth/weak-password':
      return 'The password is too weak.';
    case 'auth/user-not-found':
      return 'No user found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/invalid-credential':
      return 'Invalid credentials.';
    case 'auth/too-many-requests':
      return 'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};
