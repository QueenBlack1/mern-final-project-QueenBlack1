import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const navigate = useNavigate();

  const toggleFeatureContent = (feature) => {
    setActiveFeature(activeFeature === feature ? null : feature);
  };

  const handleAppDownload = (e) => {
    e.preventDefault();
    // Handle app download logic
    alert('App download functionality would be implemented here!');
  };

  return (
    <div id="home-page" className="page-content active">
      <div className="welcome-section">
        <h1>Welcome to SignSmart!</h1>
        <p>Your journey to learning sign language starts here. SignSmart makes learning fun and interactive for everyone, from complete beginners to advanced learners.</p>
        <p>Explore our lessons, play educational games, browse our sign gallery, and get personalized feedback from our AI assistant.</p>
        
        {/* App Download Buttons */}
        <div className="app-download">
          <a href="#" className="app-btn" onClick={handleAppDownload}>
            <div className="app-icon">
              <i className="fab fa-google-play"></i>
            </div>
            <div className="app-text">
              <span>GET IT ON</span>
              <span>Google Play</span>
            </div>
          </a>
          <a href="#" className="app-btn" onClick={handleAppDownload}>
            <div className="app-icon">
              <i className="fab fa-apple"></i>
            </div>
            <div className="app-text">
              <span>Download on the</span>
              <span>App Store</span>
            </div>
          </a>
        </div>
        
        <div className="features-grid">
          <div className="feature-card" onClick={() => toggleFeatureContent('lessons')}>
            <div className="feature-icon">📚</div>
            <h3>Interactive Lessons</h3>
            <p>Learn at your own pace with our structured lessons for all skill levels.</p>
          </div>
          <div className="feature-card" onClick={() => toggleFeatureContent('games')}>
            <div className="feature-icon">🎮</div>
            <h3>Fun Games</h3>
            <p>Reinforce your learning with engaging sign language games.</p>
          </div>
          <div className="feature-card" onClick={() => toggleFeatureContent('ai')}>
            <div className="feature-icon">🤖</div>
            <h3>AI Assistant</h3>
            <p>Get real-time feedback on your signing with our SmartBot AI.</p>
          </div>
        </div>
        
        {/* Feature Content Sections */}
        {activeFeature && (
          <div className={`feature-content ${activeFeature ? 'active' : ''}`} id={`${activeFeature}-content`}>
            {/* Feature content will be dynamically shown based on activeFeature */}
            {activeFeature === 'lessons' && (
              <>
                <h3>Interactive Lessons</h3>
                <p>Our interactive lessons are designed to help you learn sign language step by step:</p>
                <ul>
                  <li>Beginner-friendly lessons starting with the alphabet and numbers</li>
                  <li>Progressive difficulty levels to match your learning pace</li>
                  <li>Real-time feedback on your signing accuracy</li>
                  <li>Visual demonstrations and detailed explanations</li>
                  <li>Track your progress with detailed statistics</li>
                </ul>
                <button className="btn-primary" onClick={() => navigate('/lessons')}>
                  Start Learning Now
                </button>
              </>
            )}
            
            {activeFeature === 'games' && (
              <>
                <h3>Fun Games</h3>
                <p>Learning sign language doesn't have to be boring! Our games make practice enjoyable:</p>
                <ul>
                  <li><strong>Sign Match:</strong> Match signs with their meanings in this memory card game</li>
                  <li><strong>Speed Signs:</strong> Test your reaction time by identifying signs quickly</li>
                  <li><strong>Sign Quiz:</strong> Answer multiple-choice questions about sign language</li>
                </ul>
                <button className="btn-primary" onClick={() => navigate('/games')}>
                  Play Games Now
                </button>
              </>
            )}
            
            {activeFeature === 'ai' && (
              <>
                <h3>AI Assistant</h3>
                <p>Our SmartBot AI assistant provides personalized guidance throughout your learning journey:</p>
                <ul>
                  <li>Real-time feedback on your hand positioning and movements</li>
                  <li>Personalized learning recommendations based on your progress</li>
                  <li>Answer questions about sign language anytime</li>
                </ul>
                <button className="btn-primary" onClick={() => document.getElementById('smartbot-toggle')?.click()}>
                  Try SmartBot Now
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;