import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import dayjs from "dayjs";
import { useTheme } from "../../theme";

// 文字列用のDateField
type StringDateFieldProps = {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  returnType: 'string';
};

// Date型用のDateField
type DateDateFieldProps = {
  label?: string;
  value?: Date;
  onChange: (value: Date) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  returnType: 'date';
};

type Props = StringDateFieldProps | DateDateFieldProps;

export function DateField({
  label = "日付",
  value,
  onChange,
  placeholder = "YYYY-MM-DD",
  required = false,
  disabled = false,
  error,
  returnType,
}: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // 内部では常に文字列として管理
  const getInitialTextValue = useCallback(() => {
    if (typeof value === 'string' && value) {
      return value;
    }
    if (value instanceof Date) {
      return dayjs(value).format("YYYY-MM-DD");
    }
    return "";
  }, [value]);

  const [textValue, setTextValue] = useState(getInitialTextValue());

  // valueが外部から変更された場合の処理
  useEffect(() => {
    const newTextValue = getInitialTextValue();
    setTextValue(newTextValue);
  }, [getInitialTextValue]);

  const handleTextChange = (text: string) => {
    if (disabled) return;

    // 数字以外の文字を除去
    const numbersOnly = text.replace(/\D/g, '');

    // ハイフンを自動挿入
    let formattedText = '';
    if (numbersOnly.length >= 1) {
      formattedText += numbersOnly.substring(0, 4);
    }
    if (numbersOnly.length >= 5) {
      formattedText += '-' + numbersOnly.substring(4, 6);
    }
    if (numbersOnly.length >= 7) {
      formattedText += '-' + numbersOnly.substring(6, 8);
    }

    setTextValue(formattedText);

    // YYYY-MM-DD形式の日付文字列をパース
    if (formattedText.length === 10 && /^\d{4}-\d{2}-\d{2}$/.test(formattedText)) {
      try {
        const date = dayjs(formattedText + 'T00:00:00').toDate();
        // returnTypeに応じて戻り値を変更
        if (returnType === 'date') {
          (onChange as (value: Date) => void)(date);
        } else {
          (onChange as (value: string) => void)(formattedText);
        }
      } catch {
        // 無効な日付の場合は文字列として渡す
        (onChange as (value: string) => void)(formattedText);
      }
    } else {
      // 不完全な日付の場合は文字列として渡す
      (onChange as (value: string) => void)(formattedText);
    }
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <TextInput
        value={textValue}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        placeholderTextColor={theme.textTertiary}
        style={[
          styles.input,
          disabled && styles.inputDisabled,
          error && styles.inputError
        ]}
        keyboardType="numeric"
        maxLength={10}
        editable={!disabled}
      />

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
  },
  required: {
    color: theme.error,
  },
  input: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.surface,
    color: theme.text,
    fontSize: 16,
    minHeight: 56,
  },
  inputDisabled: {
    opacity: 0.6,
    backgroundColor: theme.surfaceVariant,
  },
  inputError: {
    borderColor: theme.error,
  },
  errorText: {
    color: theme.error,
    fontSize: 14,
    marginTop: 4,
  },
});
