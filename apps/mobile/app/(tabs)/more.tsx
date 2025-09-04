import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import {
  ChevronRight,
  Truck,
  Edit,
  Settings,
  HelpCircle,
  Activity,
  Calendar,
  BarChart3,
  LogOut,
  User,
  Shield,
  Bell,
  FileText,
  Pin,
  Receipt,
  Star,
  Bookmark,
} from 'lucide-react-native';

export default function MoreScreen() {
  const userProfile = {
    name: 'John Smith',
    email: 'john.smith@company.com',
    phone: '+1 (555) 123-4567',
    role: 'Senior Driver',
    vehicleId: 'TRK-001',
    rating: 4.8,
    totalTrips: 1247,
    onTimeDeliveries: '98%',
  };

  // removed unused menuSections config

  const handleMenuPress = (itemId: string) => {
    switch (itemId) {
      case 'pinned-messages':
        Alert.alert('Pinned Messages', 'Viewing pinned messages...');
        break;
      case 'pinned-receipts':
        Alert.alert('Pinned Receipts', 'Viewing pinned receipts...');
        break;
      case 'starred':
        Alert.alert('Starred Items', 'Viewing starred items...');
        break;
      case 'saved-messages':
        Alert.alert('Saved Messages', 'Viewing saved messages...');
        break;
      case 'account':
        Alert.alert(
          'Account Settings',
          'Account settings feature coming soon!'
        );
        break;
      case 'privacy':
        Alert.alert(
          'Privacy Settings',
          'Privacy settings feature coming soon!'
        );
        break;
      case 'notifications':
        Alert.alert('Notifications', 'Notification settings updated!');
        break;
      case 'terms':
        Alert.alert('Terms of Use', 'Terms of use feature coming soon!');
        break;
      case 'activity':
        // Navigate to the activity screen (we'll create a standalone version)
        Alert.alert('Activity Dashboard', 'Opening activity dashboard...');
        // TODO: Create standalone activity screen
        break;
      case 'profile':
        Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
        break;
      case 'help':
        Alert.alert('Help Center', 'How can we help you today?');
        break;
      case 'logout':
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign Out', style: 'destructive', onPress: () => {} },
        ]);
        break;
      default:
        Alert.alert('Coming Soon', `${itemId} feature is coming soon!`);
    }
  };

  // removed unused renderMenuItem helper
  // removed unused renderModernStatCard function

  const renderMenuCard = (
    icon: any,
    title: string,
    subtitle: string,
    iconColor: string,
    onPress: () => void
  ) => {
    const IconComponent = icon;
    return (
      <TouchableOpacity
        style={styles.menuCard}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.menuIconContainer,
            { backgroundColor: iconColor + '20' },
          ]}
        >
          <IconComponent size={20} color={iconColor} />
        </View>
        <View style={styles.menuContent}>
          <Text style={styles.menuTitle}>{title}</Text>
          <Text style={styles.menuSubtitle}>{subtitle}</Text>
        </View>
        <ChevronRight size={18} color="#6B7280" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.screenTitle}>Profile & Settings</Text>
          <Text style={styles.screenSubtitle}>
            Manage your account and preferences
          </Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <User size={36} color="#FFFFFF" />
              </View>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleMenuPress('profile')}
            >
              <Edit size={18} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileDetails}>
            <Text style={styles.userName}>{userProfile.name}</Text>
            <Text style={styles.userRole}>{userProfile.role}</Text>
            <Text style={styles.userEmail}>{userProfile.email}</Text>
            <Text style={styles.userPhone}>{userProfile.phone}</Text>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shortcuts</Text>
          <View style={styles.menuSection}>
            {renderMenuCard(
              Pin,
              'Pinned Messages',
              'View your pinned messages',
              '#F59E0B',
              () => handleMenuPress('pinned-messages')
            )}
            {renderMenuCard(
              Receipt,
              'Pinned Receipts',
              'Access your pinned receipts',
              '#10B981',
              () => handleMenuPress('pinned-receipts')
            )}
            {renderMenuCard(
              Star,
              'Starred',
              'View starred items',
              '#F59E0B',
              () => handleMenuPress('starred')
            )}
            {renderMenuCard(
              Bookmark,
              'Saved Messages',
              'Access your saved messages',
              '#6366F1',
              () => handleMenuPress('saved-messages')
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuSection}>
            {renderMenuCard(
              User,
              'Account',
              'Manage your account settings',
              '#3B82F6',
              () => handleMenuPress('account')
            )}
            {renderMenuCard(
              Shield,
              'Privacy',
              'Privacy and security settings',
              '#10B981',
              () => handleMenuPress('privacy')
            )}
            {renderMenuCard(
              Bell,
              'Notifications',
              'Manage notification preferences',
              '#F59E0B',
              () => handleMenuPress('notifications')
            )}
            {renderMenuCard(
              FileText,
              'Terms of Use',
              'View terms and conditions',
              '#6366F1',
              () => handleMenuPress('terms')
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account & Support</Text>
          <View style={styles.menuSection}>
            {renderMenuCard(
              Activity,
              'Activity Dashboard',
              'View your performance metrics',
              '#3B82F6',
              () => handleMenuPress('activity')
            )}
            {renderMenuCard(
              Settings,
              'App Settings',
              'Customize your preferences',
              '#6366F1',
              () => handleMenuPress('preferences')
            )}
            {renderMenuCard(
              HelpCircle,
              'Help & Support',
              'Get help and contact support',
              '#10B981',
              () => handleMenuPress('help')
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Driver Tools</Text>
          <View style={styles.menuSection}>
            {renderMenuCard(
              Truck,
              'My Vehicle',
              'Vehicle details and status',
              '#8B5CF6',
              () => handleMenuPress('vehicle')
            )}
            {renderMenuCard(
              Calendar,
              'Work Schedule',
              'View and manage schedule',
              '#F59E0B',
              () => handleMenuPress('schedule')
            )}
            {renderMenuCard(
              BarChart3,
              'Performance Reports',
              'Detailed analytics and insights',
              '#EF4444',
              () => handleMenuPress('performance')
            )}
          </View>
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={() => handleMenuPress('logout')}
          activeOpacity={0.8}
        >
          <LogOut size={20} color="#FFFFFF" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>CollaB Hub v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2024 Logistics Solutions</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    ...Platform.select({
      android: {
        paddingTop: 10,
      },
    }),
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#94A3B8',
    lineHeight: 24,
  },
  profileCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 32,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  avatarContainer: {
    flex: 1,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  profileDetails: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  userRole: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 4,
    textAlign: 'center',
  },
  userPhone: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  menuSection: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
  },
  signOutButton: {
    backgroundColor: '#EF4444',
    marginHorizontal: 24,
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  appVersion: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
    color: '#64748B',
  },
});
