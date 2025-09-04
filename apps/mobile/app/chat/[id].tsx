import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import {
  ArrowLeft,
  Users,
  Menu,
  Send,
  Signature as FileSignature,
  Phone,
  MapPin,
  Camera,
  Upload,
} from 'lucide-react-native';

import { useChatStore } from '@/store/chatStore';

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
    connectToPhoenix,
    joinPhoenixChannel,
    sendMessage: sendPhoenixMessage,
    shareDocument,
    isConnected,
  } = useChatStore();

  const channelMessages = messages[id] || [];
  const isInboundOrOutbound =
    channelType === 'inbound' || channelType === 'outbound';

  useEffect(() => {
    markAsRead(id);

    // Initialize Phoenix connection and join this channel
    const initializeChat = async () => {
      try {
        if (!isConnected) {
          await connectToPhoenix();
        }
        await joinPhoenixChannel(id);
      } catch (error) {
        console.error('Failed to initialize chat:', error);
      }
    };

    initializeChat();
  }, [id, markAsRead, isConnected, connectToPhoenix, joinPhoenixChannel]);

  const handleSendMessage = async () => {
    if (messageText.trim()) {
      // Send via Phoenix channels for real-time delivery
      try {
        await sendPhoenixMessage(id, messageText.trim());
      } catch (error) {
        console.error('Failed to send via Phoenix:', error);

        // Fallback to local state for development
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
      }

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

  const handleAttachDocPress = async () => {
    try {
      // Pick document from device
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const document = result.assets[0];

        // Share document in chat via Phoenix channels
        await shareDocument(id, {
          id: `doc-${Date.now()}`,
          name: document.name,
          url: document.uri,
          size: document.size || 0,
          type: document.mimeType || 'application/pdf',
          requiresSignature: true,
        });

        // Show confirmation
        Alert.alert(
          'Document Shared',
          `${document.name} has been shared with the channel for signing.`
        );
      }
    } catch (error) {
      console.error('Error sharing document:', error);

      // Fallback: Add a demo document message
      const documentMessage = {
        id: Date.now().toString(),
        channelId: id,
        userId: currentUser.id,
        text: '📄 Service Agreement Contract - Needs Signature\n\nTap to open and sign this document.',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        type: 'document' as const,
        metadata: {
          documentId: 'doc-001',
          documentName: 'Service Agreement Contract.pdf',
        },
      };
      addMessage(id, documentMessage);
    }
  };

  const handleDocumentPress = (documentId: string, documentName: string) => {
    // Open document for signing
    router.push({
      pathname: '/document-sign/[documentId]',
      params: {
        documentId,
        documentName,
        fromChat: 'true',
        channelId: id,
      },
    });
  };

  const handleAlarmPress = () => {
    setShowMenu(false);
    console.log('Alarm pressed');
  };

  const handleDoorToggle = () => {
    toggleDoorStatus(id);
  };

  const quickActions = [
    {
      icon: Upload,
      label: 'Upload Doc',
      color: '#4F80FF',
      onPress: handleAttachDocPress,
    },
    {
      icon: FileSignature,
      label: 'E-Sign',
      color: '#8B5CF6',
      onPress: handleSignPress,
    },
    {
      icon: Phone,
      label: 'Start Call',
      color: '#10B981',
      onPress: () => Alert.alert('Call', 'Voice call feature coming soon!'),
    },
    {
      icon: MapPin,
      label: 'Share Location',
      color: '#F59E0B',
      onPress: () =>
        Alert.alert('Location', 'Location sharing feature coming soon!'),
    },
    {
      icon: Camera,
      label: 'Image/Video',
      color: '#EF4444',
      onPress: () => Alert.alert('Media', 'Media capture feature coming soon!'),
    },
  ];

  const renderMessage = ({ item }: { item: any }) => {
    const user = users.find((u) => u.id === item.userId);
    const isCurrentUser = item.userId === currentUser.id;
    const isDocumentMessage =
      item.type === 'document' ||
      (item.text.includes('📄') && item.text.includes('Signature'));
    const isSignatureRequest = item.type === 'signature_request';

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
        <TouchableOpacity
          style={[
            styles.messageBubble,
            isCurrentUser && styles.currentUserBubble,
            isDocumentMessage && styles.documentMessage,
            isSignatureRequest && styles.signatureMessage,
          ]}
          onPress={() => {
            if (isDocumentMessage || isSignatureRequest) {
              const documentId = item.metadata?.documentId || 'doc-001';
              const documentName =
                item.metadata?.documentName || 'Service Agreement Contract.pdf';
              handleDocumentPress(documentId, documentName);
            }
          }}
          activeOpacity={isDocumentMessage || isSignatureRequest ? 0.7 : 1}
        >
          {!isCurrentUser && (
            <Text style={styles.userName}>{user?.name || 'Unknown User'}</Text>
          )}
          <Text
            style={[
              styles.messageText,
              isCurrentUser && styles.currentUserText,
              isDocumentMessage && styles.documentMessageText,
              isSignatureRequest && styles.signatureMessageText,
            ]}
          >
            {item.text}
          </Text>
          {(isDocumentMessage || isSignatureRequest) && (
            <Text style={styles.documentHint}>Tap to open and sign</Text>
          )}
          <Text
            style={[
              styles.timestamp,
              isCurrentUser && styles.currentUserTimestamp,
            ]}
          >
            {item.timestamp}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#151937" />

      {/* Header */}
      <View style={styles.header}>
        {isInboundOrOutbound ? (
          <View style={styles.inboundOutboundHeader}>
            {/* Left Section */}
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
                  <Users size={12} color="#6B7280" />
                  <Text style={styles.memberText}>124 members</Text>
                </View>
              </View>
            </View>

            {/* Center Section - Door Indicator */}
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

            {/* Right Section - Menu */}
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
                  <Users size={14} color="#6B7280" />
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
        {/* Messages */}
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

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsContent}
          >
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.quickActionButton,
                  { backgroundColor: action.color },
                ]}
                onPress={action.onPress}
                activeOpacity={0.8}
              >
                <action.icon size={14} color="#FFFFFF" />
                <Text style={styles.quickActionText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Message Composer */}
        <View style={styles.composer}>
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              value={messageText}
              onChangeText={setMessageText}
              placeholder={`Message #${title}`}
              placeholderTextColor="#6B7280"
              multiline
              maxLength={1000}
            />
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[
                styles.sendButton,
                messageText.trim() && styles.sendButtonActive,
              ]}
              onPress={handleSendMessage}
              disabled={!messageText.trim()}
            >
              <Send
                size={16}
                color={messageText.trim() ? '#FFFFFF' : '#6B7280'}
              />
            </TouchableOpacity>
          </View>
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
  composer: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    borderRadius: 8,
    margin: 8,
  },
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4F80FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    minHeight: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 16,
  },
  actionIcon: {
    padding: 4,
  },
  sendButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#334155',
  },
  sendButtonActive: {
    backgroundColor: '#4F80FF',
  },
  documentMessage: {
    borderWidth: 2,
    borderColor: '#8B5CF6',
    backgroundColor: '#8B5CF610',
  },
  documentMessageText: {
    fontWeight: '600',
  },
  signatureMessage: {
    borderWidth: 2,
    borderColor: '#F59E0B',
    backgroundColor: '#F59E0B10',
  },
  signatureMessageText: {
    fontWeight: '600',
    color: '#F59E0B',
  },
  documentHint: {
    fontSize: 11,
    color: '#8B5CF6',
    fontWeight: '500',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
