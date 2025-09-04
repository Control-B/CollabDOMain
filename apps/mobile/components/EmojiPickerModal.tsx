import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

export default function EmojiPickerModal({
  visible,
  onClose,
  onPick,
}: {
  visible: boolean;
  onClose: () => void;
  onPick: (emoji: string) => void;
}) {
  const emojis =
    '😀😄😁😆🥹😊🙂😉😍😘😜🤪🤩🤔😴🙃🥳🤝👍👎👏🙏💪🔥✨🎉🚚📦📝📍📞📷🎥🎤🕒📣✅❗️⚠️'.split(
      ''
    );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Pick an emoji</Text>
          <FlatList
            data={emojis}
            keyExtractor={(item, idx) => item + idx}
            numColumns={8}
            columnWrapperStyle={{ gap: 6 }}
            contentContainerStyle={{ gap: 6 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.emojiBtn}
                onPress={() => {
                  onPick(item);
                  onClose();
                }}
              >
                <Text style={styles.emoji}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: { color: '#FFFFFF', fontWeight: '700', marginBottom: 12 },
  emojiBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#111827',
  },
  emoji: { fontSize: 22 },
  closeBtn: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  closeText: { color: '#9CA3AF' },
});
