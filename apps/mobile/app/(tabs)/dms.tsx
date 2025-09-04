import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import {
  Search,
  MessageCircle,
  Users,
  Plus,
  Phone,
  Video,
  MoreHorizontal,
  Star,
} from 'lucide-react-native';
import { useChatStore } from '@/store/chatStore';
import { router } from 'expo-router';

export default function DMsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const { directMessages, users, currentUser } = useChatStore();

  const filteredDMs = useMemo(() => {
    const lower = searchQuery.toLowerCase();
    return directMessages.filter((dm) => {
      const otherUser = users.find(
        (u) => dm.participants.includes(u.id) && u.id !== currentUser.id
      );
      const matchesSearch =
        (otherUser?.name.toLowerCase().includes(lower) ?? false) ||
        (dm.lastMessage?.toLowerCase().includes(lower) ?? false);

      if (activeTab === 'unread') return matchesSearch && dm.unreadCount > 0;
      return matchesSearch;
    });
  }, [activeTab, currentUser.id, directMessages, searchQuery, users]);

  const tabs = [
    { id: 'all' as const, label: 'All', count: directMessages.length },
    {
      id: 'unread' as const,
      label: 'Unread',
      count: directMessages.filter((d) => d.unreadCount > 0).length,
    },
  ];

  const handleDMPress = (dm: any) => {
    const otherUser = users.find(
      (u) => dm.participants.includes(u.id) && u.id !== currentUser.id
    );
    router.push({
      pathname: '/chat/[id]',
      params: {
        id: dm.id,
        title: otherUser?.name || 'Direct Message',
        type: 'dm',
      },
    });
  };

  const handleNewMessage = () => {
    Alert.alert('Coming soon', 'Starting a new DM will be available shortly.');
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online':
        return '#10B981';
      case 'away':
        return '#F59E0B';
      case 'busy':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const renderDMItem = ({ item }: { item: any }) => {
    const otherUser = users.find(
      (u) => item.participants.includes(u.id) && u.id !== currentUser.id
    );
    if (!otherUser) return null;

    const isUnread = item.unreadCount > 0;

    return (
      <TouchableOpacity
        style={[styles.dmCard, isUnread && styles.dmCardUnread]}
        onPress={() => handleDMPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.dmContent}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: '#3B82F6' }]}>
              <Text style={styles.avatarText}>
                {otherUser.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: getStatusColor(otherUser.status) },
              ]}
            />
          </View>

          <View style={styles.dmInfo}>
            <View style={styles.dmHeader}>
              <Text style={[styles.dmName, isUnread && styles.dmNameUnread]}>
                {otherUser.name}
              </Text>
              <View style={styles.dmMeta}>
                {item.isFavorite && (
                  <Star size={12} color="#F59E0B" fill="#F59E0B" />
                )}
                <Text style={styles.dmTime}>{item.lastMessageTime}</Text>
              </View>
            </View>

            <View style={styles.dmMessageRow}>
              <View style={styles.dmMessageContent}>
                <Text
                  style={[
                    styles.dmLastMessage,
                    isUnread && styles.dmLastMessageUnread,
                  ]}
                  numberOfLines={1}
                >
                  {item.lastMessage || 'No messages yet'}
                </Text>
              </View>

              {isUnread && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadCount}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.dmActions}>
            <MoreHorizontal size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderQuickAction = (
    icon: any,
    label: string,
    onPress: () => void,
    color: string
  ) => {
    const IconComponent = icon;
    return (
      <TouchableOpacity
        style={[styles.quickActionCard, { backgroundColor: color + '20' }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <IconComponent size={24} color={color} />
        <Text style={[styles.quickActionLabel, { color }]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1d29" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Direct Messages</Text>
          <TouchableOpacity
            style={styles.newMessageButton}
            onPress={handleNewMessage}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#374151"
          />
        </View>

        {/* Quick Actions */}
        <ScrollView
          horizontal
          style={styles.quickActions}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsContent}
        >
          {renderQuickAction(
            MessageCircle,
            'New Chat',
            handleNewMessage,
            '#3B82F6'
          )}
          {renderQuickAction(Users, 'Group Chat', () => {}, '#10B981')}
          {renderQuickAction(Phone, 'Voice Call', () => {}, '#8B5CF6')}
          {renderQuickAction(Video, 'Video Call', () => {}, '#F59E0B')}
        </ScrollView>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          style={styles.filterTabs}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.filterTab,
                activeTab === tab.id && styles.filterTabActive,
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeTab === tab.id && styles.filterTabTextActive,
                ]}
              >
                {tab.label}
              </Text>
              <View
                style={[
                  styles.filterTabBadge,
                  activeTab === tab.id && styles.filterTabBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterTabBadgeText,
                    activeTab === tab.id && styles.filterTabBadgeTextActive,
                  ]}
                >
                  {tab.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Messages List */}
      <View style={styles.content}>
        <FlatList
          data={filteredDMs}
          renderItem={renderDMItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.dmsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ padding: 24 }}>
              <Text style={{ color: '#4B5563' }}>No conversations found.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1d29',
    ...Platform.select({
      android: {
        paddingTop: 10,
      },
    }),
  },
  header: {
    backgroundColor: '#1a1d29',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  newMessageButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  quickActions: {
    marginHorizontal: -20,
    marginBottom: 16,
  },
  quickActionsContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  quickActionCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 80,
  },
  quickActionLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  filterTabs: {
    marginHorizontal: -20,
  },
  filterTabsContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterTabActive: {
    backgroundColor: '#3B82F6',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  filterTabBadge: {
    backgroundColor: '#374151',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  filterTabBadgeActive: {
    backgroundColor: '#FFFFFF' + '30',
  },
  filterTabBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  filterTabBadgeTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  dmsList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  dmCard: {
    backgroundColor: '#2D3748',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  dmCardUnread: {
    backgroundColor: '#3B82F6' + '10',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  dmContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#2D3748',
  },
  dmInfo: {
    flex: 1,
  },
  dmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dmName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  dmNameUnread: {
    fontWeight: 'bold',
  },
  dmMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dmTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  dmMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dmMessageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  dmLastMessage: {
    fontSize: 14,
    color: '#9CA3AF',
    flex: 1,
  },
  dmLastMessageUnread: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadCount: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dmActions: {
    padding: 8,
    marginLeft: 8,
  },
});
