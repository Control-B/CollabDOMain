import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Smile,
  Video,
  Mic,
  Send,
  Paperclip,
  Signature,
  Phone,
  MapPin,
  Image as ImageIcon,
} from 'lucide-react-native';

export interface MessageComposerProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
  // Optional callbacks for actions
  onEmojiPress?: () => void;
  onVideoRecordPress?: () => void;
  onVoiceRecordPress?: () => void;
  // Newly added quick actions
  onAttachDocPress?: () => void;
  onESignPress?: () => void;
  onStartCallPress?: () => void;
  onShareLocationPress?: () => void;
  onPickMediaPress?: () => void; // Image/Video picker
  onRecordVideoPress?: () => void;
  onRecordVoicePress?: () => void;
}

export default function MessageComposer({
  value,
  onChangeText,
  onSend,
  placeholder = 'Message...',
  onEmojiPress,
  onVideoRecordPress,
  onVoiceRecordPress,
  onAttachDocPress,
  onESignPress,
  onStartCallPress,
  onShareLocationPress,
  onPickMediaPress,
  onRecordVideoPress,
  onRecordVoicePress,
}: MessageComposerProps) {
  const canSend = value.trim().length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Scrollable quick actions toolbar */}
      <View style={styles.toolbarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.toolbarContent}
        >
          {/* Newly added actions */}
          <ToolbarButton
            label="Attach Doc"
            Icon={Paperclip}
            color="#1E3A8A"
            onPress={onAttachDocPress || (() => {})}
          />
          <ToolbarButton
            label="E-Sign"
            Icon={Signature}
            color="#6D28D9"
            onPress={onESignPress || (() => {})}
          />
          <ToolbarButton
            label="Start Call"
            Icon={Phone}
            color="#15803D"
            onPress={onStartCallPress || (() => {})}
          />
          <ToolbarButton
            label="Share Location"
            Icon={MapPin}
            color="#B45309"
            onPress={onShareLocationPress || (() => {})}
          />
          <ToolbarButton
            label="Image/Video"
            Icon={ImageIcon}
            color="#9D174D"
            onPress={onPickMediaPress || (() => {})}
          />

          <ToolbarButton
            label="Emoji"
            Icon={Smile}
            color="#8B5CF6"
            onPress={onEmojiPress || (() => {})}
          />
          <ToolbarButton
            label="Video Clip"
            Icon={Video}
            color="#3B82F6"
            onPress={onRecordVideoPress || onVideoRecordPress || (() => {})}
          />
          <ToolbarButton
            label="Voice Clip"
            Icon={Mic}
            color="#10B981"
            onPress={onRecordVoicePress || onVoiceRecordPress || (() => {})}
          />
          <ToolbarButton
            label="Send"
            Icon={Send}
            color="#60A5FA"
            onPress={canSend ? onSend : undefined}
            disabled={!canSend}
          />
        </ScrollView>
      </View>

      {/* Composer input row */}
      <View style={styles.composer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#374151"
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              canSend ? styles.sendActive : styles.sendInactive,
            ]}
            onPress={onSend}
            disabled={!canSend}
            accessibilityLabel="Send message"
          >
            <Send size={18} color={canSend ? '#FFFFFF' : '#6B7280'} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function ToolbarButton({
  label,
  Icon,
  color,
  onPress,
  disabled,
}: {
  label: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.toolbarButton,
        { backgroundColor: color + '33', borderColor: color + '55' },
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.9}
    >
      <Icon size={16} color={disabled ? '#6B7280' : '#FFFFFF'} />
      <Text
        style={[
          styles.toolbarText,
          { color: disabled ? '#6B7280' : '#FFFFFF' },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  toolbarContainer: {
    paddingVertical: 8,
  },
  toolbarContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
  },
  toolbarText: {
    fontSize: 12,
    fontWeight: '600',
  },
  composer: {
    padding: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    marginHorizontal: 4,
    marginBottom: 4,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    maxHeight: 120,
  },
  iconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#334155',
  },
  sendActive: {
    backgroundColor: '#4F80FF',
  },
  sendInactive: {
    backgroundColor: '#334155',
  },
});
