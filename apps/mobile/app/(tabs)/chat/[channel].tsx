import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Bell, AlertTriangle } from 'lucide-react-native';
import MessageComposer from '@/components/MessageComposer';
import EmojiPickerModal from '@/components/EmojiPickerModal';
import PhoneCallModal from '@/components/PhoneCallModal';
import { useChatStore } from '@/store/chatStore';
import {
  pickDocument,
  pickImageOrVideo,
  recordVideo,
  getCurrentLocation,
  startAudioRecording,
  stopAudioRecording,
} from '@/services/media';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: string;
  isOwn: boolean;
}

export default function ChatChannelScreen() {
  const { channel } = useLocalSearchParams();
  const router = useRouter();
  const { channels, toggleDoorStatus } = useChatStore();
  const [message, setMessage] = useState('');
  const [emojiVisible, setEmojiVisible] = useState(false);
  const [callVisible, setCallVisible] = useState(false);
  
  // Find current channel data
  const currentChannel = channels.find(ch => ch.id === channel);
  const isPickupDeliveryChannel = currentChannel?.type === 'inbound' || currentChannel?.type === 'outbound';
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Welcome to the ${channel} channel!`,
      timestamp: '10:30 AM',
      sender: 'System',
      isOwn: false,
    },
    {
      id: '2',
      text: 'Ready to coordinate logistics and deliveries!',
      timestamp: '10:31 AM',
      sender: 'Dispatcher',
      isOwn: false,
    },
  ]);
  const [recording, setRecording] = useState<any>(null);

  // Handle door button press
  const handleDoorPress = () => {
    if (!currentChannel?.doorNumber) return;
    
    const currentStatus = currentChannel.doorStatus || 'green';
    const newStatus = currentStatus === 'green' ? 'red' : 'green';
    
    const statusText = newStatus === 'red' ? 'loading/unloading' : 'available';
    Alert.alert(
      'Door Status',
      `Changing door ${currentChannel.doorNumber} to ${statusText}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            toggleDoorStatus(currentChannel.id);
            if (newStatus === 'green') {
              // Show document attachment option when completing
              Alert.alert(
                'Trip Complete',
                'Would you like to attach documents for this trip?',
                [
                  { text: 'Later', style: 'cancel' },
                  { text: 'Attach Documents', onPress: handleAttachDoc }
                ]
              );
            }
          }
        }
      ]
    );
  };

  // Handle alarm press
  const handleAlarmPress = () => {
    Alert.alert(
      'Shipping Office Alert',
      'You are ready to go! The shipping office has been notified.',
      [{ text: 'OK' }]
    );
  };

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        sender: 'You',
        isOwn: true,
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isOwn ? styles.ownMessage : styles.otherMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.isOwn ? styles.ownBubble : styles.otherBubble,
        ]}
      >
        {!item.isOwn && <Text style={styles.senderName}>{item.sender}</Text>}
        <Text
          style={[
            styles.messageText,
            item.isOwn ? styles.ownText : styles.otherText,
          ]}
        >
          {item.text}
        </Text>
        <Text
          style={[
            styles.timestamp,
            item.isOwn ? styles.ownTimestamp : styles.otherTimestamp,
          ]}
        >
          {item.timestamp}
        </Text>
      </View>
    </View>
  );

  // Handlers for toolbar
  const handleAttachDoc = async () => {
    const doc = await pickDocument();
    if (doc) {
      setMessages((m) => [
        ...m,
        {
          id: Date.now().toString(),
          text: `Attached: ${doc.name || 'file'}`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          sender: 'You',
          isOwn: true,
        },
      ]);
    }
  };

  const handleESign = () => {
    // Navigate to signature screen
    router.push('/e-sign');
  };

  const handleStartCall = () => setCallVisible(true);

  const handleShareLocation = async () => {
    const loc = await getCurrentLocation();
    if (loc) {
      const { latitude, longitude } = loc.coords;
      setMessages((m) => [
        ...m,
        {
          id: Date.now().toString(),
          text: `Location: https://maps.google.com/?q=${latitude},${longitude}`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          sender: 'You',
          isOwn: true,
        },
      ]);
    }
  };

  const handlePickMedia = async () => {
    const asset = await pickImageOrVideo();
    if (asset) {
      setMessages((m) => [
        ...m,
        {
          id: Date.now().toString(),
          text: `Shared media: ${asset.fileName || asset.uri}`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          sender: 'You',
          isOwn: true,
        },
      ]);
    }
  };

  const handleRecordVideo = async () => {
    const asset = await recordVideo();
    if (asset) {
      setMessages((m) => [
        ...m,
        {
          id: Date.now().toString(),
          text: `Recorded video: ${asset.fileName || asset.uri}`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          sender: 'You',
          isOwn: true,
        },
      ]);
    }
  };

  const handleRecordVoice = async () => {
    if (!recording) {
      const rec = await startAudioRecording();
      if (rec) setRecording(rec);
    } else {
      const uri = await stopAudioRecording(recording);
      setRecording(null);
      if (uri) {
        setMessages((m) => [
          ...m,
          {
            id: Date.now().toString(),
            text: `Voice clip: ${uri}`,
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            sender: 'You',
            isOwn: true,
          },
        ]);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        {isPickupDeliveryChannel && currentChannel?.doorNumber ? (
          // Pickup/Delivery channel header with door button and alarm
          <>
            <View style={styles.channelNameSection}>
              <Text style={styles.channelIcon}>#</Text>
              <Text style={styles.channelName}>{channel as string}</Text>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.doorButton, 
                { backgroundColor: currentChannel.doorStatus === 'red' ? '#EF4444' : '#10B981' }
              ]}
              onPress={handleDoorPress}
            >
              <Text style={styles.doorButtonText}>{currentChannel.doorNumber}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.alarmButton} onPress={handleAlarmPress}>
              <Bell size={24} color="#F59E0B" />
            </TouchableOpacity>
          </>
        ) : (
          // General channel or DM header - just channel name
          <View style={styles.channelInfo}>
            <View style={styles.channelTitle}>
              <Text style={styles.channelIcon}>#</Text>
              <Text style={styles.channelName}>{channel as string}</Text>
            </View>
            <View style={styles.channelMeta}>
              <Text style={styles.memberCount}>24 members</Text>
            </View>
          </View>
        )}
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      />

      <MessageComposer
        value={message}
        onChangeText={setMessage}
        onSend={sendMessage}
        placeholder={`Message #${channel}`}
        onAttachDocPress={handleAttachDoc}
        onESignPress={handleESign}
        onStartCallPress={handleStartCall}
        onShareLocationPress={handleShareLocation}
        onPickMediaPress={handlePickMedia}
        onRecordVideoPress={handleRecordVideo}
        onRecordVoicePress={handleRecordVoice}
        onEmojiPress={() => setEmojiVisible(true)}
      />

      <EmojiPickerModal
        visible={emojiVisible}
        onClose={() => setEmojiVisible(false)}
        onPick={(e) => setMessage((t) => (t ? t + ' ' + e : e))}
      />
      <PhoneCallModal
        visible={callVisible}
        onClose={() => setCallVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#151937' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    justifyContent: 'space-between',
  },
  backButton: { padding: 4 },
  channelInfo: { flex: 1, marginLeft: 12 },
  channelNameSection: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1, 
    marginLeft: 12 
  },
  channelTitle: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  channelIcon: { fontSize: 16, marginRight: 6, color: '#4B5563' },
  channelName: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  channelMeta: { flexDirection: 'row', alignItems: 'center' },
  memberCount: { fontSize: 12, color: '#4B5563', marginLeft: 4 },
  doorButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 8,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  doorButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  alarmButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesList: { flex: 1 },
  messagesContent: { padding: 16 },
  messageContainer: { marginBottom: 12 },
  ownMessage: { alignItems: 'flex-end' },
  otherMessage: { alignItems: 'flex-start' },
  messageBubble: { maxWidth: '80%', borderRadius: 12, padding: 12 },
  ownBubble: { backgroundColor: '#4F80FF' },
  otherBubble: { backgroundColor: '#1E293B' },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  messageText: { fontSize: 16, lineHeight: 20 },
  ownText: { color: '#FFFFFF' },
  otherText: { color: '#FFFFFF' },
  timestamp: { fontSize: 10, marginTop: 4 },
  ownTimestamp: { color: '#E0E7FF' },
  otherTimestamp: { color: '#374151' },
});
