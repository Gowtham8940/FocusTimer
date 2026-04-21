import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

export const authService = {
  subscribe(listener: (user: FirebaseAuthTypes.User | null) => void) {
    return auth().onAuthStateChanged(listener);
  },
  async signInAnonymously() {
    const credential = await auth().signInAnonymously();
    return credential.user;
  },
  async signOut() {
    await auth().signOut();
  },
};
