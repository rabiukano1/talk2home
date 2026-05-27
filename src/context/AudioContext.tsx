import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { NativeModules, Platform } from 'react-native';

interface AudioContextType {
  isMuted: boolean;
  isSpeaker: boolean;
  isMicActive: boolean;
  audioAvailable: boolean;
  permissionGranted: boolean | null;
  toggleMute: () => void;
  toggleSpeaker: () => void;
  startCallAudio: () => Promise<void>;
  stopCallAudio: () => Promise<void>;
}

const AudioCtx = createContext<AudioContextType | null>(null);

const AV = NativeModules.ExponentAV as {
  setAudioMode?: (mode: Record<string, unknown>) => Promise<void>;
  prepareAudioRecorder?: (options: Record<string, unknown>) => Promise<string>;
  startAudioRecording?: () => Promise<void>;
  stopAudioRecording?: () => Promise<string>;
  unloadAudioRecorder?: () => Promise<void>;
  requestPermissionsAsync?: () => Promise<{ granted: boolean }>;
  getPermissionsAsync?: () => Promise<{ granted: boolean }>;
} | undefined;

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const audioAvailable = !!AV?.setAudioMode;
  const cleanupRef = useRef<() => Promise<void>>();

  useEffect(() => {
    if (!AV?.requestPermissionsAsync) return;
    AV.getPermissionsAsync?.().then((r) => setPermissionGranted(r.granted));
  }, []);

  const startCallAudio = useCallback(async () => {
    if (!AV?.setAudioMode) return;
    try {
      await AV.setAudioMode({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        interruptionModeIOS: 2,
        interruptionModeAndroid: 2,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const perm = await AV.getPermissionsAsync!();
      if (!perm.granted) {
        const result = await AV.requestPermissionsAsync!();
        if (!result.granted) return;
      }

      if (AV.prepareAudioRecorder) {
        await AV.prepareAudioRecorder({
          android: {
            extension: '.m4a',
            outputFormat: 2,
            audioEncoder: 3,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          ios: {
            extension: '.caf',
            audioQuality: 1,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          isMeteringEnabled: true,
        });
        await AV.startAudioRecording!();
        setIsMicActive(true);
      }

      cleanupRef.current = async () => {
        try {
          if (AV.stopAudioRecording) {
            await AV.stopAudioRecording();
          }
        } catch { }
        try {
          if (AV.unloadAudioRecorder) {
            await AV.unloadAudioRecorder();
          }
        } catch { }
        setIsMicActive(false);
        setIsMuted(false);
      };
    } catch { }
  }, []);

  const stopCallAudio = useCallback(async () => {
    await cleanupRef.current?.();
    cleanupRef.current = undefined;
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const toggleSpeaker = useCallback(() => {
    setIsSpeaker(prev => {
      const next = !prev;
      AV?.setAudioMode?.({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        interruptionModeIOS: 2,
        interruptionModeAndroid: 2,
        shouldDuckAndroid: true,
        allowsRecordingIOS: true,
        playThroughEarpieceAndroid: Platform.OS === 'android' ? !next : false,
      });
      return next;
    });
  }, []);

  return (
    <AudioCtx.Provider value={{
      isMuted,
      isSpeaker,
      isMicActive,
      audioAvailable,
      permissionGranted,
      toggleMute,
      toggleSpeaker,
      startCallAudio,
      stopCallAudio,
    }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudio must be used within an AudioProvider');
  return ctx;
}
