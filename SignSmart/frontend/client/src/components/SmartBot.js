import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const smartBotResponses = {
  greeting: [
    "Hello! I'm SmartBot, your AI learning assistant. How can I help you today?",
    "Hi there! I'm here to help you learn sign language. What can I assist you with?",
  ],
  help: [
    "I can help you learn sign language, answer questions about lessons, or guide you through the app.",
  ],
  default: [
    "I'm not sure I understand. Can you try asking in a different way?",
  ]
};

export default function SmartBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm SmartBot, your AI learning assistant. How can I help you today?", isBot: true }
  ]);
  const [inputText, setInputText] = useState('');
  const slideAnim = useRef(new Animated.Value(300)).current;

  const toggleBot = () => {
    if (isOpen) {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsOpen(false));
    } else {
      setIsOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = { text: inputText, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Generate bot response
    setTimeout(() => {
      const response = generateBotResponse(inputText);
      const botMessage = { text: response, isBot: true };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const generateBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return smartBotResponses.greeting[0];
    } else if (lowerMessage.includes('help')) {
      return smartBotResponses.help[0];
    } else {
      return smartBotResponses.default[0];
    }
  };

  return (
    <>
      {isOpen && (
        <Animated.View 
          style={[
            styles.botContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.botHeader}>
            <View style={styles.botAvatar}>
              <Ionicons name="robot" size={24} color="#2d3436" />
            </View>
            <View>
              <Text style={styles.botTitle}>SmartBot</Text>
              <Text style={styles.botSubtitle}>AI Learning Assistant</Text>
            </View>
          </View>

          <ScrollView style={styles.messagesContainer}>
            {messages.map((message, index) => (
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  message.isBot ? styles.botMessage : styles.userMessage
                ]}
              >
                <Text style={[
                  styles.messageText,
                  message.isBot ? styles.botMessageText : styles.userMessageText
                ]}>
                  {message.text}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      <TouchableOpacity style={styles.botToggle} onPress={toggleBot}>
        <Ionicons name="robot" size={24} color="white" />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  botContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 350,
    height: 450,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  botHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    padding: 15,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  botTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  botSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderBottomLeftRadius: 4,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  botMessageText: {
    color: '#2d3436',
  },
  userMessageText: {
    color: '#2d3436',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 14,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botToggle: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: 'white',
  },
});