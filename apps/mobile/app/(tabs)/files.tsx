import { useState } from 'react';
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
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import {
  Search,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  MoreHorizontal,
  Filter,
  Grid,
  List,
  Upload,
  Folder,
  Star,
  Clock,
} from 'lucide-react-native';
// import { useChatStore } from '@/store/chatStore';

const { width } = Dimensions.get('window');

export default function FilesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'
  const [activeFilter, setActiveFilter] = useState('all');
  // const { documents } = useChatStore();

  const fileTypes = [
    { id: 'all', label: 'All Files', icon: FileText, count: 24 },
    { id: 'documents', label: 'Documents', icon: FileText, count: 12 },
    { id: 'images', label: 'Images', icon: Image, count: 8 },
    { id: 'videos', label: 'Videos', icon: Video, count: 3 },
    { id: 'archived', label: 'Archived', icon: Archive, count: 1 },
  ];

  const recentFiles = [
    {
      id: '1',
      name: 'Trip_INB_2024_001.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedBy: 'John Smith',
      uploadedAt: '2 hours ago',
      isFavorite: true,
    },
    {
      id: '2',
      name: 'Vehicle_Inspection_Report.docx',
      type: 'docx',
      size: '1.2 MB',
      uploadedBy: 'Maria Garcia',
      uploadedAt: '4 hours ago',
      isFavorite: false,
    },
    {
      id: '3',
      name: 'Delivery_Photos_001.zip',
      type: 'zip',
      size: '15.6 MB',
      uploadedBy: 'Robert Johnson',
      uploadedAt: '6 hours ago',
      isFavorite: false,
    },
  ];

  const filteredFiles = recentFiles.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return FileText;
      case 'docx':
        return FileText;
      case 'zip':
        return Archive;
      case 'jpg':
      case 'png':
        return Image;
      case 'mp4':
      case 'mov':
        return Video;
      case 'mp3':
      case 'wav':
        return Music;
      default:
        return FileText;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return '#EF4444';
      case 'docx':
        return '#3B82F6';
      case 'zip':
        return '#F59E0B';
      case 'jpg':
      case 'png':
        return '#10B981';
      case 'mp4':
      case 'mov':
        return '#8B5CF6';
      case 'mp3':
      case 'wav':
        return '#EC4899';
      default:
        return '#6B7280';
    }
  };

  const handleFilePress = (file: any) => {
    // Check if it's a document that can be signed
    const signableTypes = ['pdf', 'docx'];
    const isSignable = signableTypes.includes(file.type);

    if (isSignable) {
      Alert.alert(
        'Open Document',
        `What would you like to do with ${file.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open for Signing',
            onPress: () => {
              // Navigate to document signing page
              router.push({
                pathname: '/document-sign/[documentId]',
                params: {
                  documentId: file.id,
                  documentName: file.name,
                  fromChat: 'false',
                },
              });
            },
          },
          { text: 'Download', onPress: () => handleDownload(file) },
          { text: 'Share', onPress: () => handleShare(file) },
        ]
      );
    } else {
      Alert.alert('Open File', `Do you want to open ${file.name}?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download', onPress: () => handleDownload(file) },
        { text: 'Share', onPress: () => handleShare(file) },
      ]);
    }
  };

  const handleDownload = (file: any) => {
    Alert.alert('Download', `Downloading ${file.name}...`);
  };

  const handleShare = (file: any) => {
    Alert.alert('Share', `Sharing ${file.name}...`);
  };

  const handleUpload = () => {
    Alert.alert('Upload File', 'Choose upload method:', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Camera', onPress: () => {} },
      { text: 'Gallery', onPress: () => {} },
      { text: 'Documents', onPress: () => {} },
    ]);
  };

  const renderFileCard = ({ item }: { item: any }) => {
    const FileIcon = getFileIcon(item.type);
    const fileColor = getFileColor(item.type);

    if (viewMode === 'grid') {
      return (
        <TouchableOpacity
          style={styles.fileGridCard}
          onPress={() => handleFilePress(item)}
          activeOpacity={0.8}
        >
          <View style={styles.fileGridContent}>
            <View
              style={[
                styles.fileGridIcon,
                { backgroundColor: fileColor + '20' },
              ]}
            >
              <FileIcon size={32} color={fileColor} />
              {item.isFavorite && (
                <View style={styles.favoriteIcon}>
                  <Star size={12} color="#F59E0B" fill="#F59E0B" />
                </View>
              )}
            </View>
            <Text style={styles.fileGridName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.fileGridSize}>{item.size}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.fileListCard}
        onPress={() => handleFilePress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.fileListContent}>
          <View
            style={[styles.fileListIcon, { backgroundColor: fileColor + '20' }]}
          >
            <FileIcon size={24} color={fileColor} />
          </View>

          <View style={styles.fileListInfo}>
            <View style={styles.fileListHeader}>
              <Text style={styles.fileListName} numberOfLines={1}>
                {item.name}
              </Text>
              {item.isFavorite && (
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
              )}
            </View>
            <Text style={styles.fileListMeta}>
              {item.size} • {item.uploadedBy} • {item.uploadedAt}
            </Text>
          </View>

          <TouchableOpacity style={styles.fileListActions}>
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
          <TouchableOpacity
            style={styles.viewModeButton}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? (
              <List size={20} color="#FFFFFF" />
            ) : (
              <Grid size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>File Manager</Text>
          </View>

          <TouchableOpacity
            style={[styles.headerButton, styles.downloadButton]}
            onPress={handleUpload}
          >
            <Upload size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#374151" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search files and documents..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#374151"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={16} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <ScrollView
          horizontal
          style={styles.quickActions}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsContent}
        >
          {renderQuickAction(Upload, 'Upload', handleUpload, '#10B981')}
          {renderQuickAction(Folder, 'New Folder', () => {}, '#3B82F6')}
          {renderQuickAction(Star, 'Favorites', () => {}, '#F59E0B')}
          {renderQuickAction(Clock, 'Recent', () => {}, '#8B5CF6')}
        </ScrollView>

        {/* File Type Filters */}
        <ScrollView
          horizontal
          style={styles.filterTabs}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsContent}
        >
          {fileTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.filterTab,
                activeFilter === type.id && styles.filterTabActive,
              ]}
              onPress={() => setActiveFilter(type.id)}
            >
              <type.icon
                size={16}
                color={activeFilter === type.id ? '#FFFFFF' : '#4B5563'}
              />
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === type.id && styles.filterTabTextActive,
                ]}
              >
                {type.label}
              </Text>
              <View
                style={[
                  styles.filterTabBadge,
                  activeFilter === type.id && styles.filterTabBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterTabBadgeText,
                    activeFilter === type.id && styles.filterTabBadgeTextActive,
                  ]}
                >
                  {type.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Files List */}
      <View style={styles.content}>
        <FlatList
          data={filteredFiles}
          renderItem={renderFileCard}
          keyExtractor={(item) => item.id}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode} // Force re-render when view mode changes
          contentContainerStyle={styles.filesList}
          columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
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
  viewModeButton: {
    backgroundColor: '#2D3748',
    borderRadius: 12,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadButton: {
    backgroundColor: '#10B981',
  },
  headerLeft: {
    flex: 1,
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    backgroundColor: '#2D3748',
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
  filterButton: {
    padding: 4,
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
    gap: 6,
  },
  filterTabActive: {
    backgroundColor: '#3B82F6',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  filterTabBadge: {
    backgroundColor: '#374151',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  filterTabBadgeActive: {
    backgroundColor: '#FFFFFF' + '30',
  },
  filterTabBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  filterTabBadgeTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  filesList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  // Grid View Styles
  fileGridCard: {
    backgroundColor: '#2D3748',
    borderRadius: 16,
    marginBottom: 16,
    width: (width - 60) / 2,
    overflow: 'hidden',
  },
  fileGridContent: {
    alignItems: 'center',
    padding: 20,
  },
  fileGridIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  favoriteIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#2D3748',
    borderRadius: 8,
    padding: 2,
  },
  fileGridName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
    minHeight: 36,
  },
  fileGridSize: {
    fontSize: 12,
    color: '#6B7280',
  },
  // List View Styles
  fileListCard: {
    backgroundColor: '#2D3748',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  fileListContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  fileListIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fileListInfo: {
    flex: 1,
  },
  fileListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  fileListName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  fileListMeta: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  fileListActions: {
    padding: 8,
  },
});
