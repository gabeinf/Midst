import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../constants/theme';

const backgroundImage = require('../assets/onboarding/bruno-van-der-kraan-v2HgNzRDfII-unsplash.jpg');

export default function WelcomeScreen() {
  const router = useRouter();
  const [imagePreloaded, setImagePreloaded] = useState(false);

  useEffect(() => {
    // Preload the image to cache it
    const preloadImage = async () => {
      try {
        await Image.prefetch(Image.resolveAssetSource(backgroundImage).uri);
        setImagePreloaded(true);
      } catch (error) {
        console.log('Image preload error:', error);
        // Continue anyway
        setImagePreloaded(true);
      }
    };

    preloadImage();
  }, []);

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>MIDST</Text>
          <Text style={styles.subtitle}>LIFE CONNECTED TO THE BODY</Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.signupButton]}
            onPress={() => router.push('/signup')}
          >
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 120,
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.text,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: theme.colors.text,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  button: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
  },
  signupButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
  },
  signupButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  loginButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
