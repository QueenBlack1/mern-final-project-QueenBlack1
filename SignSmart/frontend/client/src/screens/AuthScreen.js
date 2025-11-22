import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    ageGroup: 'adult'
  });
  const { signIn, signUp } = useAuth();

  const handleSubmit = async () => {
    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      
      const result = await signUp(formData);
      if (!result.success) {
        Alert.alert('Error', result.error);
      }
    } else {
      const result = await signIn(formData.email, formData.password);
      if (!result.success) {
        Alert.alert('Error', result.error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#4A90E2', '#8A2BE2']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🤟</Text>
            <Text style={styles.appName}>SignSmart</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>
              {isSignUp ? 'Join SignSmart! 🎯' : 'Welcome Back! 🎉'}
            </Text>
            <Text style={styles.subtitle}>
              {isSignUp ? 'Create an account to track your progress' : 'Sign in to continue your journey'}
            </Text>

            {isSignUp && (
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholderTextColor="#999"
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry
              placeholderTextColor="#999"
            />

            {isSignUp && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                  secureTextEntry
                  placeholderTextColor="#999"
                />

                <View style={styles.pickerContainer}>
                  <Text style={styles.pickerLabel}>Age Group</Text>
                  <View style={styles.ageGroupButtons}>
                    {['child', 'teen', 'adult'].map((group) => (
                      <TouchableOpacity
                        key={group}
                        style={[
                          styles.ageButton,
                          formData.ageGroup === group && styles.ageButtonActive
                        ]}
                        onPress={() => setFormData({ ...formData, ageGroup: group })}
                      >
                        <Text style={[
                          styles.ageButtonText,
                          formData.ageGroup === group && styles.ageButtonTextActive
                        ]}>
                          {group.charAt(0).toUpperCase() + group.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            )}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setIsSignUp(!isSignUp)}
            >
              <Text style={styles.toggleButtonText}>
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 80,
    marginBottom: 10,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    color: '#2d3436',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: 10,
  },
  ageGroupButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ageButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  ageButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  ageButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  ageButtonTextActive: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleButton: {
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '500',
  },
});