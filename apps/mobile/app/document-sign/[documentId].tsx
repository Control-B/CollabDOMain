import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';
import {
  ArrowLeft,
  FileText,
  User,
  Clock,
  CheckCircle,
  Share,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import SignatureInterface from '@/components/SignatureInterface';
import { useChatStore } from '@/store/chatStore';

interface DocumentData {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  status: 'pending' | 'signed' | 'completed';
  signers: {
    id: string;
    name: string;
    email: string;
    status: 'pending' | 'signed';
    signedAt?: string;
  }[];
  signatures: {
    id: string;
    signerId: string;
    type: 'signature' | 'initials';
    method: 'draw' | 'type' | 'cursive';
    data: any;
    timestamp: string;
  }[];
}

export default function DocumentSignScreen() {
  const { documentId, documentName, fromChat, channelId } =
    useLocalSearchParams<{
      documentId: string;
      documentName: string;
      fromChat: string;
      channelId: string;
    }>();

  const [showSignatureInterface, setShowSignatureInterface] = useState(false);
  const [signatureMode, setSignatureMode] = useState<'signature' | 'initials'>(
    'signature'
  );
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { addMessage, currentUser } = useChatStore();

  const loadDocumentData = useCallback(async () => {
    try {
      setIsLoading(true);

      const mockDocument: DocumentData = {
        id: documentId,
        name: documentName || 'Service Agreement Contract.pdf',
        type: 'application/pdf',
        size: 1024000,
        uploadedBy: 'Admin User',
        uploadedAt: new Date().toISOString(),
        status: 'pending',
        signers: [
          {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email || 'user@example.com',
            status: 'pending',
          },
          {
            id: 'admin-001',
            name: 'Admin User',
            email: 'admin@example.com',
            status: 'pending',
          },
        ],
        signatures: [],
      };

      setDocumentData(mockDocument);
    } catch (error) {
      console.error('Failed to load document:', error);
      Alert.alert('Error', 'Failed to load document data');
    } finally {
      setIsLoading(false);
    }
  }, [
    documentId,
    documentName,
    currentUser.id,
    currentUser.name,
    currentUser.email,
  ]);

  useEffect(() => {
    loadDocumentData();
  }, [loadDocumentData]);

  const handleSignatureComplete = async (signatureData: any) => {
    if (!documentData) return;

    try {
      const newSignature = {
        id: `sig-${Date.now()}`,
        signerId: currentUser.id,
        type: signatureData.isInitials
          ? ('initials' as const)
          : ('signature' as const),
        method: signatureData.method || ('draw' as const),
        data: signatureData,
        timestamp: new Date().toISOString(),
      };

      const updatedDocument = {
        ...documentData,
        signatures: [...documentData.signatures, newSignature],
        signers: documentData.signers.map((signer) =>
          signer.id === currentUser.id
            ? {
                ...signer,
                status: 'signed' as const,
                signedAt: new Date().toISOString(),
              }
            : signer
        ),
      };

      const allSigned = updatedDocument.signers.every(
        (signer) => signer.status === 'signed'
      );
      if (allSigned) {
        updatedDocument.status = 'completed';
      }

      setDocumentData(updatedDocument);
      setShowSignatureInterface(false);

      if (fromChat === 'true' && channelId) {
        const signatureType = signatureData.isInitials
          ? 'initials'
          : 'signature';
        const statusMessage = {
          id: `msg-${Date.now()}`,
          text: `✅ ${currentUser.name} has added their ${signatureType} to "${
            documentData.name
          }"${
            allSigned
              ? '\n\n🎉 All signatures complete! Document is now ready.'
              : ''
          }`,
          userId: currentUser.id,
          channelId: channelId,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          type: 'text' as const,
        };

        addMessage(channelId, statusMessage);
      }

      Alert.alert(
        'Success',
        `Your ${
          signatureData.isInitials ? 'initials' : 'signature'
        } has been added successfully!${
          allSigned ? '\n\nAll signatures are now complete.' : ''
        }`,
        [
          {
            text: 'OK',
            onPress: () => {
              if (fromChat === 'true') {
                router.back();
              } else {
                router.push('/e-sign');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error saving signature:', error);
      Alert.alert('Error', 'Failed to save signature');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const currentUserSigner = documentData?.signers.find(
    (signer) => signer.id === currentUser.id
  );
  const hasUserSigned = currentUserSigner?.status === 'signed';
  const userSignatures =
    documentData?.signatures.filter((sig) => sig.signerId === currentUser.id) ||
    [];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#151937" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading document...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (showSignatureInterface) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#151937" />

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setShowSignatureInterface(false)}
            style={styles.backButton}
          >
            <ArrowLeft size={22} color="#4F80FF" />
          </TouchableOpacity>
          <View pointerEvents="none" style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {signatureMode === 'signature' ? 'Add Signature' : 'Add Initials'}
            </Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.signatureContainer}>
          <View style={styles.signatureHeader}>
            <Text style={styles.signatureTitle}>{documentData?.name}</Text>

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
            onCancel={() => setShowSignatureInterface(false)}
            documentTitle={documentData?.name}
            mode={signatureMode}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#151937" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={22} color="#4F80FF" />
        </TouchableOpacity>
        <View pointerEvents="none" style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Document Signing</Text>
        </View>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() =>
            Alert.alert('Share', 'Document sharing feature coming soon!')
          }
        >
          <Share size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.documentCard}>
          <View style={styles.documentHeader}>
            <View style={styles.documentIcon}>
              <FileText size={24} color="#4F80FF" />
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentName}>{documentData?.name}</Text>
              <Text style={styles.documentMeta}>
                {formatFileSize(documentData?.size || 0)} • {documentData?.type}
              </Text>
              <Text style={styles.documentDate}>
                Uploaded {formatDate(documentData?.uploadedAt || '')}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  documentData?.status === 'completed' ? '#065F46' : '#7C2D12',
              },
            ]}
          >
            <Text style={styles.statusText}>
              {documentData?.status === 'completed'
                ? 'Completed'
                : 'Pending Signatures'}
            </Text>
          </View>
        </View>

        <View style={styles.userStatusCard}>
          <View style={styles.userStatusHeader}>
            <View style={styles.userIcon}>
              <User size={20} color="#FFFFFF" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Your Status</Text>
              <Text style={styles.userEmail}>{currentUser.name}</Text>
            </View>
            {hasUserSigned && <CheckCircle size={24} color="#10B981" />}
          </View>

          {hasUserSigned ? (
            <View style={styles.signedInfo}>
              <Text style={styles.signedText}>
                ✅ You have signed this document
              </Text>
              {userSignatures.map((signature) => (
                <Text key={signature.id} style={styles.signatureDetail}>
                  • {signature.type} ({signature.method}) -{' '}
                  {formatDate(signature.timestamp)}
                </Text>
              ))}
            </View>
          ) : (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.signButton}
                onPress={() => {
                  setSignatureMode('signature');
                  setShowSignatureInterface(true);
                }}
              >
                <Text style={styles.signButtonText}>Add Signature</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.initialsButton}
                onPress={() => {
                  setSignatureMode('initials');
                  setShowSignatureInterface(true);
                }}
              >
                <Text style={styles.initialsButtonText}>Add Initials</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.signersCard}>
          <Text style={styles.signersTitle}>
            All Signers ({documentData?.signers.length || 0})
          </Text>

          {documentData?.signers.map((signer) => (
            <View key={signer.id} style={styles.signerItem}>
              <View style={styles.signerInfo}>
                <View style={styles.signerAvatar}>
                  <Text style={styles.signerAvatarText}>
                    {signer.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.signerDetails}>
                  <Text style={styles.signerName}>{signer.name}</Text>
                  <Text style={styles.signerEmail}>{signer.email}</Text>
                </View>
              </View>

              <View style={styles.signerStatus}>
                {signer.status === 'signed' ? (
                  <>
                    <CheckCircle size={20} color="#10B981" />
                    <Text style={styles.signedStatusText}>Signed</Text>
                    {signer.signedAt && (
                      <Text style={styles.signedDate}>
                        {formatDate(signer.signedAt)}
                      </Text>
                    )}
                  </>
                ) : (
                  <>
                    <Clock size={20} color="#F59E0B" />
                    <Text style={styles.pendingStatusText}>Pending</Text>
                  </>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151937',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
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
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  shareButton: {
    padding: 8,
    backgroundColor: '#334155',
    borderRadius: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  documentCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  documentIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#334155',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  documentMeta: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 2,
  },
  documentDate: {
    color: '#6B7280',
    fontSize: 11,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  userStatusCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  userStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#4F80FF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userEmail: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  signedInfo: {
    backgroundColor: '#065F46',
    borderRadius: 8,
    padding: 12,
  },
  signedText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  signatureDetail: {
    color: '#6EE7B7',
    fontSize: 12,
    marginLeft: 8,
  },
  actionButtons: {
    gap: 16,
    paddingVertical: 8,
  },
  signButton: {
    backgroundColor: '#4F80FF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 50,
  },
  signButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  initialsButton: {
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4F80FF',
    minHeight: 50,
  },
  initialsButtonText: {
    color: '#4F80FF',
    fontSize: 14,
    fontWeight: '600',
  },
  signersCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    marginBottom: 40, // Extra bottom padding for scroll area
    borderWidth: 1,
    borderColor: '#334155',
  },
  signersTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  signerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    minHeight: 60,
  },
  signerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  signerAvatar: {
    width: 32,
    height: 32,
    backgroundColor: '#4F80FF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  signerAvatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  signerDetails: {
    flex: 1,
  },
  signerName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  signerEmail: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  signerStatus: {
    alignItems: 'flex-end',
  },
  signedStatusText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  pendingStatusText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  signedDate: {
    color: '#6B7280',
    fontSize: 10,
    marginTop: 2,
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
