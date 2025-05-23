import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the AddScore screen
  return <Redirect href="/(tabs)/AddScoreScreen" />;
}
