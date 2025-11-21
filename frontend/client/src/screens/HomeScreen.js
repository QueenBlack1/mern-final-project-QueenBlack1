import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [activeFeature, setActiveFeature] = useState(null);

  const features = [
    {
      id: 'lessons',
      icon: 'book',
      title: 'Interactive Lessons',
      description: 'Learn at your own pace with our structured lessons for all skill levels.',
      color: '#4A90E2'
    },
    {
      id: 'games',
      icon: 'game-controller',
      title: 'Fun Games',
      description: 'Reinforce your learning with engaging sign language games.',
      color: '#50C878'
    },
    {
      id: 'ai',
      icon: 'robot',
      title: 'AI Assistant',
      description: 'Get real-time feedback on your signing with our SmartBot AI.',
      color: '#8A2BE2'
    }
  ];

  const handleFeaturePress = (feature) => {
    if (activeFeature === feature.id) {
      setActiveFeature(null);
    } else {
      setActiveFeature(feature.id);
    }
  };

  const handleAppDownload = () => {
    Alert.alert('Download', 'App download links would open here!');
  };

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
    setActiveFeature(null);
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#4A90E2', '#8A2BE2']}
        style={styles.header}
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to SignSmart!</Text>
          <Text style={styles.welcomeText}>
            Your journey to learning sign language starts here. SignSmart makes learning fun and interactive for everyone.
          </Text>
          
          {user && (
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.avatar}</Text>
              </View>
              <Text style={styles.userName}>Hello, {user.name}!</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* App Download Buttons */}
        <View style={styles.appDownload}>
          <TouchableOpacity style={styles.appButton} onPress={handleAppDownload}>
            <Ionicons name="logo-google-playstore" size={24} color="white" />
            <View style={styles.appButtonText}>
              <Text style={styles.appButtonSubtext}>GET IT ON</Text>
              <Text style={styles.appButtonMainText}>Google Play</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.appButton} onPress={handleAppDownload}>
            <Ionicons name="logo-apple" size={24} color="white" />
            <View style={styles.appButtonText}>
              <Text style={styles.appButtonSubtext}>Download on the</Text>
              <Text style={styles.appButtonMainText}>App Store</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={[
                styles.featureCard,
                { borderColor: feature.color },
                activeFeature === feature.id && { borderColor: '#FFD700' }
              ]}
              onPress={() => handleFeaturePress(feature)}
            >
              <Ionicons name={feature.icon} size={40} color={feature.color} />
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Feature Content */}
        {activeFeature === 'lessons' && (
          <View style={styles.featureContent}>
            <Text style={styles.featureContentTitle}>Interactive Lessons</Text>
            <Text style={styles.featureContentText}>
              Our interactive lessons are designed to help you learn sign language step by step.
            </Text>
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={() => handleNavigation('Lessons')}
            >
              <Text style={styles.ctaButtonText}>Start Learning Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeFeature === 'games' && (
          <View style={styles.featureContent}>
            <Text style={styles.featureContentTitle}>Fun Games</Text>
            <Text style={styles.featureContentText}>
              Learning sign language doesn't have to be boring! Our games make practice enjoyable.
            </Text>
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={() => handleNavigation('Games')}
            >
              <Text style={styles.ctaButtonText}>Play Games Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeFeature === 'ai' && (
          <View style={styles.featureContent}>
            <Text style={styles.featureContentTitle}>AI Assistant</Text>
            <Text style={styles.featureContentText}>
              Our SmartBot AI assistant provides personalized guidance throughout your learning journey.
            </Text>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Try SmartBot Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  welcomeSection: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#2d3436',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userName: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  content: {
    padding: 20,
  },
  appDownload: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  appButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 15,
    borderRadius: 12,
    minWidth: width * 0.4,
  },
  appButtonText: {
    marginLeft: 10,
  },
  appButtonSubtext: {
    color: 'white',
    fontSize: 10,
    opacity: 0.8,
  },
  appButtonMainText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  featuresGrid: {
    marginBottom: 20,
  },
  featureCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
    marginTop: 10,
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  featureContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#50C878',
    borderStyle: 'dashed',
  },
  featureContentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 10,
  },
  featureContentText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginBottom: 15,
  },
  ctaButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});