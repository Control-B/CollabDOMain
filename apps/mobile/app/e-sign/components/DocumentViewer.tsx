import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  Download,
  Share,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Send,
  MoreVertical,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react-native';
import { Document } from '../types';
import { getDocumentById } from '../services/demoData';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface DocumentViewerProps {
  documentId: string;
  onClose: () => void;
  onSave?: (document: Document) => void;
  mode?: 'view' | 'sign' | 'review' | 'approve';
}

export default function DocumentViewer({
  documentId,
  onClose,
  onSave,
  mode = 'view',
}: DocumentViewerProps) {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // pagination reserved for future multi-page support
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [currentSignature] = useState<string | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use demo data instead of API call
      const doc = getDocumentById(documentId);
      if (doc) {
        setDocument(doc);
      } else {
        setError('Document not found');
      }
    } catch {
      setError('Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  // Update handlers reserved for future real-time updates

  const handleDownload = async () => {
    try {
      // Demo download - just show success message
      Alert.alert('Download', 'Document downloaded successfully (Demo)');
    } catch {
      Alert.alert('Error', 'Failed to download document');
    }
  };

  const handleShare = async () => {
    if (!document) return;

    try {
      const recipients = document.metadata?.recipients || [];
      const recipientEmails = recipients.map((r) => r.email).filter(Boolean);
      // Demo share - just show success message
      Alert.alert(
        'Success',
        `Document shared with ${recipientEmails.length} recipients (Demo)`
      );
    } catch {
      Alert.alert('Error', 'Failed to share document');
    }
  };

  const handleSign = async () => {
    if (!document || !currentSignature) return;

    try {
      // Demo signature - just show success message
      Alert.alert('Success', 'Document signed successfully (Demo)');

      if (onSave) {
        onSave(document);
      }
    } catch {
      Alert.alert('Error', 'Failed to sign document');
    }
  };

  const handleApprove = async () => {
    if (!document) return;

    try {
      // Demo workflow advancement - just show success message
      Alert.alert('Success', 'Document approved (Demo)');
    } catch {
      Alert.alert('Error', 'Failed to approve document');
    }
  };

  const handleDecline = async () => {
    if (!document) return;

    try {
      // Demo workflow advancement - just show success message
      Alert.alert('Success', 'Document declined (Demo)');
    } catch {
      Alert.alert('Error', 'Failed to decline document');
    }
  };

  const handleForward = async () => {
    if (!document) return;

    try {
      // Demo workflow advancement - just show success message
      Alert.alert('Success', 'Document forwarded to next step (Demo)');
    } catch {
      Alert.alert('Error', 'Failed to forward document');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#151937" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F80FF" />
          <Text style={styles.loadingText}>Loading document...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !document) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#151937" />
        <View style={styles.errorContainer}>
          <XCircle size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Failed to Load Document</Text>
          <Text style={styles.errorMessage}>
            {error || 'Document not found'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadDocument}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#151937" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <ArrowLeft size={20} color="#4F80FF" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.documentTitle} numberOfLines={1}>
            {document.title || 'Untitled Document'}
          </Text>
          <Text style={styles.documentMeta}>
            {document.type || 'Unknown'} • {document.status || 'Unknown'} •{' '}
            {document.metadata?.sender?.fullName || 'Unknown Sender'}
          </Text>
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <MoreVertical size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Document Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusItem}>
          <Clock size={16} color="#9CA3AF" />
          <Text style={styles.statusText}>
            Created:{' '}
            {document.createdAt
              ? new Date(document.createdAt).toLocaleDateString()
              : 'Unknown Date'}
          </Text>
        </View>

        <View style={styles.statusItem}>
          <User size={16} color="#9CA3AF" />
          <Text style={styles.statusText}>
            {document.signatures?.length || 0} signatures
          </Text>
        </View>

        <View style={styles.statusItem}>
          <FileText size={16} color="#9CA3AF" />
          <Text style={styles.statusText}>
            {document.content?.pages || 0} pages
          </Text>
        </View>
      </View>

      {/* Document Content */}
      <View style={styles.contentContainer}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.documentScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.documentContent}
        >
          {/* Document Preview */}
          <View style={styles.documentPreview}>
            <View style={styles.pageContainer}>
              <View
                style={[
                  styles.page,
                  {
                    transform: [{ scale: zoom }, { rotate: `${rotation}deg` }],
                  },
                ]}
              >
                <Text style={styles.pageText}>
                  {document.content?.rawContent ||
                    'Document content would be rendered here'}
                </Text>

                {/* Signature Fields */}
                {document.signatures?.map((signature, index) => (
                  <View
                    key={signature.id}
                    style={[
                      styles.signatureField,
                      {
                        left: signature.location?.x || 0,
                        top: signature.location?.y || 0,
                        width: signature.location?.width || 200,
                        height: signature.location?.height || 100,
                      },
                    ]}
                  >
                    <Text style={styles.signatureText}>
                      {signature.user?.fullName || 'Unknown User'}
                    </Text>
                    <Text style={styles.signatureDate}>
                      {signature.timestamp
                        ? new Date(signature.timestamp).toLocaleDateString()
                        : 'Unknown Date'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Zoom Controls */}
        <View style={styles.zoomControls}>
          <TouchableOpacity
            style={styles.zoomButton}
            onPress={() => setZoom(Math.max(0.5, zoom - 0.1))}
          >
            <ZoomOut size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <Text style={styles.zoomText}>{Math.round(zoom * 100)}%</Text>

          <TouchableOpacity
            style={styles.zoomButton}
            onPress={() => setZoom(Math.min(3, zoom + 0.1))}
          >
            <ZoomIn size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.zoomButton}
            onPress={() => setRotation(rotation + 90)}
          >
            <RotateCcw size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <View style={styles.actionLeft}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDownload}
          >
            <Download size={16} color="#9CA3AF" />
            <Text style={styles.actionButtonText}>Download</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Share size={16} color="#9CA3AF" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionRight}>
          {mode === 'sign' && (
            <TouchableOpacity style={styles.signButton} onPress={handleSign}>
              <CheckCircle size={16} color="#FFFFFF" />
              <Text style={styles.signButtonText}>Sign</Text>
            </TouchableOpacity>
          )}

          {mode === 'approve' && (
            <>
              <TouchableOpacity
                style={styles.approveButton}
                onPress={handleApprove}
              >
                <CheckCircle size={16} color="#FFFFFF" />
                <Text style={styles.approveButtonText}>Approve</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.declineButton}
                onPress={handleDecline}
              >
                <XCircle size={16} color="#FFFFFF" />
                <Text style={styles.declineButtonText}>Decline</Text>
              </TouchableOpacity>
            </>
          )}

          {mode === 'review' && (
            <TouchableOpacity
              style={styles.forwardButton}
              onPress={handleForward}
            >
              <Send size={16} color="#FFFFFF" />
              <Text style={styles.forwardButtonText}>Forward</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
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

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },

  backText: {
    color: '#4F80FF',
    fontSize: 14,
    marginLeft: 8,
  },

  headerInfo: {
    flex: 1,
  },

  documentTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },

  documentMeta: {
    color: '#9CA3AF',
    fontSize: 12,
  },

  moreButton: {
    padding: 8,
  },

  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },

  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginLeft: 4,
  },

  contentContainer: {
    flex: 1,
    position: 'relative',
  },

  documentScroll: {
    flex: 1,
  },

  documentContent: {
    padding: 16,
  },

  documentPreview: {
    alignItems: 'center',
  },

  pageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  page: {
    width: screenWidth - 64,
    minHeight: screenHeight * 0.6,
    padding: 24,
    backgroundColor: '#FFFFFF',
  },

  pageText: {
    color: '#1F2937',
    fontSize: 14,
    lineHeight: 20,
  },

  signatureField: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#4F80FF',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(79, 128, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },

  signatureText: {
    color: '#4F80FF',
    fontSize: 12,
    fontWeight: '600',
  },

  signatureDate: {
    color: '#6B7280',
    fontSize: 10,
    marginTop: 2,
  },

  zoomControls: {
    position: 'absolute',
    right: 16,
    top: '50%',
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 8,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },

  zoomButton: {
    padding: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
  },

  zoomText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },

  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },

  actionLeft: {
    flexDirection: 'row',
    gap: 16,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#334155',
    borderRadius: 6,
    gap: 6,
  },

  actionButtonText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
  },

  actionRight: {
    flexDirection: 'row',
    gap: 12,
  },

  signButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    gap: 6,
  },

  signButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    gap: 6,
  },

  approveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  declineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    gap: 6,
  },

  declineButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  forwardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F80FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    gap: 6,
  },

  forwardButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: '#9CA3AF',
    fontSize: 16,
    marginTop: 16,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  errorTitle: {
    color: '#EF4444',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },

  errorMessage: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },

  retryButton: {
    backgroundColor: '#4F80FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
