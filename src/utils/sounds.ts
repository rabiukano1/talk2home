import { NativeModules } from 'react-native';

let SoundModule: any = null;

if (NativeModules.ExponentAV) {
  try {
    SoundModule = require('expo-av');
  } catch {}
}

const audioAvailable = !!SoundModule;

function btoa(str: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let result = '';
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) bytes.push(str.charCodeAt(i));
  for (let i = 0; i < bytes.length; i += 3) {
    const b1 = bytes[i];
    const b2 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b3 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    result += chars[b1 >> 2];
    result += chars[((b1 & 3) << 4) | (b2 >> 4)];
    result += i + 1 < bytes.length ? chars[((b2 & 15) << 2) | (b3 >> 6)] : '=';
    result += i + 2 < bytes.length ? chars[b3 & 63] : '=';
  }
  return result;
}

function generateWav(
  durationMs: number,
  getSample: (t: number) => number,
  sampleRate = 44100,
): string {
  const numSamples = Math.floor(sampleRate * (durationMs / 1000));
  const numBytes = numSamples * 2;
  const buffer = new ArrayBuffer(44 + numBytes);
  const view = new DataView(buffer);

  const writeStr = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + numBytes, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, numBytes, true);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.max(-1, Math.min(1, getSample(t)));
    view.setInt16(offset, sample * 32767, true);
    offset += 2;
  }

  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return 'data:audio/wav;base64,' + btoa(binary);
}

const DTMF_TONES: Record<string, string> = {};
const FREQ: Record<string, [number, number]> = {
  '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
  '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
  '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
  '*': [941, 1209], '0': [941, 1336], '#': [941, 1477],
};

for (const [key, [f1, f2]] of Object.entries(FREQ)) {
  DTMF_TONES[key] = generateWav(150, (t) => {
    const envelope = t < 0.01 ? t / 0.01 : t > 0.14 ? (0.15 - t) / 0.01 : 1;
    return (Math.sin(2 * Math.PI * f1 * t) + Math.sin(2 * Math.PI * f2 * t)) * 0.4 * envelope;
  });
}

const RINGTONE = generateWav(2000, (t) => {
  const cadence = (t % 1) < 0.4 ? 1 : 0;
  return Math.sin(2 * Math.PI * 440 * t) * 0.5 * cadence;
});

const ENDTONE = generateWav(400, (t) => {
  const fade = t < 0.4 ? 1 : (1 - (t - 0.4) / 0.1);
  return Math.sin(2 * Math.PI * 520 * t) * 0.4 * Math.max(0, fade);
});

const activeSounds: Record<string, any> = {};

async function play(uri: string, volume = 0.5, loop = false): Promise<string | null> {
  if (!audioAvailable) return null;
  const id = 'snd_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  try {
    const { sound } = await SoundModule.Sound.createAsync(
      { uri },
      { shouldPlay: true, isLooping: loop, volume },
    );
    activeSounds[id] = sound;
    if (!loop) {
      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status?.didJustFinish) {
          sound.unloadAsync().catch(() => {});
          delete activeSounds[id];
        }
      });
    }
    return id;
  } catch {
    return null;
  }
}

export function playDTMF(key: string) {
  const uri = DTMF_TONES[key];
  if (!uri) return;
  play(uri, 0.6, false);
}

export function playRingtone(): Promise<string | null> {
  return play(RINGTONE, 0.4, true);
}

export function playEndTone(): Promise<string | null> {
  return play(ENDTONE, 0.5, false);
}

export async function stopSound(id: string | null) {
  if (!id) return;
  const sound = activeSounds[id];
  if (!sound) return;
  try {
    await sound.stopAsync();
    await sound.unloadAsync();
  } catch {}
  delete activeSounds[id];
}

export function cleanupAllSounds() {
  for (const id of Object.keys(activeSounds)) {
    const sound = activeSounds[id];
    try { sound.stopAsync(); sound.unloadAsync(); } catch {}
    delete activeSounds[id];
  }
}
