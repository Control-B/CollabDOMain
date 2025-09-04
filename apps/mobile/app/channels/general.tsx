import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Search,
  Radio,
  Users,
  Plus,
  Settings,
  DollarSign,
  Wrench,
  UserCheck,
  Star,
  Lock,
  Globe,
  Bell,
  Filter,
  MoreHorizontal,
  Activity,
} from 'lucide-react-native';

interface GeneralChannel {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isPrivate: boolean;
  lastActivity: string;
  unreadCount: number;
  icon: any;
  color: string;
  isStarred?: boolean;
}

export default function GeneralChannelsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const router = useRouter();

  const channels: GeneralChannel[] = [
    {
      id: '1',
      name: 'General',
      description: 'Company-wide announcements and discussions',
      memberCount: 156,
      isPrivate: false,
      lastActivity: '2 min ago',
      unreadCount: 3,
      icon: Radio,
      color: '#10B981',
      isStarred: true,
    },
    {
      id: '2',
      name: 'IT Support',
      description: 'Technical issues and IT requests',
      memberCount: 45,
      isPrivate: false,
      lastActivity: '15 min ago',
      unreadCount: 0,
      icon: Settings,
      color: '#3B82F6',
    },
    {
      id: '3',
      name: 'HR',
      description: 'Human Resources and employee matters',
      memberCount: 78,
      isPrivate: true,
      lastActivity: '1 hour ago',
      unreadCount: 1,
      icon: UserCheck,
      color: '#8B5CF6',
    },
    {
      id: '4',
      name: 'Payroll',
      description: 'Payroll inquiries and updates',
      memberCount: 89,
      isPrivate: true,
      lastActivity: '3 hours ago',
      unreadCount: 0,
      icon: DollarSign,
      color: '#F59E0B',
    },
    {
      id: '5',
      name: 'Maintenance',
      description: 'Vehicle and equipment maintenance',
      memberCount: 34,
      isPrivate: false,
      lastActivity: '5 hours ago',
      unreadCount: 2,
      icon: Wrench,
      color: '#EF4444',
    },
  ];

  const filters = [
    { id: 'all', label: 'All', count: channels.length },
    {
      id: 'unread',
      label: 'Unread',
      count: channels.filter((c) => c.unreadCount > 0).length,
    },
    {
      id: 'starred',
      label: 'Starred',
      count: channels.filter((c) => c.isStarred).length,
    },
    {
      id: 'private',
      label: 'Private',
      count: channels.filter((c) => c.isPrivate).length,
    },
  ];

  const filteredChannels = channels.filter(
    (channel) =>
      channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChannelPress = (channel: GeneralChannel) => {
    router.push(`/chat/${channel.id}`);
  };

  const handleCreateChannel = () => {
    Alert.alert(
      'Create Channel',
      'What type of channel would you like to create?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Public Channel', onPress: () => createChannel(false) },
        { text: 'Private Channel', onPress: () => createChannel(true) },
      ]
    );
  };

  const createChannel = (isPrivate: boolean) => {
    Alert.alert(
      'Success',
      `${isPrivate ? 'Private' : 'Public'} channel created successfully!`
    );
  };

  const renderChannelCard = ({ item }: { item: GeneralChannel }) => {
    const IconComponent = item.icon;

    return (
      <TouchableOpacity
        style={[
          styles.channelCard,
          item.unreadCount > 0 && styles.channelCardUnread,
        ]}
        onPress={() => handleChannelPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.channelContent}>
          <View
            style={[styles.channelIcon, { backgroundColor: item.color + '20' }]}
          >
            <IconComponent size={24} color={item.color} />
            {item.isPrivate && (
              <View style={styles.privateIndicator}>
                <Lock size={10} color="#FFFFFF" />
              </View>
            )}
          </View>

          <View style={styles.channelInfo}>
            <View style={styles.channelHeader}>
              <View style={styles.channelTitleRow}>
                <Text
                  style={[
                    styles.channelName,
                    item.unreadCount > 0 && styles.channelNameUnread,
                  ]}
                >
                  {item.name}
                </Text>
                <View style={styles.channelMeta}>
                  {item.isStarred && (
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                  )}
                  {item.isPrivate ? (
                    <Lock size={12} color="#6B7280" />
                  ) : (
                    <Globe size={12} color="#6B7280" />
                  )}
                </View>
              </View>
              <Text style={styles.channelDescription} numberOfLines={1}>
                {item.description}
              </Text>
            </View>

            <View style={styles.channelFooter}>
              <View style={styles.channelStats}>
                <Users size={12} color="#6B7280" />
                <Text style={styles.memberCount}>{item.memberCount}</Text>
                <Text style={styles.lastActivity}>• {item.lastActivity}</Text>
              </View>

              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadCount}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.channelActions}>
            <MoreHorizontal size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderQuickStat = (
    label: string,
    value: string,
    color: string,
    icon: any
  ) => {
    const IconComponent = icon;
    return (
      <View style={[styles.statCard, { backgroundColor: color + '20' }]}>
        <IconComponent size={16} color={color} />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1d29" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              alignItems: 'center',
            }}
          >
            <Text style={styles.title}>💬 General Channels</Text>
          </View>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateChannel}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <ScrollView
          horizontal
          style={styles.statsContainer}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContent}
        >
          {renderQuickStat(
            'Total',
            channels.length.toString(),
            '#3B82F6',
            Radio
          )}
          {renderQuickStat('Active', '5', '#10B981', Activity)}
          {renderQuickStat('Members', '402', '#8B5CF6', Users)}
          {renderQuickStat(
            'Unread',
            channels.filter((c) => c.unreadCount > 0).length.toString(),
            '#F59E0B',
            Bell
          )}
        </ScrollView>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search channels..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#6B7280"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          style={styles.filterTabs}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterTab,
                activeFilter === filter.id && styles.filterTabActive,
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === filter.id && styles.filterTabTextActive,
                ]}
              >
                {filter.label}
              </Text>
              <View
                style={[
                  styles.filterTabBadge,
                  activeFilter === filter.id && styles.filterTabBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterTabBadgeText,
                    activeFilter === filter.id &&
                      styles.filterTabBadgeTextActive,
                  ]}
                >
                  {filter.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Channels List */}
      <View style={styles.content}>
        <FlatList
          data={filteredChannels}
          renderItem={renderChannelCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.channelsList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1d29',
  },
  header: {
    backgroundColor: '#1a1d29',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  createButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    marginHorizontal: -20,
    marginBottom: 16,
  },
  statsContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
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
  filterButton: {
    padding: 4,
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
  channelsList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  channelCard: {
    backgroundColor: '#2D3748',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  channelCardUnread: {
    backgroundColor: '#3B82F6' + '10',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  channelContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  channelIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  privateIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#374151',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelInfo: {
    flex: 1,
  },
  channelHeader: {
    marginBottom: 8,
  },
  channelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  channelName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  channelNameUnread: {
    fontWeight: 'bold',
  },
  channelMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  channelDescription: {
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  channelFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  channelStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  memberCount: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 2,
  },
  lastActivity: {
    fontSize: 12,
    color: '#6B7280',
  },
  unreadBadge: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  channelActions: {
    padding: 8,
    marginLeft: 8,
  },
});
