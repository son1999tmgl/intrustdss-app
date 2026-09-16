import React from 'react';
import { StatusBar } from 'react-native';
import { IntraceMainScreen } from './src';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <IntraceMainScreen onBackToHost={() => console.log('Back pressed from Standalone')} />
    </>
  );
}
