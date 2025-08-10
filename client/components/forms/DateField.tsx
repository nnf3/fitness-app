import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import dayjs from "dayjs";

type Props = {
  label?: string;
  value?: Date;
  onChange: (d: Date) => void;
  mode?: "date" | "time";
};

export function DateField({
  label = "日付",
  value,
  onChange,
  mode = "date",
}: Props) {
  const [textValue, setTextValue] = useState(
    value ? dayjs(value).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD")
  );

  const handleTextChange = (text: string) => {
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
      // 時間を00:00に設定（タイムゾーン変換なし）
      const date = dayjs(formattedText + 'T00:00:00').toDate();
      onChange(date);
    }
  };

  const displayText = value
    ? dayjs(value).format("YYYY-MM-DD")
    : "YYYY-MM-DD";

  return (
    <View style={{ gap: 6 }}>
      {label ? <Text style={{ color: "#9AA0A6" }}>{label}</Text> : null}

      <TextInput
        value={textValue}
        onChangeText={handleTextChange}
        placeholder={displayText}
        placeholderTextColor="#666"
        style={{
          padding: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#3C4043",
          backgroundColor: "#202124",
          color: "white",
          fontSize: 18,
          minHeight: 56,
        }}
        keyboardType="numeric"
        maxLength={10}
      />
    </View>
  );
}
