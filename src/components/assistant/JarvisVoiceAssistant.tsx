import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, Bot, User, Loader2, Square } from 'lucide-react';
import { sendAssistantMessage } from '@/api/assistant';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useVoiceAssistant } from '@/features/assistant/voiceStore';

interface JarvisVoiceAssistantProps {
  contextData: any;
  onMessage?: (message: string, isUser: boolean) => void;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function JarvisVoiceAssistant({ contextData, onMessage }: JarvisVoiceAssistantProps) {
  // Voice state management
  const { state, startListening, stopListening, startSpeaking, stopSpeaking } = useVoiceAssistant();
  
  // Debug: Log context data when component mounts
  useEffect(() => {
    const parsedData = typeof contextData === 'string' ? JSON.parse(contextData) : contextData;
    console.log('JarvisVoiceAssistant - Context data received:', {
      hasData: !!contextData,
      dataType: typeof contextData,
      dataKeys: parsedData ? Object.keys(parsedData) : [],
      dataSize: contextData ? JSON.stringify(contextData).length : 0
    });
  }, [contextData]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm Jarvis, your voice assistant for KP Floods 2025 data. I can help you with questions about flood damage, infrastructure, agriculture, compensation, and recovery efforts. Press the orb or spacebar to start speaking.",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [selectedVoice, setSelectedVoice] = useState(0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [textInput, setTextInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const raysRef = useRef<HTMLDivElement>(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported');
      setSpeechSupported(false);
      addMessage('⚠️ Speech recognition is not supported in this browser. Please use Chrome or Edge for voice features.', 'assistant');
      return;
    }

    try {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        let errorMessage = 'Speech recognition error: ';
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not found. Please check your microphone.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please allow microphone access.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          case 'aborted':
            errorMessage = 'Speech recognition was aborted.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        addMessage('⚠️ ' + errorMessage, 'assistant');
      };

      recognitionRef.current.onresult = (event: any) => {
        console.log('Speech recognition result:', event);
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        console.log('Final transcript:', finalTranscript);
        console.log('Interim transcript:', interimTranscript);

        if (finalTranscript) {
          handleUserInput(finalTranscript.trim());
        }
      };

      recognitionRef.current.onnomatch = () => {
        console.log('No speech was recognized');
        addMessage('⚠️ No speech was recognized. Please try speaking more clearly.', 'assistant');
      };

    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      addMessage('⚠️ Failed to initialize speech recognition. Please refresh the page and try again.', 'assistant');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
    };
  }, [language]);

  // Initialize voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Initialize audio visualization
  useEffect(() => {
    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
        
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 512;
        source.connect(analyserRef.current);

        startAudioVisualization();
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    if (isListening) {
      initAudio();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isListening]);

  const startAudioVisualization = () => {
    if (!analyserRef.current || !raysRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const rays = raysRef.current.querySelectorAll('.ray');

    const updateVisualization = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate overall volume from low frequency bins
      let vol = 0;
      for (let i = 0; i < 20; i++) {
        vol += dataArray[i];
      }
      vol = vol / 20 / 255;

      // Update rays
      rays.forEach((ray, i) => {
        const index = Math.floor((i / rays.length) * dataArray.length);
        const height = (dataArray[index] / 255) * 42;
        (ray as HTMLElement).style.setProperty('--h', height + '%');
        (ray as HTMLElement).style.opacity = Math.max(0, vol * 1.2 - 0.05).toString();
      });

      animationFrameRef.current = requestAnimationFrame(updateVisualization);
    };

    updateVisualization();
  };

  const addMessage = (content: string, role: 'user' | 'assistant') => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
    onMessage?.(content, role === 'user');
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleUserInput = async (text: string) => {
    if (!text.trim()) return;

    addMessage(text, 'user');
    setIsProcessing(true);

    try {
      const parsedData = typeof contextData === 'string' ? JSON.parse(contextData) : contextData;
      console.log('Voice Assistant - Sending request:', {
        prompt: text,
        dataKeys: Object.keys(parsedData || {}),
        dataType: typeof contextData,
        model: 'gpt-4o-mini'
      });

      const response = await sendAssistantMessage({
        prompt: text,
        data: typeof contextData === 'string' ? JSON.parse(contextData) : contextData,
        model: 'gpt-4o-mini',
        max_tokens: 1000,
        temperature: 0.7
      });

      console.log('Voice Assistant - Received response:', response);

      if (response && response.success) {
        addMessage(response.response, 'assistant');
        speak(response.response);
      } else {
        console.error('Voice Assistant - API returned unsuccessful response:', response);
        addMessage('Sorry, I encountered an error processing your request. Please try again.', 'assistant');
      }
    } catch (error) {
      console.error('Voice Assistant - Error sending message:', error);
      
      // More detailed error handling
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          addMessage('⚠️ Network error. Please check your internet connection and try again.', 'assistant');
        } else if (error.message.includes('API Error')) {
          addMessage('⚠️ Server error. Please try again in a moment.', 'assistant');
        } else {
          addMessage(`⚠️ Error: ${error.message}`, 'assistant');
        }
      } else {
        addMessage('Sorry, I encountered an unexpected error. Please try again.', 'assistant');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = () => {
    if (!textInput.trim() || isProcessing) return;
    handleUserInput(textInput.trim());
    setTextInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  const speak = (text: string) => {
    if (!text || isMuted) return;
    startSpeaking(text, true, {
      voice: selectedVoice,
      language: language,
      rate: 1.02,
      pitch: 1.0,
      volume: 1
    });
  };

  const startListeningLocal = async () => {
    if (!recognitionRef.current) {
      addMessage('⚠️ Speech recognition not initialized. Please refresh the page.', 'assistant');
      return;
    }

    if (isListening) {
      console.log('Already listening');
      return;
    }

    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Update language if changed
      recognitionRef.current.lang = language;
      
      console.log('Starting speech recognition...');
      recognitionRef.current.start();
    } catch (error: any) {
      console.error('Error starting recognition:', error);
      setIsListening(false);
      
      if (error.name === 'NotAllowedError') {
        addMessage('⚠️ Microphone permission denied. Please allow microphone access and try again.', 'assistant');
      } else if (error.name === 'NotFoundError') {
        addMessage('⚠️ No microphone found. Please connect a microphone and try again.', 'assistant');
      } else {
        addMessage('⚠️ Failed to start speech recognition. Please try again.', 'assistant');
      }
    }
  };

  const stopListeningLocal = () => {
    if (recognitionRef.current && isListening) {
      try {
        console.log('Stopping speech recognition...');
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
        setIsListening(false);
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListeningLocal();
      stopListening();
    } else {
      startListening();
      startListeningLocal();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'Space') {
      event.preventDefault();
      toggleListening();
    } else if (event.key.toLowerCase() === 's') {
      event.preventDefault();
      stopSpeaking();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      stopListening();
    };
  }, [stopSpeaking, stopListening]);

  // Create rays for visualization
  const createRays = () => {
    const rays = [];
    for (let i = 0; i < 80; i++) {
      rays.push(
        <div
          key={i}
          className="ray"
          style={{
            transform: `translate(-50%, -50%) rotate(${(i / 80) * 360}deg)`
          }}
        />
      );
    }
    return rays;
  };

  return (
    <div className="jarvis-voice-assistant">
      <style>{`
        .jarvis-voice-assistant {
          --bg: #0b1324;
          --bg-soft: #0e1a33;
          --ring1: var(--brand-700) !important;
          --ring2: var(--brand-700) !important;
          --ring3: var(--brand-700) !important;
          --text: #e7f5ee;
          --muted: #9fb4c9;
          --card: #0f1a2f;
          --highlight: rgba(43,84,125,.22) !important;
        }

        .orb-wrap {
          display: grid;
          place-items: center;
          margin-bottom: 2rem;
        }

        .orb {
          --scale: 1;
          position: relative;
          width: min(56vw, 320px);
          height: min(56vw, 320px);
          min-width: 200px;
          min-height: 200px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          transition: transform 0.18s ease;
          transform: scale(var(--scale));
          cursor: pointer;
        }

        .orb::before {
          content: "";
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, var(--brand-700), var(--brand-500), var(--brand-700), var(--brand-500)) !important;
          filter: blur(24px);
          opacity: 0.85;
          animation: spin 6s linear infinite;
        }

        .orb::after {
          content: "";
          position: absolute;
          inset: 12px;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 60%, #0a1a2e 0%, #091426 50%, #070f1c 100%);
          border: 1px solid rgba(255,255,255,.05);
          box-shadow: inset 0 0 60px rgba(43,84,125,.08), inset 0 0 160px rgba(58,107,138,.08);
        }

        .ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          pointer-events: none;
        }

        .ring.r1 {
          border: 2px solid var(--brand-700) !important;
          filter: blur(0.5px);
        }

        .ring.r2 {
          inset: -22px;
          border: 2px solid var(--brand-600) !important;
        }

        .ring.r3 {
          inset: -38px;
          border: 2px solid var(--brand-500) !important;
        }

        .pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle, var(--brand-700), transparent 60%) !important;
          opacity: 0;
          animation: puff 2.4s ease-out infinite;
        }

        .pulse:nth-child(1) { animation-delay: 0s; }
        .pulse:nth-child(2) { animation-delay: 0.8s; }
        .pulse:nth-child(3) { animation-delay: 1.6s; }

        .core {
          position: relative;
          z-index: 2;
          text-align: center;
        }

        .glyph {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 30%, rgba(255,255,255,.15), rgba(255,255,255,.05) 60%, rgba(255,255,255,.02) 100%);
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.08);
          backdrop-filter: blur(2px);
        }

        .mic-svg {
          width: 36px;
          height: 36px;
          opacity: 0.9;
          filter: drop-shadow(0 4px 16px rgba(43,84,125,.25));
        }

        .state {
          margin-top: 8px;
          color: #9adfb8;
          font-weight: 700;
          letter-spacing: 0.3px;
          font-size: 14px;
        }

        .rays {
          position: absolute;
          inset: 8%;
          border-radius: 50%;
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .ray {
          --h: 20%;
          position: absolute;
          left: 50%;
          top: 50%;
          width: 2px;
          height: calc(16% + var(--h));
          transform-origin: 0 0;
          background: linear-gradient(180deg, transparent, var(--brand-700)) !important;
          opacity: 0;
        }

        .controls {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .control-btn {
          background: var(--brand-700);
          border: 1px solid var(--brand-600);
          color: white;
          border-radius: 8px;
          padding: 8px 12px;
          font-weight: 600;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s ease;
        }

        .control-btn:hover {
          background: var(--brand-600);
          border-color: var(--brand-500);
        }

        .control-btn.active {
          background: var(--brand-600);
          border-color: var(--brand-500);
        }

        .control-btn.danger {
          background: #dc2626;
          border-color: #b91c1c;
        }

        .control-btn.danger:hover {
          background: #b91c1c;
          border-color: #991b1b;
        }

        select {
          background: #0f1a2f;
          border: 1px solid #243a62;
          color: #d6e2f0;
          border-radius: 8px;
          padding: 8px 12px;
          outline: none;
          font-size: 12px;
        }

        .chat-panel {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          max-height: 400px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        .message {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .message-content {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 12px;
          position: relative;
        }

        .message.user .message-content {
          background: var(--brand-700);
          color: white;
        }

        .message.assistant .message-content {
          background: #f3f4f6;
          color: #374151;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .message.user .message-avatar {
          background: #6b7280;
        }

        .message.assistant .message-avatar {
          background: var(--brand-700);
        }

        .message-time {
          font-size: 12px;
          margin-top: 4px;
          opacity: 0.7;
        }

        .input-area {
          border-top: 1px solid #e5e7eb;
          padding: 16px;
          display: flex;
          gap: 8px;
        }

        .small {
          color: #6b7280;
          font-size: 12px;
          margin-top: 8px;
          text-align: center;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes puff {
          0% { opacity: 0; transform: scale(0.6); }
          60% { opacity: 0.25; }
          100% { opacity: 0; transform: scale(1.25); }
        }

        .listening .orb { --scale: 1.04; }
        .listening .glyph { box-shadow: 0 0 0 6px var(--brand-700) !important; }
        .talking .glyph { box-shadow: 0 0 0 6px var(--brand-700) !important; }
        
        .orb.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .orb.disabled::before {
          animation: none;
        }

        /* Force override for orb colors */
        .jarvis-voice-assistant .orb::before {
          background: conic-gradient(from 0deg, var(--brand-700), var(--brand-500), var(--brand-700), var(--brand-500)) !important;
        }
        
        .jarvis-voice-assistant .ring.r1 {
          border-color: var(--brand-700) !important;
        }
        
        .jarvis-voice-assistant .ring.r2 {
          border-color: var(--brand-600) !important;
        }
        
        .jarvis-voice-assistant .ring.r3 {
          border-color: var(--brand-500) !important;
        }
        
        .jarvis-voice-assistant .pulse {
          background: radial-gradient(circle, var(--brand-700), transparent 60%) !important;
        }
        
        .jarvis-voice-assistant .ray {
          background: linear-gradient(180deg, transparent, var(--brand-700)) !important;
        }
      `}</style>

      <div className={`${state === 'listening' ? 'listening' : ''} ${state === 'speaking' ? 'talking' : ''}`}>
        {/* Voice Orb */}
        <div className="orb-wrap">
          <div className={`orb ${!speechSupported ? 'disabled' : ''}`} onClick={speechSupported ? toggleListening : undefined}>
            <div className="ring r1"></div>
            <div className="ring r2"></div>
            <div className="ring r3"></div>

            <div className="pulse"></div>
            <div className="pulse"></div>
            <div className="pulse"></div>

            <div className="rays" ref={raysRef}>
              {createRays()}
            </div>

            <div className="core">
              <div className="glyph">
                {isListening ? (
                  <Mic className="mic-svg" />
                ) : (
                  <MicOff className="mic-svg" />
                )}
              </div>
              <div className="state">
                {state === 'listening' ? 'Listening...' : 
                 state === 'processing' ? 'Processing...' : 
                 state === 'speaking' ? 'Speaking...' : 'Idle'}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="ur-PK">Urdu (Pakistan)</option>
            <option value="hi-IN">Hindi (India)</option>
          </select>
          
          <select value={selectedVoice} onChange={(e) => setSelectedVoice(parseInt(e.target.value))}>
            {availableVoices.map((voice, index) => (
              <option key={index} value={index}>
                {voice.name} ({voice.lang}){voice.default ? ' — default' : ''}
              </option>
            ))}
          </select>

          <button 
            className={`control-btn ${isMuted ? 'active' : ''}`}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {state !== 'listening' ? (
            <button
              onClick={toggleListening}
              disabled={!speechSupported}
              className="control-btn"
              aria-pressed={false}
            >
              {!speechSupported ? 'Voice Not Supported' : 'Start Listening'}
            </button>
          ) : (
            <button
              onClick={toggleListening}
              className="control-btn danger"
              aria-pressed={true}
            >
              Stop Listening
            </button>
          )}

          {state === 'speaking' && (
            <button
              onClick={stopSpeaking}
              className="control-btn danger"
              aria-label="Stop speaking"
            >
              <Square size={16} /> Stop Speaking
            </button>
          )}

         
        </div>

        {/* Chat Panel */}
        <div className="chat-panel">
          <div className="messages-container">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.role}`}>
                <div className="message-avatar">
                  {message.role === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="message-content">
                  <div className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="message assistant">
                <div className="message-avatar">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="message-content">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="input-area">
            <Input
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or use voice..."
              disabled={isProcessing}
              className="flex-1"
            />
            <Button
              onClick={handleTextSubmit}
              disabled={!textInput.trim() || isProcessing}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="small">
            Tip: Press <strong>Space</strong> to start/stop listening, <strong>S</strong> to stop speaking. Jarvis speaks back using the selected voice.
          </div>
        </div>
      </div>
    </div>
  );
}
