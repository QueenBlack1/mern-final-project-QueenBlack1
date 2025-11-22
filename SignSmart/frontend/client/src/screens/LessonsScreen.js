import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const lessonsData = {
  beginner: {
    alphabet: [
      { name: 'Letter A', icon: 'A', description: 'Make a fist with your thumb resting against the side of your index finger' },
      { name: 'Letter B', icon: 'B', description: 'Hold your hand up with fingers together and thumb across palm' },
      { name: 'Letter C', icon: 'C', description: 'Form a C shape with your thumb and fingers' },
    ],
    numbers: [
      { name: 'Number 1', icon: '1', description: 'Hold up your index finger' },
      { name: 'Number 2', icon: '2', description: 'Hold up your index and middle fingers' },
      { name: 'Number 3', icon: '3', description: 'Hold up your index, middle, and ring fingers' },
    ]
  }
};

export default function LessonsScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [currentLevel, setCurrentLevel] = useState('beginner');
  const [currentLesson, setCurrentLesson] = useState('alphabet');
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const cameraRef = useRef(null);

  const currentSign = lessonsData[currentLevel][currentLesson][currentSignIndex];

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    return status === 'granted';
  };

  const toggleCamera = async () => {
    if (!cameraActive) {
      const hasPerm = await requestCameraPermission();
      if (hasPerm) {
        setCameraActive(true);
      } else {
        Alert.alert('Permission required', 'Camera access is required for lessons.');
      }
    } else {
      setCameraActive(false);
    }
  };

  const simulateDetection = () => {
    // Simulate AI detection with random accuracy
    const newAccuracy = Math.min(accuracy + Math.random() * 20, 95);
    setAccuracy(newAccuracy);

    if (newAccuracy > 80) {
      // Move to next sign after successful detection
      setTimeout(() => {
        const nextIndex = (currentSignIndex + 1) % lessonsData[currentLevel][currentLesson].length;
        setCurrentSignIndex(nextIndex);
        setAccuracy(0);
      }, 1500);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sign Language Lessons</Text>
      
      {/* Level Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Your Level</Text>
        <View style={styles.levelSelector}>
          {['beginner', 'intermediate', 'advanced', 'expert'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.levelButton,
                currentLevel === level && styles.levelButtonActive
              ]}
              onPress={() => setCurrentLevel(level)}
            >
              <Text style={[
                styles.levelButtonText,
                currentLevel === level && styles.levelButtonTextActive
              ]}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Lesson Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose a Lesson</Text>
        <View style={styles.lessonSelector}>
          {Object.keys(lessonsData[currentLevel] || {}).map((lesson) => (
            <TouchableOpacity
              key={lesson}
              style={[
                styles.lessonButton,
                currentLesson === lesson && styles.lessonButtonActive
              ]}
              onPress={() => {
                setCurrentLesson(lesson);
                setCurrentSignIndex(0);
                setAccuracy(0);
              }}
            >
              <Text style={[
                styles.lessonButtonText,
                currentLesson === lesson && styles.lessonButtonTextActive
              ]}>
                {lesson.charAt(0).toUpperCase() + lesson.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Camera and Lesson Area */}
      <View style={styles.lessonArea}>
        {/* Camera Preview */}
        <View style={styles.cameraContainer}>
          {cameraActive ? (
            <Camera style={styles.camera} ref={cameraRef}>
              <View style={styles.cameraOverlay}>
                <TouchableOpacity style={styles.cameraToggle} onPress={toggleCamera}>
                  <Ionicons name="camera-reverse" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </Camera>
          ) : (
            <View style={styles.cameraPlaceholder}>
              <Ionicons name="camera" size={50} color="#4A90E2" />
              <Text style={styles.cameraPlaceholderText}>
                Camera will activate when you start practicing
              </Text>
            </View>
          )}
        </View>

        {/* Current Sign */}
        <View style={styles.currentSign}>
          <View style={styles.signIcon}>
            <Text style={styles.signIconText}>{currentSign.icon}</Text>
          </View>
          <View style={styles.signInfo}>
            <Text style={styles.signName}>{currentSign.name}</Text>
            <Text style={styles.signDescription}>{currentSign.description}</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${accuracy}%` }]} />
          </View>
          <Text style={styles.progressText}>Accuracy: {Math.round(accuracy)}%</Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleCamera}>
            <Ionicons 
              name={cameraActive ? "camera-off" : "camera"} 
              size={24} 
              color="white" 
            />
            <Text style={styles.controlButtonText}>
              {cameraActive ? "Stop Camera" : "Start Camera"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlButton, styles.primaryButton]}
            onPress={simulateDetection}
            disabled={!cameraActive}
          >
            <Ionicons name="play" size={24} color="white" />
            <Text style={styles.controlButtonText}>Practice Sign</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tips */}
      <View style={styles.tipsSection}>
        <Text style={styles.tipsTitle}>Learning Tips</Text>
        {[
          'Ensure good lighting for clear hand visibility',
          'Keep your hands within the camera view',
          'Practice each sign multiple times',
          'Pay attention to finger positioning'
        ].map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <Ionicons name="bulb" size={20} color="#FFD700" />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3436',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: 10,
  },
  levelSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  levelButton: {
    flex: 1,
    minWidth: width * 0.4,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8A2BE2',
    alignItems: 'center',
  },
  levelButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  levelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8A2BE2',
  },
  levelButtonTextActive: {
    color: 'white',
  },
  lessonSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  lessonButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#8A2BE2',
  },
  lessonButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  lessonButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8A2BE2',
  },
  lessonButtonTextActive: {
    color: 'white',
  },
  lessonArea: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraContainer: {
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,
  },
  cameraToggle: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPlaceholderText: {
    marginTop: 10,
    color: '#666',
    textAlign: 'center',
  },
  currentSign: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.1)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
    borderStyle: 'dashed',
    marginBottom: 15,
  },
  signIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  signIconText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  signInfo: {
    flex: 1,
  },
  signName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 5,
  },
  signDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  controls: {
    flexDirection: 'row',
    gap: 10,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8A2BE2',
    padding: 15,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 15,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
});