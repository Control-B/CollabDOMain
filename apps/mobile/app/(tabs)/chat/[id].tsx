import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Menu } from 'lucide-react-native';

import { useChatStore } from '@/store/chatStore';
import MessageComposer from '@/components/MessageComposer';
import EmojiPickerModal from '@/components/EmojiPickerModal';
import PhoneCallModal from '@/components/PhoneCallModal';
import {
  pickDocument,
  pickImageOrVideo,
  recordVideo,
  getCurrentLocation,
  startAudioRecording,
  stopAudioRecording,
} from '@/services/media';

export default function ChatScreen() {
  const { id, title, type, channelType, doorNumber, doorStatus } =
    useLocalSearchParams<{
      id: string;
      title: string;
      type: string;
      channelType: string;
      doorNumber: string;
      doorStatus: string;
    }>();
  const [messageText, setMessageText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const {
    messages,
    users,
    addMessage,
    markAsRead,
    currentUser,
    toggleDoorStatus,
  } = useChatStore();

  const channelMessages = messages[id] || [];
  const isInboundOrOutbound =
    channelType === 'inbound' || channelType === 'outbound';
  const [emojiVisible, setEmojiVisible] = useState(false);
  const [callVisible, setCallVisible] = useState(false);
  const [recording, setRecording] = useState<any>(null);

  useEffect(() => {
    markAsRead(id);
  }, [id, markAsRead]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: `msg-${Date.now()}`,
        text: messageText.trim(),
        userId: currentUser.id,
        channelId: id,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        type: 'text' as const,
      };

      addMessage(id, newMessage);
      setMessageText('');

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleDocsPress = () => {
    setShowMenu(false);
    router.push('/documents');
  };

  const handleSignPress = () => {
    setShowMenu(false);
    router.push('/e-sign');
  };

  const handleAlarmPress = () => {
    setShowMenu(false);
    console.log('Alarm pressed');
  };

  const handleDoorToggle = () => {
    toggleDoorStatus(id);
  };

  // quickActions omitted in this variant

  const renderMessage = ({ item }: { item: any }) => {
    const user = users.find((u) => u.id === item.userId);
    const isCurrentUser = item.userId === currentUser.id;

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser && styles.currentUserMessage,
        ]}
      >
        {!isCurrentUser && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.avatar || 'U'}</Text>
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isCurrentUser && styles.currentUserBubble,
          ]}
        >
          {!isCurrentUser && (
            <Text style={styles.userName}>{user?.name || 'Unknown User'}</Text>
          )}
          <Text
            style={[
              styles.messageText,
              isCurrentUser && styles.currentUserText,
            ]}
          >
            {item.text}
          </Text>
          <Text
            style={[
              styles.timestamp,
              isCurrentUser && styles.currentUserTimestamp,
            ]}
          >
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#151937" />

      <View style={styles.header}>
        {isInboundOrOutbound ? (
          <View style={styles.inboundOutboundHeader}>
            <View style={styles.leftSection}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <ArrowLeft size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.channelInfo}>
                <Text style={styles.channelName}>#{title}</Text>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberText}>124 members</Text>
                </View>
              </View>
            </View>

            <View style={styles.centerSection}>
              {doorNumber && (
                <TouchableOpacity
                  style={[
                    styles.doorIndicator,
                    {
                      backgroundColor:
                        doorStatus === 'green' ? '#064E3B' : '#7F1D1D',
                      borderColor:
                        doorStatus === 'green' ? '#10B981' : '#EF4444',
                    },
                  ]}
                  onPress={handleDoorToggle}
                >
                  <View
                    style={[
                      styles.doorDot,
                      {
                        backgroundColor:
                          doorStatus === 'green' ? '#10B981' : '#EF4444',
                      },
                    ]}
                  />
                  <Text style={styles.doorText}>Door — {doorNumber} •</Text>
                  <Text
                    style={[
                      styles.doorStatus,
                      { color: doorStatus === 'green' ? '#10B981' : '#EF4444' },
                    ]}
                  >
                    {doorStatus === 'green' ? 'GREEN' : 'RED'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.rightSection}>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setShowMenu(!showMenu)}
              >
                <Menu size={24} color="#6B7280" />
              </TouchableOpacity>

              {showMenu && (
                <View style={styles.menuDropdown}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleDocsPress}
                  >
                    <Text style={styles.menuItemText}>Docs</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleAlarmPress}
                  >
                    <Text style={styles.menuItemText}>Alarm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.menuItem, styles.lastMenuItem]}
                    onPress={handleSignPress}
                  >
                    <Text style={styles.menuItemText}>Sign</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.regularHeader}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>
                {type === 'channel' ? '#' : ''}
                {title}
              </Text>
              {type === 'channel' && (
                <View style={styles.memberInfo}>
                  <Text style={styles.memberText}>124 members</Text>
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <Menu size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          ref={flatListRef}
          data={channelMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        />

        {/* Shared composer with functional toolbar */}
        <MessageComposer
          value={messageText}
          onChangeText={setMessageText}
          onSend={handleSendMessage}
          placeholder={`Message ${type === 'channel' ? '#' : ''}${title || ''}`}
          onAttachDocPress={async () => {
            const doc = await pickDocument();
            if (doc) {
              addMessage(id, {
                id: `msg-${Date.now()}`,
                text: `Attached: ${doc.name || 'file'}`,
                userId: currentUser.id,
                channelId: id,
                timestamp: new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                type: 'text',
              });
            }
          }}
          onESignPress={() => router.push('/e-sign')}
          onStartCallPress={() => setCallVisible(true)}
          onShareLocationPress={async () => {
            const loc = await getCurrentLocation();
            if (loc) {
              const { latitude, longitude } = loc.coords;
              addMessage(id, {
                id: `msg-${Date.now()}`,
                text: `Location: https://maps.google.com/?q=${latitude},${longitude}`,
                userId: currentUser.id,
                channelId: id,
                timestamp: new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                type: 'text',
              });
            }
          }}
          onPickMediaPress={async () => {
            const asset = await pickImageOrVideo();
            if (asset) {
              addMessage(id, {
                id: `msg-${Date.now()}`,
                text: `Shared media: ${asset.fileName || asset.uri}`,
                userId: currentUser.id,
                channelId: id,
                timestamp: new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                type: 'text',
              });
            }
          }}
          onRecordVideoPress={async () => {
            const asset = await recordVideo();
            if (asset) {
              addMessage(id, {
                id: `msg-${Date.now()}`,
                text: `Recorded video: ${asset.fileName || asset.uri}`,
                userId: currentUser.id,
                channelId: id,
                timestamp: new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                type: 'text',
              });
            }
          }}
          onRecordVoicePress={async () => {
            if (!recording) {
              const rec = await startAudioRecording();
              if (rec) setRecording(rec);
            } else {
              const uri = await stopAudioRecording(recording);
              setRecording(null);
              if (uri) {
                addMessage(id, {
                  id: `msg-${Date.now()}`,
                  text: `Voice clip: ${uri}`,
                  userId: currentUser.id,
                  channelId: id,
                  timestamp: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                  type: 'text',
                });
              }
            }
          }}
          onEmojiPress={() => setEmojiVisible(true)}
        />

        <EmojiPickerModal
          visible={emojiVisible}
          onClose={() => setEmojiVisible(false)}
          onPick={(e) => setMessageText((t) => (t ? t + ' ' + e : e))}
        />
        <PhoneCallModal
          visible={callVisible}
          onClose={() => setCallVisible(false)}
          defaultNumber={currentUser.phone}
        />
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
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  inboundOutboundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
  },
  regularHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  channelInfo: {
    marginLeft: 8,
  },
  channelName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doorIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  doorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  doorText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginRight: 4,
    flexShrink: 0,
  },
  doorStatus: {
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 0,
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    position: 'relative',
    flexShrink: 0,
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4F80FF',
  },
  menuDropdown: {
    position: 'absolute',
    top: 48,
    right: 0,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    minWidth: 120,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  moreButton: {
    marginLeft: 12,
    flexShrink: 0,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  currentUserMessage: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4F80FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  messageBubble: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    maxWidth: '80%',
  },
  currentUserBubble: {
    backgroundColor: '#4F80FF',
    marginLeft: 'auto',
  },
  userName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F80FF',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  currentUserText: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  currentUserTimestamp: {
    color: '#DBEAFE',
  },
  quickActionsContainer: {
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  quickActionsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 4,
    minWidth: 90,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
});
