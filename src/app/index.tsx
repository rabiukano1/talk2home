import { useState } from 'react';
import { Redirect } from 'expo-router';

let firstLaunch = true;

export default function Index() {
  const [first] = useState(() => firstLaunch);
  if (first) {
    firstLaunch = false;
    return <Redirect href="/onboarding" />;
  }
  return <Redirect href="/(tabs)" />;
}
