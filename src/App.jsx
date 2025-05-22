import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Calendar, Mic, MicOff, Volume2, VolumeX, TrendingUp, Heart, Target, Award, BookOpen, Palette, Sun, Moon, Cloud, Zap, Coffee, Music } from 'lucide-react';

// Enhanced prompt categories with more variety
const promptCategories = {
  emotional: [
    { text: "What emotion are you avoiding right now, and why?", credit: "Emotional Awareness", mood: "contemplative" },
    { text: "Describe a feeling you're having without judging it as good or bad.", credit: "Mindful Acceptance", mood: "calm" },
    { text: "What would you say to comfort a friend feeling exactly what you're feeling right now?", credit: "Self-Compassion", mood: "nurturing" },
    { text: "Write about a time when you felt completely safe and at peace.", credit: "Emotional Memory", mood: "peaceful" },
    { text: "What does your inner critic sound like? Now, what would your inner friend say instead?", credit: "Inner Voice Work", mood: "reflective" },
    { text: "If your current emotion had a color, shape, and texture, what would it be?", credit: "Emotion Visualization", mood: "creative" },
    { text: "What boundaries do you need to set to protect your emotional well-being?", credit: "Emotional Boundaries", mood: "empowering" },
    { text: "Describe a moment when you felt truly understood by someone.", credit: "Connection Memory", mood: "warm" }
  ],
  healing: [
    { text: "What part of this still needs more kindness?", credit: "Healing Focus", mood: "gentle" },
    { text: "Write a letter of forgiveness to yourself for something you've been carrying.", credit: "Self-Forgiveness", mood: "releasing" },
    { text: "What would healing look like for you today? Not tomorrow, not next year, but today.", credit: "Present Healing", mood: "hopeful" },
    { text: "Describe a wound that has become a source of wisdom or strength.", credit: "Post-Traumatic Growth", mood: "triumphant" },
    { text: "What permission do you need to give yourself to heal?", credit: "Healing Permission", mood: "liberating" },
    { text: "If your pain could speak, what would it want you to know?", credit: "Pain Dialogue", mood: "deep" },
    { text: "Write about someone who made you feel worthy of love exactly as you are.", credit: "Unconditional Love", mood: "loved" },
    { text: "What small act of healing can you offer yourself right now?", credit: "Micro-Healing", mood: "nurturing" }
  ],
  mindfulness: [
    { text: "Describe what you notice in your body right now, without changing anything.", credit: "Body Awareness", mood: "present" },
    { text: "What are five things you can see, four you can hear, three you can touch, two you can smell, and one you can taste?", credit: "5-4-3-2-1 Grounding", mood: "grounded" },
    { text: "Write about this moment as if you're experiencing it for the very first time.", credit: "Beginner's Mind", mood: "wonder" },
    { text: "What thoughts keep visiting your mind today? Welcome them like guests, then let them go.", credit: "Thought Observer", mood: "flowing" },
    { text: "Describe your breathing right now. Is it shallow or deep? Fast or slow? No judgment, just awareness.", credit: "Breath Awareness", mood: "centered" },
    { text: "What would you notice if you approached this day with gentle curiosity instead of judgment?", credit: "Curious Awareness", mood: "open" },
    { text: "Write about a simple pleasure you experienced today that you almost missed.", credit: "Present Moment Joy", mood: "grateful" },
    { text: "If you could send love to every part of yourself right now, where would you start?", credit: "Loving-Kindness", mood: "compassionate" }
  ],
  gratitude: [
    { text: "What are three things you're grateful for right now?", credit: "Daily Gratitude", mood: "thankful" },
    { text: "Write about someone who showed you unexpected kindness recently.", credit: "Kindness Recognition", mood: "warm" },
    { text: "What challenge are you grateful for because of how it helped you grow?", credit: "Growth Gratitude", mood: "appreciative" },
    { text: "Describe a part of your body you're grateful for and why.", credit: "Body Appreciation", mood: "accepting" },
    { text: "What small comfort brought you peace today?", credit: "Simple Comforts", mood: "content" },
    { text: "Write a thank you note to a part of yourself that's been working hard lately.", credit: "Self-Appreciation", mood: "loving" },
    { text: "What skill or ability do you have that you sometimes take for granted?", credit: "Ability Gratitude", mood: "proud" },
    { text: "Describe a moment today when you felt connected to something larger than yourself.", credit: "Connection Gratitude", mood: "connected" }
  ],
  selfCare: [
    { text: "How did you show kindness to yourself today?", credit: "Self-Kindness", mood: "gentle" },
    { text: "What does your soul need right now that you haven't been giving it?", credit: "Soul Needs", mood: "introspective" },
    { text: "If you treated yourself the way you treat your best friend, what would change?", credit: "Friend Treatment", mood: "compassionate" },
    { text: "What activity makes you lose track of time in the best way?", credit: "Flow State", mood: "joyful" },
    { text: "Write about a way you can nurture yourself that doesn't cost money.", credit: "Free Self-Care", mood: "resourceful" },
    { text: "What would 'good enough' look like today instead of perfect?", credit: "Perfectionism Release", mood: "accepting" },
    { text: "How can you make your environment more supportive of your well-being?", credit: "Environment Care", mood: "nurturing" },
    { text: "What's one habit you'd like to release and one you'd like to embrace?", credit: "Habit Reflection", mood: "intentional" }
  ],
  inspiration: [
    { text: "Hope is a good thing, maybe the best of things. – The Shawshank Redemption", credit: "The Shawshank Redemption", mood: "hopeful" },
    { text: "You are not the darkness you endured. You are the light that refused to surrender.", credit: "Unknown", mood: "triumphant" },
    { text: "There is no secret ingredient. It's just you. – Kung Fu Panda", credit: "Kung Fu Panda", mood: "empowering" },
    { text: "What would you tell your younger self today?", credit: "Wisdom Sharing", mood: "wise" },
    { text: "You have been assigned this mountain to show others it can be moved.", credit: "Purpose", mood: "determined" },
    { text: "What strength have you discovered within yourself that surprised you?", credit: "Hidden Strength", mood: "proud" },
    { text: "If you knew you couldn't fail, what would you try?", credit: "Fearless Exploration", mood: "bold" },
    { text: "How has your story given you wisdom that only you can share?", credit: "Unique Wisdom", mood: "meaningful" }
  ]
};

// Dynamic quotes database
const inspirationalQuotes = [
  { text: "The only way out is through.", author: "Robert Frost" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" },
  { text: "The wound is the place where the Light enters you.", author: "Rumi" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.", author: "Rumi" },
  { text: "The privilege of a lifetime is being who you are.", author: "Joseph Campbell" },
  { text: "What we plant in the soil of contemplation, we shall reap in the harvest of action.", author: "Meister Eckhart" }
];

// Themes configuration
const themes = {
  nordic: {
    name: "Nordic",
    primary: "#2C3E50",
    secondary: "#34495E",
    accent: "#3498DB",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    icon: <Sun className="w-4 h-4" />
  },
  ocean: {
    name: "Ocean",
    primary: "#1e3a8a",
    secondary: "#1e40af",
    accent: "#06b6d4",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    icon: <Cloud className="w-4 h-4" />
  },
  forest: {
    name: "Forest",
    primary: "#065f46",
    secondary: "#047857",
    accent: "#10b981",
    background: "linear-gradient(135deg, #134e4a 0%, #065f46 100%)",
    icon: <Coffee className="w-4 h-4" />
  },
  sunset: {
    name: "Sunset",
    primary: "#7c2d12", 
    secondary: "#9a3412",
    accent: "#f97316",
    background: "linear-gradient(135deg, #f97316 0%, #dc2626 100%)",
    icon: <Zap className="w-4 h-4" />
  }
};

// Mood options
const moodOptions = [
  { value: 'happy', label: '😊 Happy', color: '#FFD700' },
  { value: 'peaceful', label: '😌 Peaceful', color: '#87CEEB' },
  { value: 'anxious', label: '😰 Anxious', color: '#FFA500' },
  { value: 'sad', label: '😢 Sad', color: '#4682B4' },
  { value: 'excited', label: '🤗 Excited', color: '#FF69B4' },
  { value: 'grateful', label: '🙏 Grateful', color: '#32CD32' },
  { value: 'frustrated', label: '😤 Frustrated', color: '#FF6347' },
  { value: 'contemplative', label: '🤔 Contemplative', color: '#9370DB' },
  { value: 'energetic', label: '⚡ Energetic', color: '#FFD700' },
  { value: 'calm', label: '🧘 Calm', color: '#98FB98' }
];

// Affirmations
const affirmations = [
  "I am worthy of love and kindness.",
  "I trust in my ability to navigate life's challenges.",
  "I am growing stronger every day.",
  "My feelings are valid and important.",
  "I choose peace over worry.",
  "I am exactly where I need to be right now.",
  "I release what no longer serves me.",
  "I am capable of creating positive change in my life."
];

function NorthernJournal() {
  // State management
  const [currentEntry, setCurrentEntry] = useState('');
  const [entries, setEntries] = useState(() => {
    try {
      const saved = localStorage.getItem('journal_entries');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('nordic');
  const [currentMood, setCurrentMood] = useState(null);
  const [currentQuote, setCurrentQuote] = useState(inspirationalQuotes[0]);
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [showGratitude, setShowGratitude] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [notification, setNotification] = useState('');
  const [journalStreak, setJournalStreak] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [aiWhisper, setAiWhisper] = useState('');
  const [showAffirmations, setShowAffirmations] = useState(false);
  const [currentAffirmation, setCurrentAffirmation] = useState(affirmations[0]);
  const [gratitudeList, setGratitudeList] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [moodHistory, setMoodHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('mood_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Refs
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('journal_entries', JSON.stringify(entries));
    localStorage.setItem('mood_history', JSON.stringify(moodHistory));
  }, [entries, moodHistory]);

  // Calculate stats
  useEffect(() => {
    const words = entries.reduce((total, entry) => total + (entry.content?.split(/\s+/).length || 0), 0);
    setTotalWords(words);

    // Calculate streak
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const hasEntryToday = entries.some(entry => new Date(entry.date).toDateString() === today);
    const hasEntryYesterday = entries.some(entry => new Date(entry.date).toDateString() === yesterday);
    
    if (hasEntryToday) {
      setJournalStreak(prev => hasEntryYesterday ? prev + 1 : 1);
    }
  }, [entries]);

  // Rotate quotes every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const randomQuote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
      setCurrentQuote(randomQuote);
    }, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, []);

  // Generate AI whispers periodically
  useEffect(() => {
    const generateWhisper = () => {
      const whispers = [
        "What would your wisest self tell you right now?",
        "Notice the gentle rhythm of your breath...",
        "You are exactly where you need to be in this moment.",
        "What small act of kindness can you offer yourself today?",
        "Your thoughts are like clouds - they come and go.",
        "What are you grateful for in this very moment?",
        "Trust the process of your own unfolding.",
        "You have survived 100% of your difficult days so far."
      ];
      const randomWhisper = whispers[Math.floor(Math.random() * whispers.length)];
      setAiWhisper(randomWhisper);
    };

    generateWhisper();
    const interval = setInterval(generateWhisper, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Rotate affirmations
  useEffect(() => {
    const interval = setInterval(() => {
      const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
      setCurrentAffirmation(randomAffirmation);
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  // Show notification
  const showNotification = (message, duration = 3000) => {
    setNotification(message);
    setTimeout(() => setNotification(''), duration);
  };

  // Text-to-speech function
  const speakText = (text) => {
    if (synthRef.current && voiceEnabled) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    }
  };

  // Stop speech
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Voice recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentEntry(prev => prev + transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
        showNotification('Voice recognition error. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  // Toggle voice recording
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      showNotification('Voice recognition not supported in this browser.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // Generate random prompt
  const generatePrompt = (category = null) => {
    let prompts = [];
    if (category) {
      prompts = promptCategories[category] || [];
    } else {
      prompts = Object.values(promptCategories).flat();
    }
    
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(randomPrompt);
    
    if (voiceEnabled) {
      speakText(`Here's a prompt for you: ${randomPrompt.text}`);
    }
  };

  // Save entry
  const saveEntry = () => {
    if (!currentEntry.trim()) {
      showNotification('Please write something before saving!');
      return;
    }

    const entry = {
      id: Date.now(),
      content: currentEntry,
      date: new Date().toISOString(),
      prompt: currentPrompt,
      mood: currentMood,
      wordCount: currentEntry.trim().split(/\s+/).length,
      theme: selectedTheme
    };

    setEntries(prev => [entry, ...prev]);
    
    // Save mood if selected
    if (currentMood) {
      const moodEntry = {
        date: new Date().toISOString(),
        mood: currentMood,
        rating: moodOptions.find(m => m.value === currentMood)?.label || currentMood
      };
      setMoodHistory(prev => [moodEntry, ...prev]);
    }

    setCurrentEntry('');
    setCurrentPrompt(null);
    setCurrentMood(null);
    showNotification('Entry saved successfully! ✨');
    
    if (voiceEnabled) {
      speakText('Your journal entry has been saved successfully.');
    }
  };

  // Delete entry
  const deleteEntry = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setEntries(prev => prev.filter(entry => entry.id !== id));
      showNotification('Entry deleted.');
    }
  };

  // Add gratitude item
  const addGratitudeItem = (item) => {
    if (item.trim()) {
      const gratitudeEntry = {
        id: Date.now(),
        text: item,
        date: new Date().toISOString()
      };
      setGratitudeList(prev => [gratitudeEntry, ...prev]);
      showNotification('Added to gratitude list! 🙏');
    }
  };

  // Add goal
  const addGoal = (goal) => {
    if (goal.trim()) {
      const goalEntry = {
        id: Date.now(),
        text: goal,
        completed: false,
        date: new Date().toISOString()
      };
      setGoals(prev => [goalEntry, ...prev]);
      showNotification('Goal added! 🎯');
    }
  };

  // Toggle goal completion
  const toggleGoal = (id) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  // Filter entries based on search
  const filteredEntries = entries.filter(entry =>
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.prompt?.text?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div 
        className="min-h-screen backdrop-blur-sm"
        style={{ background: themes[selectedTheme]?.background }}
      >
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-light text-white mb-2">Northern Journal</h1>
                <p className="text-blue-200 italic">"Healing begins in silence."</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-sm text-blue-200">Streak</div>
                  <div className="text-2xl font-bold text-yellow-400">{journalStreak}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-blue-200">Words</div>
                  <div className="text-2xl font-bold text-green-400">{totalWords.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-black/10 backdrop-blur-md border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setShowHistory(false)}
                className={px-4 py-2 rounded-lg transition-all ${!showHistory ? 'bg-white/20 text-white' : 'bg-white/5 text-blue-200 hover:bg-white/10'}}
              >
                <BookOpen className="w-4 h-4 inline mr-2" />
                Journal
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className={px-4 py-2 rounded-lg transition-all ${showHistory ? 'bg-white/20 text-white' : 'bg-white/5 text-blue-200 hover:bg-white/10'}}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                History
              </button>
              <button
                onClick={() => setShowMoodTracker(!showMoodTracker)}
                className="px-4 py-2 bg-white/5 text-blue-200 rounded-lg hover:bg-white/10 transition-all"
              >
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Mood
              </button>
              <button
                onClick={() => setShowGratitude(!showGratitude)}
                className="px-4 py-2 bg-white/5 text-blue-200 rounded-lg hover:bg-white/10 transition-all"
              >
                <Heart className="w-4 h-4 inline mr-2" />
                Gratitude
              </button>
              <button
                onClick={() => setShowGoals(!showGoals)}
                className="px-4 py-2 bg-white/5 text-blue-200 rounded-lg hover:bg-white/10 transition-all"
              >
                <Target className="w-4 h-4 inline mr-2" />
                Goals
              </button>
              <button
                onClick={() => setShowAffirmations(!showAffirmations)}
                className="px-4 py-2 bg-white/5 text-blue-200 rounded-lg hover:bg-white/10 transition-all"
              >
                <Award className="w-4 h-4 inline mr-2" />
                Affirmations
              </button>
            </div>
          </div>
        </nav>

        {/* Theme Selector */}
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-2">
            <Palette className="w-4 h-4 text-blue-200" />
            <span className="text-sm text-blue-200 mr-2">Theme:</span>
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => setSelectedTheme(key)}
                className={px-3 py-1 rounded-full text-xs transition-all flex items-center gap-1 ${
                  selectedTheme === key ? 'bg-white/20 text-white' : 'bg-white/5 text-blue-200 hover:bg-white/10'
                }}
              >
                {theme.icon}
                {theme.name}
              </button>
            ))}
          </div>
        </div>

        {/* Voice Controls */}
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={px-3 py-1 rounded-lg text-sm transition-all flex items-center gap-2 ${
                voiceEnabled ? 'bg-green-500/20 text-green-300' : 'bg-white/5 text-blue-200 hover:bg-white/10'
              }}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              Voice {voiceEnabled ? 'On' : 'Off'}
            </button>
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-sm"
              >
                Stop Speaking
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-6">
          {/* Quote Display */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 mb-6 text-center border border-white/10">
            <p className="text-lg italic text-blue-100 mb-2">"{currentQuote.text}"</p>
            <p className="text-sm text-blue-300">— {currentQuote.author}</p>
          </div>

          {/* AI Whisper */}
          {aiWhisper && (
            <div className="bg-purple-500/10 backdrop-blur-md rounded-xl p-4 mb-6 text-center border border-purple-300/20">
              <p className="text-purple-200 italic">✨ {aiWhisper}</p>
            </div>
          )}

          {/* Affirmations Modal */}
          {showAffirmations && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4 text-center">Daily Affirmation</h3>
              <div className="text-center">
                <p className="text-lg text-blue-100 mb-4 italic">"{currentAffirmation}"</p>
                <button
                  onClick={() => {
                    const newAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
                    setCurrentAffirmation(newAffirmation);
                    if (voiceEnabled) speakText(newAffirmation);
                  }}
                  className="px-4 py-2 bg-purple-500/20 text-purple-200 rounded-lg hover:bg-purple-500/30 transition-all"
                >
                  New Affirmation
                </button>
              </div>
            </div>
          )}

          {/* Journal View */}
          {!showHistory && (
            <div className="space-y-6">
              {/* Current Prompt */}
              {currentPrompt && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
                  <p className="text-lg text-blue-100 mb-2 italic">"{currentPrompt.text}"</p>
                  <p className="text-sm text-blue-300">— {currentPrompt.credit}</p>
                  {voiceEnabled && (
                    <button
                      onClick={() => speakText(currentPrompt.text)}
                      className="mt-2 px-3 py-1 bg-blue-500/20 text-blue-200 rounded-lg hover:bg-blue-500/30 transition-all text-sm"
                    >
                      🔊 Listen
                    </button>
                  )}
                </div>
              )}

              {/* Mood Selector */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">How are you feeling?</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setCurrentMood(mood.value)}
                      className={p-3 rounded-lg text-sm transition-all ${
                        currentMood === mood.value 
                          ? 'bg-white/20 text-white scale-105' 
                          : 'bg-white/5 text-blue-200 hover:bg-white/10'
                      }}
                    >
                      {mood.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Writing Area */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Your Journal</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleRecording}
                      className={p-2 rounded-lg transition-all ${
                        isRecording 
                          ? 'bg-red-500/20 text-red-300 animate-pulse' 
                          : 'bg-white/5 text-blue-200 hover:bg-white/10'
                      }}
                      title={isRecording ? 'Stop Recording' : 'Start Voice Recording'}
                    >
                      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                    {voiceEnabled && currentEntry && (
                      <button
                        onClick={() => speakText(currentEntry)}
                        className="p-2 bg-white/5 text-blue-200 rounded-lg hover:bg-white/10 transition-all"
                        title="Read Entry Aloud"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                <textarea
                  ref={textareaRef}
                  value={currentEntry}
                  onChange={(e) => setCurrentEntry(e.target.value)}
                  placeholder="What's on your mind today? Let your thoughts flow..."
                  className="w-full h-64 p-4 bg-black/20 border border-white/10 rounded-lg resize-none text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                />
                
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-blue-300">
                    Words: {currentEntry.trim().split(/\s+/).filter(word => word.length > 0).length}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => generatePrompt()}
                      className="px-4 py-2 bg-blue-500/20 text-blue-200 rounded-lg hover:bg-blue-500/30 transition-all"
                    >
                      New Prompt
                    </button>
                    <button
                      onClick={saveEntry}
                      className="px-4 py-2 bg-green-500/20 text-green-200 rounded-lg hover:bg-green-500/30 transition-all"
                      disabled={!currentEntry.trim()}
                    >
                      Save Entry
                    </button>
                  </div>
                </div>
              </div>

              {/* Prompt Categories */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">Explore by Category</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.keys(promptCategories).map((category) => (
                    <button
                      key={category}
                      onClick={() => generatePrompt(category)}
                      className="p-3 bg-white/5 text-blue-200 rounded-lg hover:bg-white/10 transition-all text-sm capitalize"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* History View */}
          {showHistory && (
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">Journal History</h2>
                  <input
                    type="text"
                    placeholder="Search entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  />
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredEntries.length > 0 ? (
                    filteredEntries.map((entry) => (
                      <div key={entry.id} className="bg-white/5 rounded-lg p-4 border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-blue-300">
                            {new Date(entry.date).toLocaleDateString()} • {entry.wordCount} words
                            {entry.mood && <span className="ml-2">• {moodOptions.find(m => m.value === entry.mood)?.label}</span>}
                          </div>
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                        {entry.prompt && (
                          <div className="text-sm text-purple-300 italic mb-2">
                            Prompt: "{entry.prompt.text}"
                          </div>
                        )}
                        <p className="text-blue-100 line-clamp-3">
                          {entry.content.length > 200 ? entry.content.substring(0, 200) + '...' : entry.content}
                        </p>
                        {voiceEnabled && (
                          <button
                            onClick={() => speakText(entry.content)}
                            className="mt-2 px-3 py-1 bg-blue-500/20 text-blue-200 rounded-lg hover:bg-blue-500/30 transition-all text-sm"
                          >
                            🔊 Listen
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-blue-300 py-8">
                      {searchTerm ? 'No entries match your search.' : 'No journal entries yet. Start writing!'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mood Tracker */}
          {showMoodTracker && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10 mt-6">
              <h3 className="text-xl font-semibold mb-4">Mood Tracker</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-lg mb-2">Recent Moods</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {moodHistory.slice(0, 10).map((mood, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                          <span>{mood.rating}</span>
                          <span className="text-sm text-blue-300">{new Date(mood.date).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg mb-2">Mood Stats</h4>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-blue-300">Total mood entries:</span> {moodHistory.length}
                      </div>
                      <div className="text-sm">
                        <span className="text-blue-300">This week:</span> {moodHistory.filter(m => 
                          new Date(m.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        ).length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gratitude Section */}
          {showGratitude && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10 mt-6">
              <h3 className="text-xl font-semibold mb-4">Gratitude Journal</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="What are you grateful for today?"
                    className="flex-1 px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addGratitudeItem(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      addGratitudeItem(input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-green-500/20 text-green-200 rounded-lg hover:bg-green-500/30 transition-all"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {gratitudeList.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-blue-100">{item.text}</span>
                      <span className="text-sm text-blue-300">{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Goals Section */}
          {showGoals && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10 mt-6">
              <h3 className="text-xl font-semibold mb-4">Goals & Intentions</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Set a new goal or intention..."
                    className="flex-1 px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addGoal(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      addGoal(input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-blue-500/20 text-blue-200 rounded-lg hover:bg-blue-500/30 transition-all"
                  >
                    Add Goal
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {goals.map((goal) => (
                    <div key={goal.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <input
                        type="checkbox"
                        checked={goal.completed}
                        onChange={() => toggleGoal(goal.id)}
                        className="w-4 h-4 text-blue-600 bg-transparent border-2 border-blue-400 rounded focus:ring-blue-500"
                      />
                      <span className={flex-1 ${goal.completed ? 'line-through text-blue-400' : 'text-blue-100'}}>
                        {goal.text}
                      </span>
                      <span className="text-sm text-blue-300">{new Date(goal.date).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Insights Section */}
          {showInsights && entries.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10 mt-6">
              <h3 className="text-xl font-semibold mb-4">Your Journey Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg mb-2">Writing Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-300">Total Entries:</span>
                      <span>{entries.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-300">Average Words:</span>
                      <span>{Math.round(totalWords / entries.length)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-300">Current Streak:</span>
                      <span>{journalStreak} days</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg mb-2">Most Used Moods</h4>
                  <div className="space-y-1 text-sm">
                    {(() => {
                      const moodCounts = {};
                      entries.forEach(entry => {
                        if (entry.mood) {
                          moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
                        }
                      });
                      return Object.entries(moodCounts)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([mood, count]) => (
                          <div key={mood} className="flex justify-between">
                            <span className="text-blue-300">
                              {moodOptions.find(m => m.value === mood)?.label || mood}
                            </span>
                            <span>{count}</span>
                          </div>
                        ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Notification */}
        {notification && (
          <div className="fixed bottom-4 right-4 bg-green-500/20 text-green-200 px-6 py-3 rounded-lg border border-green-400/20 backdrop-blur-md">
            {notification}
          </div>
        )}

        {/* Footer */}
        <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 mt-12">
          <div className="max-w-6xl mx-auto px-4 py-6 text-center">
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <button
                onClick={() => setShowInsights(!showInsights)}
                className="px-4 py-2 bg-white/5 text-blue-200 rounded-lg hover:bg-white/10 transition-all text-sm"
              >
                View Insights
              </button>
              <button
                onClick={() => {
                  const dataStr = JSON.stringify({ entries, moodHistory, gratitudeList, goals }, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'northern-journal-backup.json';
                  link.click();
                  URL.revokeObjectURL(url);
                  showNotification('Data exported successfully!');
                }}
                className="px-4 py-2 bg-white/5 text-blue-200 rounded-lg hover:bg-white/10 transition-all text-sm"
              >
                Export Data
              </button>
              <button
                onClick={() => {
                  if (window.confirm('This will clear all your data. Are you sure?')) {
                    setEntries([]);
                    setMoodHistory([]);
                    setGratitudeList([]);
                    setGoals([]);
                    localStorage.clear();
                    showNotification('All data cleared.');
                  }
                }}
                className="px-4 py-2 bg-red-500/20 text-red-200 rounded-lg hover:bg-red-500/30 transition-all text-sm"
              >
                Clear All Data
              </button>
            </div>
            <p className="text-blue-300 text-sm">
              Built with ❤️ by Veenkoti Studios • "Let silence be your sanctuary"
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default NorthernJournal;