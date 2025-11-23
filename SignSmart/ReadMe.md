# SignSmart - Interactive Sign Language Learning Platform

![SignSmart](https://img.shields.io/badge/SignSmart-MERN%20App-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-yellow)

## 🌟 Overview

SignSmart is a comprehensive MERN (MongoDB, Express.js, React, Node.js) application designed to make learning sign language accessible, interactive, and fun for everyone. Our platform combines cutting-edge AI technology with engaging learning methods to help users master sign language at their own pace.

<div align="center">

![SignSmart Demo]https://signsmart3.netlify.app/

</div>

## ✨ Key Features

### 🎯 Interactive Learning
- **Real-time AI Feedback**: Get instant feedback on your hand positioning and movements
- **Structured Lessons**: Progressive learning paths from beginner to expert levels
- **Multiple Learning Modes**: Alphabet, numbers, greetings, and everyday phrases

### 🎮 Educational Games
- **Sign Match**: Memory card game matching signs with meanings
- **Sign Quiz**: Multiple-choice questions to test your knowledge
- **Finger Spelling Challenge**: Practice spelling words using sign language letters

### 🤖 Smart AI Assistant
- **24/7 Learning Support**: Get answers to your sign language questions anytime
- **Personalized Guidance**: AI-powered recommendations based on your progress
- **Real-time Chat**: Interactive conversations with our SmartBot

### 📚 Comprehensive Resources
- **Sign Language Gallery**: Browse through an extensive collection of signs
- **3D Sign Demonstrations**: Interactive 3D hand models for better understanding
- **Detailed Instructions**: Step-by-step guides for each sign

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Modern web browser with camera access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/QueenBlack1/mern-final-project-QueenBlack1.git
   cd signsmart
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Configuration**

   Create `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/signsmart
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   AI_MODEL_PATH=./ai-models/hand-pose
   ```

   Create `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_AI_SERVICE_URL=http://localhost:5000/ai
   ```

4. **Run the application**
   ```bash
   # Start backend server (from backend directory)
   npm run dev

   # Start frontend development server (from frontend directory)
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🛠️ Technology Stack

### Frontend
- **React** - UI framework with hooks and context API
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **TensorFlow.js** - Hand pose detection and AI analysis
- **Three.js** - 3D sign demonstrations
- **Custom CSS** - Responsive design with CSS variables

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - Database for user data and progress tracking
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

### AI & Machine Learning
- **MediaPipe Hands** - Real-time hand tracking
- **Custom CNN Models** - Sign recognition and accuracy assessment
- **TensorFlow.js** - Browser-based inference

## 📁 Project Structure

```
signsmart/
├── backend/
│   ├── controllers/     # Route controllers
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── ai-models/      # Trained AI models
│   ├── config/         # Database and app configuration
│   └── server.js       # Express server setup
├── frontend/
│   ├── public/         # Static assets
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── context/    # State management
│   │   ├── utils/      # Utility functions
│   │   ├── services/   # API services
│   │   └── styles/     # CSS and styling
│   └── package.json
└── README.md
```

## 🎓 Learning Methodology

### Progressive Curriculum
1. **Beginner Level** - Alphabet, numbers, basic greetings
2. **Intermediate Level** - Common phrases, questions, everyday vocabulary
3. **Advanced Level** - Complex signs, sentence structure, conversations
4. **Expert Level** - Regional variations, specialized vocabulary

### Multi-Modal Learning
- **Visual Learning**: High-quality video demonstrations
- **Kinesthetic Learning**: Real-time practice with feedback
- **Gamification**: Educational games for reinforcement
- **Social Learning**: Community features and progress sharing

## 🔧 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | User logout |

### Lessons
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lessons` | Get all lessons |
| GET | `/api/lessons/:level` | Get lessons by level |
| POST | `/api/lessons/progress` | Update lesson progress |
| GET | `/api/lessons/stats/:userId` | Get user learning statistics |

### AI Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/analyze-sign` | Analyze user's sign accuracy |
| GET | `/api/ai/feedback/:signId` | Get detailed feedback for a sign |

### Games
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/games/memory` | Get memory game data |
| POST | `/api/games/score` | Save game scores |
| GET | `/api/games/leaderboard` | Get game leaderboards |

## 🤖 AI Integration

### Hand Pose Detection
- Real-time hand landmark detection using MediaPipe
- 21 key points per hand for precise tracking
- Browser-based processing for low latency

### Sign Recognition
- Custom-trained CNN models for sign classification
- Accuracy scoring based on hand positioning
- Adaptive learning based on user performance

### SmartBot AI Assistant
- NLP-powered chat interface
- Context-aware responses
- Learning recommendations

## 📱 Mobile Responsiveness

SignSmart is fully responsive and works seamlessly across:
- 📱 Mobile devices (iOS & Android)
- 💻 Tablets and laptops
- 🖥️ Desktop computers

## 🔒 Privacy & Security

- End-to-end data encryption
- Secure user authentication with JWT
- Camera access with user consent
- GDPR-compliant data handling
- Regular security audits

## 🚀 Deployment

### Production Build
```bash
# Build frontend for production
cd frontend
npm run build

# Start production server
cd ../backend
npm start
```

### Deployment Options
- **Heroku**: One-click deployment
- **AWS EC2**: Scalable cloud deployment
- **Docker**: Containerized deployment
- **Netlify**: Frontend hosting with serverless functions

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@signsmart.com
- 🐛 [Issue Tracker](https://github.com/QueenBlack1/signsmart/issues)
- 📚 [Documentation](https://docs.signsmart.com)
- 💬 [Community Discord](https://discord.gg/signsmart)

## 🙏 Acknowledgments

- Deaf community consultants for sign validation
- MediaPipe team for hand pose detection models
- TensorFlow.js team for browser ML capabilities
- Our amazing beta testers and contributors

## 📞 Contact

**SignSmart Team**
- Website: https://signsmart3.netlify.app/
- Email: hello@signsmart.com
- Twitter: [@SignSmartApp](https://twitter.com/SignSmartApp)

---

<div align="center">

**Made with ❤️ and 🤟 for the Deaf and hearing communities**

*Breaking communication barriers one sign at a time*

</div>
