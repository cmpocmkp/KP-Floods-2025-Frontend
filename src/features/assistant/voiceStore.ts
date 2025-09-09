import { create } from 'zustand';

export type VAState = 'idle' | 'listening' | 'processing' | 'speaking';

interface VoiceAssistantStore {
  state: VAState;
  audioEl?: HTMLAudioElement | null;
  setState: (s: VAState) => void;
  setAudioEl: (a: HTMLAudioElement | null) => void;
  startListening: () => void;
  stopListening: () => void;
  startSpeaking: (srcOrText: string, isText?: boolean, options?: { voice?: number; language?: string; rate?: number; pitch?: number; volume?: number }) => Promise<void>;
  stopSpeaking: () => void;
}

export const useVoiceAssistant = create<VoiceAssistantStore>((set, get) => ({
  state: 'idle',
  audioEl: null,
  
  setState: (s) => set({ state: s }),
  setAudioEl: (a) => set({ audioEl: a }),
  
  startListening: () => {
    const { stopSpeaking } = get();
    stopSpeaking(); // hard rule: recording cancels speaking
    set({ state: 'listening' });
    // start WebAudio/MediaRecorder here...
  },
  
  stopListening: () => {
    // stop recorder safely...
    set({ state: 'processing' });
  },
  
  startSpeaking: async (srcOrText, isText = false, options?: { voice?: number; language?: string; rate?: number; pitch?: number; volume?: number }) => {
    const { stopSpeaking } = get();
    stopSpeaking(); // cancel any previous audio or TTS
    set({ state: 'speaking' });

    // If using Web Speech API:
    if (isText && 'speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(srcOrText);
      
      // Apply voice options
      if (options) {
        const voices = speechSynthesis.getVoices();
        if (options.voice !== undefined && voices[options.voice]) {
          u.voice = voices[options.voice];
        }
        if (options.language) u.lang = options.language;
        if (options.rate !== undefined) u.rate = options.rate;
        if (options.pitch !== undefined) u.pitch = options.pitch;
        if (options.volume !== undefined) u.volume = options.volume;
      }
      
      u.onend = () => set({ state: 'idle' });
      u.onerror = () => set({ state: 'idle' });
      window.speechSynthesis.speak(u);
      return;
    }

    // If using audio URL/stream:
    const a = new Audio(srcOrText);
    set({ audioEl: a });
    a.onended = () => set({ state: 'idle' });
    a.onerror = () => set({ state: 'idle' });
    try {
      await a.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      set({ state: 'idle' });
    }
  },
  
  stopSpeaking: () => {
    const { audioEl } = get();
    // Web Speech API
    if ('speechSynthesis' in window) { 
      window.speechSynthesis.cancel(); 
    }
    // HTMLAudio
    if (audioEl) { 
      try { 
        audioEl.pause(); 
        audioEl.currentTime = 0; 
      } catch (error) {
        console.error('Error stopping audio:', error);
      }
    }
    set({ audioEl: null, state: 'idle' });
  },
}));
