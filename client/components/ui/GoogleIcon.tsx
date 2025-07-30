import React from 'react';
import { Image } from 'react-native';

interface GoogleIconProps {
  size?: number;
}

export function GoogleIcon({ size = 24 }: GoogleIconProps) {
  return (
    <Image
      source={require('../assets/images/google_logo.png')}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}