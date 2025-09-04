import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import {
  ArrowLeft,
  FileText,
  Search,
  Filter,
  BarChart3,
  Settings,
  Bell,
  Send,
  CheckSquare,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Document } from './types';
import DocumentList from './components/DocumentList';
import DocumentViewer from './components/DocumentViewer';
// import SignatureInterface from '@/components/SignatureInterface';

export default function ESignDashboard() {
  const [activeTab, setActiveTab] = useState<
    'documents' | 'templates' | 'workflows' | 'analytics'
  >('documents');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signatureMode, setSignatureMode] = useState<'signature' | 'initials'>(
    'signature'
  );
  const [searchQuery] = useState('');
  const [filter] = useState<Partial<Document>>({});

  useEffect(() => {
    console.log(
      'State changed - selectedDocument:',
      selectedDocument?.id,
      'showSignaturePad:',
      showSignaturePad
    );
  }, [selectedDocument, showSignaturePad]);

  const handleDocumentPress = (document: Document) => {
    setSelectedDocument(document);
    setShowDocumentViewer(true);
  };

  const handleNewDocument = () => {
    Alert.alert('New Document', 'Choose document type', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Upload File', onPress: () => handleUploadDocument() },
      { text: 'Use Template', onPress: () => handleUseTemplate() },
      { text: 'Create Blank', onPress: () => handleCreateBlank() },
    ]);
  };

  const handleUploadDocument = () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.docx,.doc,.txt';
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (file) {
          try {
            Alert.alert('Success', 'Document uploaded successfully (Demo)');
          } catch {
            Alert.alert('Error', 'Failed to upload document');
          }
        }
      };
      input.click();
    } else {
      Alert.alert('Upload Document', 'Choose upload method', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Camera',
          onPress: () =>
            Alert.alert('Camera', 'Camera functionality would open here'),
        },
        {
          text: 'File Browser',
          onPress: () =>
            Alert.alert('File Browser', 'File picker would open here'),
        },
      ]);
    }
  };

  const handleUseTemplate = () => {
    Alert.alert('Templates', 'Template selection would open here');
  };

  const handleCreateBlank = () => {
    Alert.alert('Create Blank', 'Blank document creation would open here');
  };

  const handleDocumentAction = async (document: Document, action: string) => {
    try {
      switch (action) {
        case 'sign':
          setSelectedDocument(document);
          setShowSignaturePad(true);
          break;
        case 'approve':
          Alert.alert('Success', 'Document approved (Demo)');
          break;
        case 'decline':
          Alert.alert('Success', 'Document declined (Demo)');
          break;
        case 'forward':
          Alert.alert('Success', 'Document forwarded to next step (Demo)');
          break;
        default:
          break;
      }
    } catch {
      Alert.alert('Error', `Failed to ${action} document`);
    }
  };

  const handleSignatureComplete = async (signatureData: any) => {
    if (!selectedDocument) {
      Alert.alert('Error', 'No document selected for signing');
      return;
    }

    if (!signatureData || (!signatureData.paths && !signatureData.text)) {
      Alert.alert('Error', 'Please create your signature before saving');
      return;
    }

    try {
      const signatureType = signatureData.isInitials ? 'Initials' : 'Signature';
      Alert.alert(
        'Success',
        `${signatureType} added to "${selectedDocument.title}" successfully!`,
        [
          {
            text: 'OK',
            onPress: () => {
              setShowSignaturePad(false);
              setSelectedDocument(null);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error in handleSignatureComplete:', error);
      Alert.alert('Error', 'Failed to save signature');
    }
  };

  const renderTabs = () => {
    const items: {
      key: typeof activeTab;
      label: string;
      Icon: any;
      color: string;
      bg: string;
      activeBg: string;
    }[] = [
      {
        key: 'documents',
        label: 'Documents',
        Icon: FileText,
        color: '#4F80FF',
        bg: '#24324B',
        activeBg: '#2E3B5F',
      },
      {
        key: 'templates',
        label: 'Templates',
        Icon: CheckSquare,
        color: '#A78BFA',
        bg: '#2A2146',
        activeBg: '#34285A',
      },
      {
        key: 'workflows',
        label: 'Workflows',
        Icon: Send,
        color: '#06B6D4',
        bg: '#10343A',
        activeBg: '#18464D',
      },
      {
        key: 'analytics',
        label: 'Analytics',
        Icon: BarChart3,
        color: '#F59E0B',
        bg: '#3A2E12',
        activeBg: '#4A3B16',
      },
    ];

    return (
      <View style={styles.tabsGrid}>
        {items.map(({ key, label, Icon, color, bg, activeBg }) => {
          const isActive = activeTab === key;
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.tabCard,
                {
                  backgroundColor: isActive ? activeBg : bg,
                  borderColor: isActive ? color : 'transparent',
                },
              ]}
              onPress={() => setActiveTab(key)}
            >
              <Icon size={18} color={color} />
              <Text
                style={[
                  styles.tabCardText,
                  isActive && { color, fontWeight: '700' },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'documents':
        return (
          <DocumentList
            onDocumentPress={handleDocumentPress}
            onNewDocument={handleNewDocument}
            onDocumentAction={handleDocumentAction}
            filter={filter}
            searchQuery={searchQuery}
          />
        );

      case 'templates':
        return (
          <View style={styles.placeholderContainer}>
            <CheckSquare size={48} color="#6B7280" />
            <Text style={styles.placeholderTitle}>Document Templates</Text>
            <Text style={styles.placeholderMessage}>
              Create and manage reusable document templates for common forms and
              contracts.
            </Text>
          </View>
        );

      case 'workflows':
        return (
          <View style={styles.placeholderContainer}>
            <Send size={48} color="#6B7280" />
            <Text style={styles.placeholderTitle}>Workflow Management</Text>
            <Text style={styles.placeholderMessage}>
              Design and manage approval workflows for document routing and
              signatures.
            </Text>
          </View>
        );

      case 'analytics':
        return (
          <View style={styles.placeholderContainer}>
            <BarChart3 size={48} color="#6B7280" />
            <Text style={styles.placeholderTitle}>Analytics & Reporting</Text>
            <Text style={styles.placeholderMessage}>
              View detailed analytics on document processing, signature
              completion rates, and user activity.
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  if (showDocumentViewer && selectedDocument) {
    return (
      <DocumentViewer
        documentId={selectedDocument.id}
        onClose={() => {
          setShowDocumentViewer(false);
          setSelectedDocument(null);
        }}
        onSave={(document) => {
          console.log('Document saved:', document);
          setShowDocumentViewer(false);
          setSelectedDocument(null);
        }}
        mode="view"
      />
    );
  }

  if (showSignaturePad) {
    console.log(
      'Rendering signature pad, selectedDocument:',
      selectedDocument?.id
    );
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#151937" />

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setShowSignaturePad(false)}
            style={styles.backButton}
          >
            <ArrowLeft size={20} color="#4F80FF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sign Document</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.signatureContainer}>
          <View style={styles.signatureHeader}>
            <Text style={styles.signatureTitle}>
              Sign: {selectedDocument?.title}
            </Text>

            <View style={styles.modeSelector}>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  signatureMode === 'signature' && styles.activeModeButton,
                ]}
                onPress={() => setSignatureMode('signature')}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    signatureMode === 'signature' &&
                      styles.activeModeButtonText,
                  ]}
                >
                  Signature
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeButton,
                  signatureMode === 'initials' && styles.activeModeButton,
                ]}
                onPress={() => setSignatureMode('initials')}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    signatureMode === 'initials' && styles.activeModeButtonText,
                  ]}
                >
                  Initials
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <SignatureInterface
            onSave={handleSignatureComplete}
            onCancel={() => setShowSignaturePad(false)}
            documentTitle={selectedDocument?.title}
            mode={signatureMode}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#151937" />

      {/* Compact Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={22} color="#4F80FF" />
        </TouchableOpacity>

        <View pointerEvents="none" style={styles.headerCenter}>
          <Text style={styles.headerTitle}>E-Signing Dashboard</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerActionButton}>
            <Bell size={20} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerActionButton}>
            <Settings size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInput}>
          <Search size={16} color="#9CA3AF" />
          <Text style={styles.searchPlaceholder}>Search documents...</Text>
        </View>

        <TouchableOpacity style={styles.filterButton}>
          <Filter size={16} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Tabs (2x2 colorful grid) */}
      {renderTabs()}

      {/* Content */}
      <View style={styles.contentContainer}>{renderContent()}</View>
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
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    position: 'relative',
  },

  backButton: {
    padding: 6,
    marginRight: 8,
  },

  headerCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 0,
    textAlign: 'center',
  },

  headerActions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 'auto',
  },

  headerActionButton: {
    padding: 6,
    backgroundColor: '#334155',
    borderRadius: 6,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    gap: 12,
  },

  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },

  searchPlaceholder: {
    color: '#9CA3AF',
    fontSize: 14,
    flex: 1,
  },

  filterButton: {
    padding: 10,
    backgroundColor: '#334155',
    borderRadius: 8,
  },

  tabsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },

  tabCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
  },

  tabCardText: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '600',
  },

  contentContainer: {
    flex: 1,
  },

  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  placeholderTitle: {
    color: '#9CA3AF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },

  placeholderMessage: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },

  signatureContainer: {
    flex: 1,
    padding: 16,
  },

  signatureHeader: {
    marginBottom: 24,
  },

  signatureTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },

  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#334155',
    borderRadius: 8,
    padding: 4,
    alignSelf: 'center',
  },

  modeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },

  activeModeButton: {
    backgroundColor: '#4F80FF',
  },

  modeButtonText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },

  activeModeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
