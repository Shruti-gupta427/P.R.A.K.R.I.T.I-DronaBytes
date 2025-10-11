var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const welcomeHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PRAKRITI - Team Welcome</title>
      <style>
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
          
          body {
              font-family: 'Courier New', monospace;
              background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow-y: auto;
              overflow-x: hidden;
              position: relative;
              padding: 20px 0;
          }
          
          body::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: 
                  radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                  radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
              animation: matrix 20s linear infinite;
          }
          
          @keyframes matrix {
              0% { transform: translateY(0px); }
              100% { transform: translateY(-100px); }
          }
          
          .container {
              text-align: center;
              background: rgba(0, 0, 0, 0.8);
              backdrop-filter: blur(15px);
              border-radius: 20px;
              padding: 40px 30px;
              box-shadow: 
                  0 8px 32px 0 rgba(0, 255, 255, 0.3),
                  0 0 0 1px rgba(255, 255, 255, 0.1),
                  inset 0 1px 0 rgba(255, 255, 255, 0.2);
              border: 2px solid transparent;
              background-clip: padding-box;
              max-width: 800px;
              width: 90%;
              margin: 20px auto;
              animation: slideIn 1s ease-out;
              position: relative;
              z-index: 1;
          }
          
          .container::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              border-radius: 20px;
              padding: 2px;
              background: linear-gradient(45deg, #00ffff, #ff00ff, #00ffff);
              mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
              mask-composite: subtract;
              animation: borderGlow 3s ease-in-out infinite;
          }
          
          @keyframes borderGlow {
              0%, 100% { opacity: 0.5; }
              50% { opacity: 1; }
          }
          
          @keyframes slideIn {
              from {
                  opacity: 0;
                  transform: translateY(50px);
              }
              to {
                  opacity: 1;
                  transform: translateY(0);
              }
          }
          
          .logo {
              font-size: 3rem;
              font-weight: bold;
              color: #00ffff;
              margin-bottom: 15px;
              text-shadow: 
                  0 0 10px #00ffff,
                  0 0 20px #00ffff,
                  0 0 30px #00ffff,
                  2px 2px 4px rgba(0,0,0,0.8);
              animation: pulse 2s infinite;
              font-family: 'Courier New', monospace;
              letter-spacing: 3px;
          }
          
          @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
          }
          
          .subtitle {
              font-size: 1rem;
              color: #ffffff;
              margin-bottom: 25px;
              animation: fadeInUp 1s ease-out 0.5s both;
              font-family: 'Courier New', monospace;
              letter-spacing: 1px;
              text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
              line-height: 1.4;
              padding: 0 10px;
          }
          
          @keyframes fadeInUp {
              from {
                  opacity: 0;
                  transform: translateY(30px);
              }
              to {
                  opacity: 1;
                  transform: translateY(0);
              }
          }
          
          .team-info {
              background: rgba(0, 0, 0, 0.6);
              border-radius: 15px;
              padding: 25px;
              margin: 25px 0;
              animation: fadeInUp 1s ease-out 1s both;
              border: 1px solid rgba(0, 255, 255, 0.3);
              box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
          }
          
          .team-name {
              font-size: 1.5rem;
              color: #ff00ff;
              margin-bottom: 12px;
              font-weight: bold;
              font-family: 'Courier New', monospace;
              text-shadow: 0 0 10px #ff00ff;
              letter-spacing: 2px;
          }
          
          .project-desc {
              font-size: 1rem;
              color: #ffffff;
              line-height: 1.5;
              margin-bottom: 15px;
              font-family: 'Courier New', monospace;
          }
          
          .features {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
              gap: 15px;
              margin: 25px 0;
              animation: fadeInUp 1s ease-out 1.5s both;
          }
          
          .feature {
              background: rgba(0, 0, 0, 0.7);
              padding: 15px;
              border-radius: 10px;
              transition: transform 0.3s ease;
              border: 1px solid rgba(255, 255, 255, 0.2);
              box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
          }
          
          .feature:hover {
              transform: translateY(-5px);
          }
          
          .feature-icon {
              font-size: 2rem;
              margin-bottom: 10px;
              color: #00ffff;
              text-shadow: 0 0 10px #00ffff;
          }
          
          .feature-title {
              font-size: 1.2rem;
              color: #ffffff;
              margin-bottom: 8px;
              font-weight: bold;
              font-family: 'Courier New', monospace;
              letter-spacing: 1px;
          }
          
          .feature-desc {
              font-size: 0.9rem;
              color: #ffffff;
              font-family: 'Courier New', monospace;
          }
          
          .status {
              background: linear-gradient(45deg, #00ffff, #ff00ff);
              color: #000000;
              padding: 15px 30px;
              border-radius: 25px;
              font-size: 1.1rem;
              font-weight: bold;
              margin: 20px 0;
              animation: fadeInUp 1s ease-out 2s both;
              display: inline-block;
              font-family: 'Courier New', monospace;
              text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
              box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
          }
          
          .floating-particles {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
              z-index: -1;
          }
          
          .particle {
              position: absolute;
              width: 2px;
              height: 2px;
              background: #00ffff;
              border-radius: 50%;
              animation: float 6s infinite linear;
              box-shadow: 0 0 6px #00ffff;
          }
          
          @keyframes float {
              0% {
                  transform: translateY(100vh) rotate(0deg);
                  opacity: 0;
              }
              10% {
                  opacity: 1;
              }
              90% {
                  opacity: 1;
              }
              100% {
                  transform: translateY(-100px) rotate(360deg);
                  opacity: 0;
              }
          }
          
          .tech-stack {
              margin: 25px 0;
              animation: fadeInUp 1s ease-out 2.5s both;
          }
          
          .tech-item {
              display: inline-block;
              background: rgba(0, 0, 0, 0.8);
              color: #00ffff;
              padding: 8px 16px;
              margin: 5px;
              border-radius: 20px;
              font-size: 0.9rem;
              transition: all 0.3s ease;
              border: 1px solid rgba(0, 255, 255, 0.3);
              font-family: 'Courier New', monospace;
              text-shadow: 0 0 5px #00ffff;
          }
          
          .tech-item:hover {
              background: rgba(0, 255, 255, 0.2);
              transform: scale(1.05);
              box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
          }
      </style>
  </head>
  <body>
      <div class="floating-particles" id="particles"></div>
      
      <div class="container">
          <div class="logo">PRAKRITI</div>
          <div class="subtitle">Planet Restoration & Knowledge through Real-world Interactive Tasks & Initiatives</div>
          
          <div class="team-info">
              <div class="team-name">DRONABYTES TEAM</div>
              <div class="project-desc">
                  Welcome to our Smart India Hackathon journey! We're building an innovative platform 
                  that combines gamification, AI, and environmental consciousness to create a sustainable future.
              </div>
          </div>
          
          <div class="features">
              <div class="feature">
                  <div class="feature-icon">[GAME]</div>
                  <div class="feature-title">Gamification</div>
                  <div class="feature-desc">XP, badges, leaderboards</div>
              </div>
              <div class="feature">
                  <div class="feature-icon">[AI]</div>
                  <div class="feature-title">AI Integration</div>
                  <div class="feature-desc">Smart verification & chatbot</div>
              </div>
              <div class="feature">
                  <div class="feature-icon">[MAP]</div>
                  <div class="feature-title">Eco-Map</div>
                  <div class="feature-desc">Interactive progress tracking</div>
              </div>
              <div class="feature">
                  <div class="feature-icon">[MOBILE]</div>
                  <div class="feature-title">Mobile Ready</div>
                  <div class="feature-desc">Responsive design</div>
              </div>
          </div>
          
          <div class="tech-stack">
              <div class="tech-item">React</div>
              <div class="tech-item">Node.js</div>
              <div class="tech-item">MongoDB</div>
              <div class="tech-item">Express</div>
              <div class="tech-item">AI/ML</div>
              <div class="tech-item">Socket.io</div>
          </div>
          
          <div class="status">
              [ONLINE] Backend Server Running Successfully!
          </div>
      </div>
      
      <script>
          // Create floating particles
          function createParticles() {
              const particlesContainer = document.getElementById('particles');
              const particleCount = 50;
              
              for (let i = 0; i < particleCount; i++) {
                  const particle = document.createElement('div');
                  particle.className = 'particle';
                  particle.style.left = Math.random() * 100 + '%';
                  particle.style.animationDelay = Math.random() * 6 + 's';
                  particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
                  particlesContainer.appendChild(particle);
              }
          }
          
          createParticles();
      </script>
  </body>
  </html>
  `;
  
  res.send(welcomeHTML);
});

module.exports = router;
