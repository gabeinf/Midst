import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { theme } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function SignUpScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username: string): boolean => {
    // Must start with a letter
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    return usernameRegex.test(username);
  };

  const validatePassword = (password: string): boolean => {
    // Must contain at least one letter and one number
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasLetter && hasNumber && password.length >= 6;
  };

  const checkEmailAvailability = async (email: string): Promise<boolean> => {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      return signInMethods.length === 0;
    } catch (error) {
      console.log('Email check failed, allowing email:', error);
      // If check fails, allow the email
      return true;
    }
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty;
    } catch (error) {
      console.log('Username check failed, allowing username:', error);
      // If Firestore isn't set up or fails, allow the username
      return true;
    }
  };

  const nextStep = async () => {
    if (currentStep === 0) {
      if (!firstName || firstName.trim().length < 2) {
        Alert.alert('Error', 'Please enter your first name');
        return;
      }
    } else if (currentStep === 1) {
      if (!email) {
        Alert.alert('Error', 'Please enter your email');
        return;
      }
      if (!validateEmail(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }
      setLoading(true);
      try {
        const isAvailable = await checkEmailAvailability(email);
        setLoading(false);
        if (!isAvailable) {
          Alert.alert('Error', 'This email is already registered. Please log in instead.');
          return;
        }
      } catch (error) {
        setLoading(false);
        console.log('Email check error:', error);
        // Continue anyway if check fails
      }
    } else if (currentStep === 2) {
      if (!username) {
        Alert.alert('Error', 'Please enter a username');
        return;
      }
      if (!validateUsername(username)) {
        Alert.alert('Error', 'Username must start with a letter and contain only letters, numbers, and underscores');
        return;
      }
      setLoading(true);
      try {
        const isAvailable = await checkUsernameAvailability(username);
        setLoading(false);
        if (!isAvailable) {
          Alert.alert('Error', 'This username is already taken');
          return;
        }
      } catch (error) {
        setLoading(false);
        console.log('Username check error:', error);
        // Continue anyway if check fails
      }
    } else if (currentStep === 3) {
      if (!password) {
        Alert.alert('Error', 'Please enter a password');
        return;
      }
      if (!validatePassword(password)) {
        Alert.alert('Error', 'Password must be at least 6 characters and contain both letters and numbers');
        return;
      }
      await handleSignUp();
      return;
    }

    Animated.timing(slideAnim, {
      toValue: -(currentStep + 1) * width,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setCurrentStep(currentStep + 1);
  };

  const previousStep = () => {
    if (currentStep === 0) {
      router.back();
      return;
    }

    Animated.timing(slideAnim, {
      toValue: -(currentStep - 1) * width,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setCurrentStep(currentStep - 1);
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        username,
        email,
        firstName,
        createdAt: new Date().toISOString(),
      });

      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Sign Up Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: 'First Name', placeholder: 'First Name', value: firstName, setValue: setFirstName, keyboardType: 'default' as const },
    { label: 'Email', placeholder: 'Email Address', value: email, setValue: setEmail, keyboardType: 'email-address' as const },
    { label: 'Username', placeholder: 'Username', value: username, setValue: setUsername, keyboardType: 'default' as const },
    { label: 'Password', placeholder: 'Password', value: password, setValue: setPassword, keyboardType: 'default' as const, secure: true },
  ];

  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={require('../assets/onboarding/bruno-van-der-kraan-v2HgNzRDfII-unsplash.jpg')}
        style={styles.backgroundImage}
        imageStyle={styles.image}
        onLoadEnd={() => setImageLoaded(true)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.overlay}>
            {!imageLoaded && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </View>
            )}

            <View style={[styles.contentWrapper, !imageLoaded && styles.hidden]}>
              <Animated.View
                style={[
                  styles.stepsContainer,
                  { transform: [{ translateX: slideAnim }] },
                ]}
              >
                {steps.map((step, index) => (
                  <View key={index} style={styles.stepContent}>
                    <Text style={styles.title}>What's your {step.label.toLowerCase()}?</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={step.placeholder}
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={step.value}
                      onChangeText={step.setValue}
                      autoCapitalize="none"
                      keyboardType={step.keyboardType}
                      secureTextEntry={step.secure}
                      autoFocus={index === currentStep}
                    />
                  </View>
                ))}
              </Animated.View>

              <View style={styles.progressContainer}>
                {steps.map((_, dotIndex) => (
                  <View
                    key={dotIndex}
                    style={[
                      styles.progressDot,
                      dotIndex <= currentStep && styles.progressDotActive,
                    ]}
                  />
                ))}
              </View>
            </View>

            <View style={[styles.footer, !imageLoaded && styles.hidden]}>
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={nextStep}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Loading...' : currentStep === 3 ? 'Sign Up' : 'Next'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={previousStep}>
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
  },
  image: {
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hidden: {
    opacity: 0,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  stepsContainer: {
    flexDirection: 'row',
  },
  stepContent: {
    width,
    paddingHorizontal: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginTop: 30,
    paddingBottom: 20,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressDotActive: {
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: theme.colors.text,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: theme.colors.text,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  button: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  backText: {
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
  },
});
