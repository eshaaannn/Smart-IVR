# Smart IVR Frontend

A beautiful, production-ready React frontend for the Multilingual "Speak-Your-Issue" IVR Routing system.

## 🎯 Features

- **Voice Recording** - Record issues using your microphone
- **Text Input Fallback** - Type your issue if voice recording isn't available
- **Real-time Processing** - Visual progress tracking of AI analysis
- **High Confidence Display** - See how confident the AI is in its diagnosis
- **Manual Selection** - Manually select issue category if AI misunderstands
- **Demo Mode** - Works perfectly without backend for demos
- **Beautiful UI** - Premium design with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Navigate to frontend directory
cd Smart-IVR/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🎨 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── shared/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── StepIndicator.jsx
│   │   └── VoiceRecorder.jsx
│   ├── layouts/
│   │   └── AppLayout.jsx
│   ├── pages/
│   │   ├── VoiceInputPage.jsx
│   │   ├── ProcessingPage.jsx
│   │   ├── ResultsPage.jsx
│   │   └── ManualSelectionPage.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── audioService.js
│   ├── utils/
│   │   └── constants.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── package.json
└── README.md
```

## 📝 Configuration

Edit `.env` file:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8000

# Demo mode (true = works without backend, false = requires backend)
VITE_DEMO_MODE=true
```

## 🎬 User Flow

1. **Voice Input** - User records voice or types issue
2. **Processing** - AI analyzes language, transcribes speech, classifies issue
3. **Results** - Display transcript, category, routing destination, and confidence
4. **Action** - User confirms or manually selects correct category

## 🔌 Backend Integration

To connect to your FastAPI backend:

1. Make sure backend is running at `http://localhost:8000`
2. Set `VITE_DEMO_MODE=false` in `.env`
3. Restart the frontend

The frontend will call:
- `POST /process-issue` with `{"audio_url": "..."}`

## 🎯 Demo Mode

**Perfect for hackathon demos!**

When `VITE_DEMO_MODE=true`:
- ✅ No backend required
- ✅ Uses mock API responses
- ✅ Simulates realistic processing time
- ✅ Random high/low confidence scenarios
- ✅ Never crashes

## 🎨 Design System

### Colors
- **Primary**: Indigo/Purple (`#5B5FEF`)
- **Success**: Green (`#10B981`)
- **Neutral**: Gray scale

### Typography
- Font: Inter (Google Fonts)
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Components
- All buttons have hover/tap animations (Framer Motion)
- Cards have fade-in animations
- Progress bars animate smoothly
- Microphone has multi-ring pulsing effect

## 🛠️ Tech Stack

- **React** 18 (JavaScript only, no TypeScript)
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - API calls

## 📦 Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

## 🐛 Troubleshooting

### Microphone not working
- Grant microphone permissions in browser
- Try using text input instead
- Check browser console for errors

### API errors
- Enable demo mode: `VITE_DEMO_MODE=true`
- Check backend is running at correct URL
- Verify CORS is configured on backend

### Build errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📱 Responsive Design

The app is fully responsive:
- Mobile: Optimized for 375px+ width
- Tablet: Optimized for 768px+ width
- Desktop: Max width 896px (centered)

## 🎓 Development Tips

### Adding new issue categories
Edit `src/utils/constants.js`:
```javascript
export const MANUAL_CATEGORIES = [
  // Add your category here
];
```

### Changing colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: { ... },
  // Add custom colors
}
```

## 🚀 Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 📄 License

Built for IIIT Nagpur Hackathon 2026

## 👨‍💻 Author

Frontend Developer - Team Smart IVR

---

**Happy Hacking! 🚀**
