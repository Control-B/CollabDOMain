import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  FileText,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Plus,
  MoreVertical,
  Edit3,
} from 'lucide-react-native';
import { Document, DocumentStatus } from '../types';
import { demoDocuments, searchDocuments } from '../services/demoData';

interface DocumentListProps {
  onDocumentPress: (document: Document) => void;
  onNewDocument?: () => void;
  onDocumentAction?: (document: Document, action: string) => void;
  filter?: {
    status?: DocumentStatus;
    type?: string;
    userId?: string;
  };
  searchQuery?: string;
}

export default function DocumentList({
  onDocumentPress,
  onNewDocument,
  onDocumentAction,
  filter = {},
  searchQuery = '',
}: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedFilter] = useState(filter);

  useEffect(() => {
    loadDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter, searchQuery]);

  const loadDocuments = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
      }

      setLoading(true);
      setError(null);

      // Use demo data instead of API call
      let filteredDocs = [...demoDocuments];

      // Apply search filter
      if (searchQuery.trim()) {
        filteredDocs = searchDocuments(searchQuery);
      }

      // Apply status filter
      if (selectedFilter.status) {
        filteredDocs = filteredDocs.filter(
          (doc) => doc.status === selectedFilter.status
        );
      }

      // Apply type filter
      if (selectedFilter.type) {
        filteredDocs = filteredDocs.filter(
          (doc) => doc.type === selectedFilter.type
        );
      }

      // Apply user filter
      if (selectedFilter.userId) {
        filteredDocs = filteredDocs.filter(
          (doc) =>
            doc.metadata.sender.id === selectedFilter.userId ||
            doc.metadata.recipients.some(
              (recipient) => recipient.id === selectedFilter.userId
            )
        );
      }

      // Simple pagination for demo
      const startIndex = (page - 1) * 20;
      const endIndex = startIndex + 20;
      const paginatedDocs = filteredDocs.slice(startIndex, endIndex);

      if (refresh) {
        setDocuments(paginatedDocs);
      } else {
        setDocuments((prev) => [...prev, ...paginatedDocs]);
      }

      setHasMore(endIndex < filteredDocs.length);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadDocuments(true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadDocuments();
    }
  };

  const handleDocumentAction = async (document: Document, action: string) => {
    console.log(
      'DocumentList: handleDocumentAction called with action:',
      action,
      'document:',
      document.id
    );
    try {
      // If parent component provides action handler, use it
      if (onDocumentAction) {
        console.log('DocumentList: calling parent onDocumentAction');
        onDocumentAction(document, action);
        return;
      }

      // Otherwise, handle locally
      switch (action) {
        case 'download':
          // Demo download - just show success message
          Alert.alert('Download', 'Document downloaded successfully (Demo)');
          break;

        case 'share':
          // Demo share - just show success message
          const recipients = document.metadata?.recipients || [];
          const recipientEmails = recipients
            .map((r) => r.email)
            .filter(Boolean);
          Alert.alert(
            'Success',
            `Document shared with ${recipientEmails.length} recipients (Demo)`
          );
          break;

        case 'delete':
          Alert.alert(
            'Delete Document',
            'Are you sure you want to delete this document?',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                  // Demo delete - remove from local state
                  setDocuments((prev) =>
                    prev.filter((d) => d.id !== document.id)
                  );
                  Alert.alert(
                    'Success',
                    'Document deleted successfully (Demo)'
                  );
                },
              },
            ]
          );
          break;
        default:
          console.log('DocumentList: Unknown action:', action);
          break;
      }
    } catch (err) {
      console.error('DocumentList: Error in handleDocumentAction:', err);
      Alert.alert('Error', `Failed to ${action} document`);
    }
  };

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case 'draft':
        return <FileText size={16} color="#9CA3AF" />;
      case 'pending_review':
        return <Clock size={16} color="#F59E0B" />;
      case 'pending_signature':
        return <AlertCircle size={16} color="#EF4444" />;
      case 'partially_signed':
        return <CheckCircle size={16} color="#10B981" />;
      case 'fully_signed':
        return <CheckCircle size={16} color="#10B981" />;
      case 'completed':
        return <CheckCircle size={16} color="#10B981" />;
      case 'expired':
        return <XCircle size={16} color="#EF4444" />;
      case 'cancelled':
        return <XCircle size={16} color="#6B7280" />;
      default:
        return <FileText size={16} color="#9CA3AF" />;
    }
  };

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case 'draft':
        return '#9CA3AF';
      case 'pending_review':
        return '#F59E0B';
      case 'pending_signature':
        return '#EF4444';
      case 'partially_signed':
        return '#10B981';
      case 'fully_signed':
        return '#10B981';
      case 'completed':
        return '#10B981';
      case 'expired':
        return '#EF4444';
      case 'cancelled':
        return '#6B7280';
      default:
        return '#9CA3AF';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#EF4444';
      case 'high':
        return '#F59E0B';
      case 'medium':
        return '#10B981';
      case 'low':
        return '#9CA3AF';
      default:
        return '#9CA3AF';
    }
  };

  const renderDocumentItem = ({ item: document }: { item: Document }) => (
    <TouchableOpacity
      style={styles.documentItem}
      onPress={() => onDocumentPress(document)}
      activeOpacity={0.7}
    >
      {/* Document Header */}
      <View style={styles.documentHeader}>
        <View style={styles.documentInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.documentTitle} numberOfLines={1}>
              {document.title}
            </Text>
            {document.priority && document.priority !== 'low' && (
              <View
                style={[
                  styles.priorityBadge,
                  { backgroundColor: getPriorityColor(document.priority) },
                ]}
              >
                <Text style={styles.priorityText}>
                  {document.priority.toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.documentType}>
            {document.type
              ? document.type.replace('_', ' ').toUpperCase()
              : 'UNKNOWN'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => {
            Alert.alert('Document Actions', 'Choose an action', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Sign',
                onPress: () => handleDocumentAction(document, 'sign'),
              },
              {
                text: 'Download',
                onPress: () => handleDocumentAction(document, 'download'),
              },
              {
                text: 'Share',
                onPress: () => handleDocumentAction(document, 'share'),
              },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () => handleDocumentAction(document, 'delete'),
              },
            ]);
          }}
        >
          <MoreVertical size={16} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Document Status */}
      <View style={styles.documentStatus}>
        <View style={styles.statusRow}>
          {getStatusIcon(document.status)}
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(document.status) },
            ]}
          >
            {document.status.replace('_', ' ').toUpperCase()}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <User size={12} color="#9CA3AF" />
            <Text style={styles.metaText}>
              {document.metadata?.sender?.fullName || 'Unknown Sender'}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Clock size={12} color="#9CA3AF" />
            <Text style={styles.metaText}>
              {document.createdAt
                ? new Date(document.createdAt).toLocaleDateString()
                : 'Unknown Date'}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <FileText size={12} color="#9CA3AF" />
            <Text style={styles.metaText}>
              {document.content?.pages || 0} pages
            </Text>
          </View>
        </View>
      </View>

      {/* Workflow Progress */}
      {document.workflow && document.workflow.steps && (
        <View style={styles.workflowProgress}>
          <Text style={styles.workflowTitle}>Workflow Progress</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    (document.workflow.currentStep /
                      document.workflow.steps.length) *
                    100
                  }%`,
                  backgroundColor: getStatusColor(document.status),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Step {document.workflow.currentStep || 0} of{' '}
            {document.workflow.steps.length || 0}
          </Text>
        </View>
      )}

      {/* Quick Actions */}
      {document.status &&
        (document.status === 'pending_signature' ||
          document.status === 'partially_signed') && (
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.signButton}
              onPress={() => handleDocumentAction(document, 'sign')}
            >
              <Edit3 size={16} color="#FFFFFF" />
              <Text style={styles.signButtonText}>Sign Document</Text>
            </TouchableOpacity>
          </View>
        )}

      {/* Signatures */}
      {document.signatures && document.signatures.length > 0 && (
        <View style={styles.signaturesSection}>
          <Text style={styles.signaturesTitle}>
            Signatures ({document.signatures.length})
          </Text>
          <View style={styles.signaturesList}>
            {document.signatures.slice(0, 3).map((signature, index) => (
              <View key={signature.id} style={styles.signatureItem}>
                <Text style={styles.signatureName}>
                  {signature.user?.fullName || 'Unknown User'}
                </Text>
                <Text style={styles.signatureDate}>
                  {new Date(signature.timestamp).toLocaleDateString()}
                </Text>
              </View>
            ))}
            {document.signatures.length > 3 && (
              <Text style={styles.moreSignatures}>
                +{document.signatures.length - 3} more
              </Text>
            )}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <FileText size={48} color="#6B7280" />
      <Text style={styles.emptyTitle}>No Documents Found</Text>
      <Text style={styles.emptyMessage}>
        {searchQuery
          ? `No documents match "${searchQuery}"`
          : 'Get started by creating your first document'}
      </Text>
      {onNewDocument && (
        <TouchableOpacity style={styles.createButton} onPress={onNewDocument}>
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Create Document</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;

    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#4F80FF" />
        <Text style={styles.loadingFooterText}>Loading more documents...</Text>
      </View>
    );
  };

  if (error && documents.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <AlertCircle size={48} color="#EF4444" />
        <Text style={styles.errorTitle}>Failed to Load Documents</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => loadDocuments(true)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Actions */}
      <View style={styles.headerActions}>
        <View style={styles.filterSection}>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={16} color="#9CA3AF" />
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {onNewDocument && (
          <TouchableOpacity
            style={styles.newDocumentButton}
            onPress={onNewDocument}
          >
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.newDocumentButtonText}>New Document</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Documents List */}
      <FlatList
        data={documents}
        renderItem={renderDocumentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#4F80FF']}
            tintColor="#4F80FF"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        ListFooterComponentStyle={styles.footerStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151937',
  },

  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },

  filterSection: {
    flexDirection: 'row',
    gap: 8,
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#334155',
    borderRadius: 6,
    gap: 6,
  },

  filterButtonText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
  },

  newDocumentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    gap: 6,
  },

  newDocumentButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },

  documentItem: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },

  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  documentInfo: {
    flex: 1,
    marginRight: 12,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  documentTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },

  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  priorityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },

  documentType: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },

  moreButton: {
    padding: 4,
  },

  documentStatus: {
    marginBottom: 12,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
    textTransform: 'uppercase',
  },

  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  metaText: {
    color: '#9CA3AF',
    fontSize: 11,
    marginLeft: 4,
  },

  workflowProgress: {
    marginBottom: 12,
  },

  workflowTitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
  },

  progressBar: {
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
    marginBottom: 4,
  },

  progressFill: {
    height: '100%',
    borderRadius: 2,
  },

  progressText: {
    color: '#9CA3AF',
    fontSize: 11,
  },

  signaturesSection: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 12,
  },

  signaturesTitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },

  signaturesList: {
    gap: 6,
  },

  signatureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  signatureName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
  },

  signatureDate: {
    color: '#9CA3AF',
    fontSize: 10,
  },

  moreSignatures: {
    color: '#6B7280',
    fontSize: 10,
    fontStyle: 'italic',
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },

  emptyTitle: {
    color: '#9CA3AF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },

  emptyMessage: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },

  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F80FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },

  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  loadingFooter: {
    alignItems: 'center',
    paddingVertical: 16,
  },

  loadingFooterText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 8,
  },

  footerStyle: {
    marginTop: 16,
  },

  quickActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },

  signButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },

  signButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
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
