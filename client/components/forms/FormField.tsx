import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useTheme } from '../../theme';

interface FormFieldProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'date' | 'picker';
  pickerOptions?: { label: string; value: string }[];
  required?: boolean;
  marginBottom?: number;
}

const createStyles = (theme: any) => StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.surface,
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: theme.text,
    minHeight: 50,
  },
  pickerContainer: {
    backgroundColor: theme.surface,
    borderWidth: 0,
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 50,
    justifyContent: 'center',
  },
  picker: {
    color: theme.text,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
});

export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  type = 'text',
  pickerOptions = [],
  required = false,
  marginBottom = 20,
}: FormFieldProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const labelText = label ? (required ? `${label} *` : label) : '';

  if (type === 'picker') {
    return (
      <View style={{ marginBottom }}>
        {label && <Text style={styles.label}>{labelText}</Text>}
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            value={value}
            onValueChange={onChangeText}
            items={pickerOptions}
            style={{
              inputIOS: styles.picker,
              inputIOSContainer: {
                pointerEvents: 'none',
              },
              inputAndroid: styles.picker,
              inputAndroidContainer: {
                pointerEvents: 'none',
              },
            }}
            placeholder={{ label: placeholder || '選択してください', value: '' }}
            pickerProps={{
              itemStyle: { color: 'black' },
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={{ marginBottom }}>
      <Text style={styles.label}>{labelText}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        keyboardType={type === 'number' ? 'numeric' : 'default'}
      />
    </View>
  );
}