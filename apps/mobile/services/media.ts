import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';

export async function pickDocument() {
  const res = await DocumentPicker.getDocumentAsync({
    multiple: false,
    copyToCacheDirectory: true,
  });
  if (res.canceled) return null;
  const doc = res.assets?.[0];
  return doc || null;
}

export async function pickImageOrVideo() {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return null;
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    quality: 0.8,
  });
  if (res.canceled) return null;
  return res.assets?.[0] || null;
}

export async function recordVideo() {
  const camPerm = await ImagePicker.requestCameraPermissionsAsync();
  if (!camPerm.granted) return null;
  const res = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    videoMaxDuration: 60,
    quality: 0.8,
  });
  if (res.canceled) return null;
  return res.assets?.[0] || null;
}

export async function getCurrentLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;
  const loc = await Location.getCurrentPositionAsync({});
  return loc;
}

// Simple audio recording helpers
export async function prepareAudio() {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    interruptionModeIOS: InterruptionModeIOS.DoNotMix,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    playThroughEarpieceAndroid: false,
    staysActiveInBackground: false,
  });
}

export async function startAudioRecording() {
  const perm = await Audio.requestPermissionsAsync();
  if (!perm.granted) return null;
  await prepareAudio();
  const recording = new Audio.Recording();
  await recording.prepareToRecordAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY
  );
  await recording.startAsync();
  return recording;
}

export async function stopAudioRecording(recording: Audio.Recording) {
  try {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    return uri;
  } catch {
    return null;
  }
}
