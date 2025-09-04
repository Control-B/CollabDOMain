import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  ArrowLeft,
  FileText,
  Download,
  Signature as FileSignature,
} from 'lucide-react-native';
import { router } from 'expo-router';

const documentsRequiringSignature = [
  {
    id: 'doc-1',
    name: 'Service Agreement - TRK-001',
    description: 'Driver service agreement requiring signature',
    size: '2.1 MB',
    type: 'pdf',
    urgency: 'high',
  },
  {
    id: 'doc-2',
    name: 'Delivery Confirmation - PO-88421',
    description: 'Delivery confirmation form',
    size: '1.3 MB',
    type: 'pdf',
    urgency: 'medium',
  },
  {
    id: 'doc-3',
    name: 'Insurance Form - BIG-RIG-303',
    description: 'Vehicle insurance documentation',
    size: '956 KB',
    type: 'docx',
    urgency: 'low',
  },
];

export default function DocumentsScreen() {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const renderDocumentItem = ({ item }: { item: any }) => (
    <View style={styles.documentItem}>
      <View style={styles.fileIcon}>
        <FileText size={24} color="#EF4444" />
      </View>

      <View style={styles.documentContent}>
        <Text style={styles.fileName}>{item.name}</Text>
        <Text style={styles.fileDescription}>{item.description}</Text>
        <View style={styles.fileMeta}>
          <Text style={styles.fileSize}>{item.size}</Text>
          <View
            style={[
              styles.urgencyBadge,
              { backgroundColor: getUrgencyColor(item.urgency) },
            ]}
          >
            <Text style={styles.urgencyText}>{item.urgency} priority</Text>
          </View>
        </View>
      </View>

      <View style={styles.documentActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Download size={18} color="#4F80FF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.signButton]}
          onPress={() => router.push('/e-sign')}
        >
          <FileSignature size={18} color="#FFFFFF" />
          <Text style={styles.signButtonText}>Sign</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#151937" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={20} color="#4F80FF" />
          <Text style={styles.backText}>Back to Chat</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Documents Requiring Signature</Text>
        <Text style={styles.headerSubtitle}>
          Review and sign pending documents
        </Text>
      </View>

      <FlatList
        data={documentsRequiringSignature}
        renderItem={renderDocumentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.documentsList}
        showsVerticalScrollIndicator={false}
      />
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
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  backText: {
    color: '#4F80FF',
    fontSize: 14,
    marginLeft: 8,
    flexShrink: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    flexWrap: 'wrap',
  },
  documentsList: {
    padding: 16,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  documentContent: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  fileDescription: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 8,
    lineHeight: 18,
    flexWrap: 'wrap',
  },
  fileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  fileSize: {
    fontSize: 12,
    color: '#6B7280',
    flexShrink: 0,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  documentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  signButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  signButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
