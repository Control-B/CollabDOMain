import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, Search } from 'lucide-react-native';

export default function ChannelsScreen() {
  const router = useRouter();

  const channelTypes = [
    {
      id: 'general',
      title: 'General Channels',
      description:
        'Company-wide discussions, announcements, and team communications',
      color: '#10B981',
      count: 5,
      unread: 3,
      route: '/channels/general',
      stats: {
        active: 5,
        members: 402,
        messages: 1247,
      },
    },
    {
      id: 'inbound',
      title: 'Pickups',
      description: 'Incoming shipments, pickups, and driver check-ins',
      color: '#3B82F6',
      count: 3,
      unread: 2,
      route: '/channels/inbound',
      stats: {
        active: 3,
        drivers: 12,
        trips: 156,
      },
    },
    {
      id: 'outbound',
      title: 'Deliveries',
      description: 'Deliveries, route planning, and destination updates',
      color: '#8B5CF6',
      count: 4,
      unread: 1,
      route: '/channels/outbound',
      stats: {
        active: 4,
        drivers: 18,
        trips: 203,
      },
    },
  ];

  const handleChannelTypePress = (channelType: any) => {
    router.push(channelType.route);
  };

  const renderChannelTypeCard = (channelType: any) => {
    return (
      <TouchableOpacity
        key={channelType.id}
        style={[
          styles.channelTypeCard,
          { borderLeftColor: channelType.color },
          channelType.unread > 0 && styles.channelTypeCardUnread,
        ]}
        onPress={() => handleChannelTypePress(channelType)}
        activeOpacity={0.8}
      >
        <View style={styles.channelTypeContent}>
          <View style={styles.channelTypeHeader}>
            <View style={styles.channelTypeInfo}>
              <View style={styles.channelTypeTitleRow}>
                <Text style={styles.channelTypeTitle}>{channelType.title}</Text>
                {channelType.unread > 0 && (
                  <View
                    style={[
                      styles.unreadBadge,
                      { backgroundColor: channelType.color },
                    ]}
                  >
                    <Text style={styles.unreadCount}>{channelType.unread}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.channelTypeDescription} numberOfLines={2}>
                {channelType.description}
              </Text>
            </View>

            <ArrowRight size={20} color="#6B7280" />
          </View>

          {/* Stats */}
          <View style={styles.channelTypeStats}>
            <View style={styles.statItem}>
              <Text style={styles.statText}>
                {channelType.stats.active} Active
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statText}>
                {channelType.stats.members || channelType.stats.drivers}{' '}
                {channelType.stats.members ? 'Members' : 'Drivers'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statText}>
                {channelType.stats.messages || channelType.stats.trips}{' '}
                {channelType.stats.messages ? 'Messages' : 'Trips'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderQuickStat = (label: string, value: string, color: string) => {
    return (
      <View style={[styles.quickStatCard, { backgroundColor: color + '20' }]}>
        <Text style={styles.quickStatValue}>{value}</Text>
        <Text style={styles.quickStatLabel}>{label}</Text>
      </View>
    );
  };

  const totalChannels = channelTypes.reduce((sum, type) => sum + type.count, 0);
  const totalUnread = channelTypes.reduce((sum, type) => sum + type.unread, 0);
  const activeChannels = channelTypes.filter((type) => type.count > 0).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1d29" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Channels</Text>
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                alignItems: 'center',
              }}
            >
              <Text style={styles.headerTitle}>Channels</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Search size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Quick Overview Stats */}
        <ScrollView
          horizontal
          style={styles.statsContainer}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContent}
        >
          {renderQuickStat('Total', totalChannels.toString(), '#6B7280')}
          {renderQuickStat('Active', activeChannels.toString(), '#10B981')}
          {renderQuickStat('Unread', totalUnread.toString(), '#F59E0B')}
          {renderQuickStat('Types', '3', '#3B82F6')}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Channel Types */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Channel Categories</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>Manage</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.channelTypesContainer}>
            {channelTypes.map(renderChannelTypeCard)}
          </View>
        </View>

        {/* Recent Communications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Communications</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.communicationsContainer}>
            {/* Trip Channel */}
            <TouchableOpacity
              style={[styles.communicationItem, styles.communicationItemUnread]}
              onPress={() => router.push('/chat/trip-channel-001')}
              activeOpacity={0.8}
            >
              <View style={styles.communicationInfo}>
                <View style={styles.communicationHeader}>
                  <Text style={styles.communicationName}>
                    Trip INB-2024-001
                  </Text>
                  <View style={styles.communicationMeta}>
                    <Text style={styles.communicationParticipants}>
                      3 members
                    </Text>
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadCount}>2</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.communicationLastMessage} numberOfLines={1}>
                  ETA updated to 2:30 PM
                </Text>
                <Text style={styles.communicationTime}>5 min ago</Text>
              </View>
            </TouchableOpacity>

            {/* Personal Channel */}
            <TouchableOpacity
              style={styles.communicationItem}
              onPress={() => router.push('/chat/personal-001')}
              activeOpacity={0.8}
            >
              <View style={styles.communicationInfo}>
                <View style={styles.communicationHeader}>
                  <Text style={styles.communicationName}>Family Chat</Text>
                  <View style={styles.communicationMeta}>
                    <Text style={styles.communicationParticipants}>
                      4 members
                    </Text>
                  </View>
                </View>
                <Text style={styles.communicationLastMessage} numberOfLines={1}>
                  Drive safe! ❤️
                </Text>
                <Text style={styles.communicationTime}>1 hour ago</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => router.push('/channels')}
            >
              <Text style={styles.viewAllButtonText}>
                View All Communications
              </Text>
              <ArrowRight size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Channel Activity</Text>
          <View style={styles.activityContainer}>
            <View style={styles.activityItem}>
              <View
                style={[
                  styles.activityIcon,
                  { backgroundColor: '#10B981' + '20' },
                ]}
              ></View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>
                  New message in #general
                </Text>
                <Text style={styles.activityTime}>2 minutes ago</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View
                style={[
                  styles.activityIcon,
                  { backgroundColor: '#3B82F6' + '20' },
                ]}
              ></View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>
                  Driver checked in to INB-001
                </Text>
                <Text style={styles.activityTime}>15 minutes ago</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View
                style={[
                  styles.activityIcon,
                  { backgroundColor: '#8B5CF6' + '20' },
                ]}
              ></View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>
                  Delivery completed for OUT-245
                </Text>
                <Text style={styles.activityTime}>1 hour ago</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={[
                styles.quickActionCard,
                { backgroundColor: '#10B981' + '20' },
              ]}
              onPress={() => router.push('/channels/general')}
            >
              <Text style={[styles.quickActionTitle, { color: '#10B981' }]}>
                Join General
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.quickActionCard,
                { backgroundColor: '#3B82F6' + '20' },
              ]}
              onPress={() => router.push('/checkin/inbound')}
            >
              <Text style={[styles.quickActionTitle, { color: '#3B82F6' }]}>
                Check In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    alignItems: 'flex-start',
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
  searchButton: {
    backgroundColor: '#2D3748',
    borderRadius: 12,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    marginHorizontal: -20,
  },
  statsContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  quickStatCard: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 80,
  },
  quickStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  quickStatLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionAction: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  channelTypesContainer: {
    gap: 16,
  },
  channelTypeCard: {
    backgroundColor: '#2D3748',
    borderRadius: 16,
    borderLeftWidth: 4,
    overflow: 'hidden',
  },
  channelTypeCardUnread: {
    backgroundColor: '#374151',
  },
  channelTypeContent: {
    padding: 20,
  },
  channelTypeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  channelTypeIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  channelTypeInfo: {
    flex: 1,
  },
  channelTypeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  channelTypeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  channelTypeDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  channelTypeStats: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  activityContainer: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    padding: 16,
    borderRadius: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 16,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  communicationsContainer: {
    gap: 12,
  },
  communicationItem: {
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 16,
  },
  communicationItemUnread: {
    backgroundColor: '#374151',
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  communicationInfo: {
    flex: 1,
  },
  communicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  communicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  communicationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  communicationParticipants: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  communicationLastMessage: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  communicationTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D3748',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  viewAllButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
});
