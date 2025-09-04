import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Menu,
  FileText,
  AlertTriangle,
  FileSignature,
} from 'lucide-react-native';

export default function ChatScreen() {
  const { id, title, type, channelType, doorNumber, doorStatus, vehicleId } =
    useLocalSearchParams<{
      id: string;
      title: string;
      type: string;
      channelType: string;
      doorNumber: string;
      vehicleId: string;
      doorStatus: string;
    }>();
  
  console.log('🔍 ChatScreen params:', { id, title, type, channelType, doorNumber, doorStatus, vehicleId });
  
  const [showMenu, setShowMenu] = useState(false);
  const [doorStatusState, setDoorStatusState] = useState<'green' | 'red'>(
    (doorStatus as 'green' | 'red') || 'green'
  );

  const handleDoorToggle = () => {
    const newStatus = doorStatusState === 'green' ? 'red' : 'green';
    setDoorStatusState(newStatus);
    Alert.alert('Door Status', `Door status changed to ${newStatus === 'green' ? 'Green (Ready)' : 'Red (Loading)'}`);
  };

  const handleSignPress = () => {
    setShowMenu(false);
    router.push('/e-sign');
  };

  const handleAlarmPress = () => {
    setShowMenu(false);
    Alert.alert('Alarm', 'Emergency alarm activated! Help is on the way.');
  };

  const handleDocsPress = () => {
    setShowMenu(false);
    Alert.alert('Documents', 'Document management feature coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#151937" />

      {/* Custom Header for PO-based channels */}
      <View style={styles.header}>
        {/* Left Section - Door Number Button */}
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={[
              styles.doorButton,
              {
                backgroundColor: doorStatusState === 'green' ? '#10B981' : '#EF4444',
              },
            ]}
            onPress={handleDoorToggle}
          >
            <Text style={styles.doorButtonText}>
              Door {doorNumber || '1'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Center Section - Channel Info (PO Number) */}
        <View style={styles.centerSection}>
          <Text style={styles.poNumber}># {title}</Text>
          <Text style={styles.vehicleId}>Vehicle ID - {vehicleId || id}</Text>
        </View>

        {/* Right Section - Hamburger Menu */}
        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setShowMenu(!showMenu)}
          >
            <Menu size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Content */}
      <View style={styles.chatContainer}>
        <View style={styles.welcomeMessage}>
          <Text style={styles.welcomeText}>Welcome to the {title} channel!</Text>
          <Text style={styles.subText}>Ready to coordinate logistics and deliveries!</Text>
        </View>
      </View>

      {/* Menu Modal */}
      {showMenu && (
        <View style={styles.menuOverlay}>
          <TouchableOpacity 
            style={styles.menuBackdrop} 
            onPress={() => setShowMenu(false)}
          />
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleDocsPress}
            >
              <FileText size={20} color="#FFFFFF" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Docs</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleAlarmPress}
            >
              <AlertTriangle size={20} color="#EF4444" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Alarm</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleSignPress}
            >
              <FileSignature size={20} color="#FFFFFF" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Sign</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  leftSection: {
    width: 80,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  poNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
    textAlign: 'center',
  },
  vehicleId: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
    textAlign: 'center',
  },
  doorButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  doorButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  menuButton: {
    padding: 4,
  },
  chatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeMessage: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    top: 80,
    right: 16,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});