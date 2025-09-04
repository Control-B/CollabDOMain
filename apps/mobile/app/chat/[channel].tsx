import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Send, ArrowLeft, Users, Bell, DoorOpen } from 'lucide-react-native';
import { useChatStore } from '../../store/chatStore';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: string;
  isOwn: boolean;
}

export default function ChatScreen() {
  const { channel } = useLocalSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const { toggleDoorStatus } = useChatStore();
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

  const getChannelInfo = () => {
    const channelData: Record<string, { icon: string; description: string; memberCount: number; type?: string; doorNumber?: number; doorStatus?: string }> = {
      general: {
        icon: '💬',
        description: 'Company-wide discussions',
        memberCount: 24,
        type: 'general',
      },
      inbound: {
        icon: '📥',
        description: 'Incoming shipments & deliveries',
        memberCount: 12,
        type: 'inbound',
        doorNumber: 3,
        doorStatus: 'Closed',
      },
      outbound: {
        icon: '📤',
        description: 'Outgoing deliveries & routes',
        memberCount: 18,
        type: 'outbound',
        doorNumber: 7,
        doorStatus: 'Open',
      },
    };
    return (
      channelData[channel as string] || {
        icon: '📢',
        description: 'Channel discussions',
        memberCount: 1,
        type: 'general',
      }
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

  const channelInfo = getChannelInfo();
  const isPickupDeliveryChannel = channelInfo.type === 'inbound' || channelInfo.type === 'outbound';

  const handleDoorToggle = () => {
    toggleDoorStatus(channel as string);
  };

  const handleAlarmPress = () => {
    console.log('Alarm pressed for channel:', channel);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        {isPickupDeliveryChannel ? (
          // Pickup/Delivery channel header: name (left), door (center), alarm (right)
          <>
            <View style={styles.channelNameSection}>
              <Text style={styles.channelName}>#{channel}</Text>
            </View>
            <View style={styles.doorSection}>
              <TouchableOpacity style={styles.doorButton} onPress={handleDoorToggle}>
                <DoorOpen size={16} color="#FFFFFF" />
                <Text style={styles.doorText}>
                  Door {channelInfo.doorNumber} - {channelInfo.doorStatus}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.alarmSection}>
              <TouchableOpacity style={styles.alarmButton} onPress={handleAlarmPress}>
                <Bell size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          // General/DM channel header: just channel name (center)
          <View style={styles.channelInfoCenter}>
            <View style={styles.channelTitle}>
              <Text style={styles.channelIcon}>{channelInfo.icon}</Text>
              <Text style={styles.channelName}>#{channel}</Text>
            </View>
            <View style={styles.channelMeta}>
              <Users size={12} color="#9CA3AF" />
              <Text style={styles.memberCount}>
                {channelInfo.memberCount} members
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={message}
            onChangeText={setMessage}
            placeholder={`Message #${channel}`}
            placeholderTextColor="#6B7280"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              message.trim()
                ? styles.sendButtonActive
                : styles.sendButtonInactive,
            ]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Send size={20} color={message.trim() ? '#FFFFFF' : '#6B7280'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151937',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  channelInfo: {
    flex: 1,
  },
  channelTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  channelIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  channelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  channelMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCount: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 12,
    padding: 12,
  },
  ownBubble: {
    backgroundColor: '#4F80FF',
  },
  otherBubble: {
    backgroundColor: '#1E293B',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownText: {
    color: '#FFFFFF',
  },
  otherText: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  ownTimestamp: {
    color: '#E0E7FF',
  },
  otherTimestamp: {
    color: '#6B7280',
  },
  inputContainer: {
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
    color: '#FFFFFF',
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#4F80FF',
  },
  sendButtonInactive: {
    backgroundColor: '#334155',
  },
  // New styles for pickup/delivery channel headers
  channelNameSection: {
    flex: 1,
    justifyContent: 'center',
  },
  doorSection: {
    flex: 2,
    alignItems: 'center',
  },
  alarmSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  doorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  doorText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },
  alarmButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#374151',
  },
  channelInfoCenter: {
    flex: 1,
    alignItems: 'center',
  },
});
