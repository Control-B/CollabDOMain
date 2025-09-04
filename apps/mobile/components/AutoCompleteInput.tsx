import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
} from 'react-native';
import { MapPin, Building, X } from 'lucide-react-native';

interface AutoCompleteInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  type: 'address' | 'company' | 'phone';
  suggestions?: string[];
  required?: boolean;
}

// Mock data - in real app, this would come from APIs
const mockCompanies = [
  'Walmart Distribution Center',
  'Amazon Fulfillment Center',
  'Target Store',
  'Home Depot',
  'Costco Wholesale',
  'FedEx Hub',
  'UPS Distribution Center',
  'Best Buy Store',
  'Kroger Supermarket',
  'CVS Pharmacy',
  'Walgreens',
  'Dollar General',
  'H-E-B Grocery',
  'Whole Foods Market',
  "Macy's Department Store",
];

const mockAddresses = [
  '123 Main St, Houston, TX 77001',
  '456 Commerce Dr, Dallas, TX 75201',
  '789 Industrial Blvd, Austin, TX 73301',
  '321 Warehouse Way, San Antonio, TX 78201',
  '654 Distribution Ave, Fort Worth, TX 76101',
  '987 Retail Plaza, El Paso, TX 79901',
  '147 Business Park Dr, Arlington, TX 76001',
  '258 Logistics Ln, Plano, TX 75023',
  '369 Supply Chain St, Irving, TX 75038',
  '741 Freight Rd, Garland, TX 75040',
];

export default function AutoCompleteInput({
  label,
  value,
  onChangeText,
  placeholder,
  type,
  suggestions,
  required = false,
}: AutoCompleteInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const getSuggestionData = () => {
    switch (type) {
      case 'company':
        return mockCompanies;
      case 'address':
        return mockAddresses;
      case 'phone':
        return [];
      default:
        return suggestions || [];
    }
  };

  const handleTextChange = (text: string) => {
    onChangeText(text);

    if (text.length > 1) {
      const suggestionData = getSuggestionData();
      const filtered = suggestionData.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    onChangeText(suggestion);
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, '');

    // Format as (XXX) XXX-XXXX
    if (cleaned.length >= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
        6,
        10
      )}`;
    } else if (cleaned.length >= 3) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return cleaned;
    }
  };

  const handlePhoneChange = (text: string) => {
    if (type === 'phone') {
      const formatted = formatPhoneNumber(text);
      onChangeText(formatted);
    } else {
      handleTextChange(text);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'company':
        return <Building size={16} color="#6B7280" />;
      case 'address':
        return <MapPin size={16} color="#6B7280" />;
      default:
        return null;
    }
  };

  const renderSuggestion = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
    >
      <View style={styles.suggestionContent}>
        {getIcon()}
        <Text style={styles.suggestionText}>{item}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={type === 'phone' ? handlePhoneChange : handleTextChange}
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          keyboardType={type === 'phone' ? 'phone-pad' : 'default'}
          autoCapitalize={type === 'address' ? 'words' : 'sentences'}
          onFocus={() => {
            if (value.length > 1) {
              handleTextChange(value);
            }
          }}
          onBlur={() => {
            setTimeout(() => setShowSuggestions(false), 200);
          }}
        />

        {showSuggestions && value.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              onChangeText('');
              setShowSuggestions(false);
            }}
          >
            <X size={16} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={filteredSuggestions}
            renderItem={renderSuggestion}
            keyExtractor={(item, index) => index.toString()}
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    zIndex: 1000,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#475569',
    paddingRight: 40,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
  suggestionsContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#475569',
    maxHeight: 200,
    zIndex: 1000,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionText: {
    fontSize: 14,
    color: '#E5E7EB',
    marginLeft: 8,
    flex: 1,
  },
});



