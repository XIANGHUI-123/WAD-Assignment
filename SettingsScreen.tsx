import React from 'react';
import {StyleSheet, Text, View, Switch, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {useAppTheme} from './theme';

const SettingsScreen = ({navigation}: any) => {
  const {theme, isDarkMode, toggleDarkMode} = useAppTheme();
  const [notifications, setNotifications] = React.useState(true);
  const [emailAlerts, setEmailAlerts] = React.useState(false);

  const handleClearCache = () => {
    Alert.alert('Cache Cleared', 'All temporary app data has been cleared.');
  };

  return (
    <ScrollView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={styles.sectionTitle}>App Preferences</Text>
      <View style={[styles.card, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
        <View style={styles.settingRow}>
          <Text style={[styles.settingText, {color: theme.colors.text}]}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} trackColor={{false: '#CBD5E1', true: '#4F46E5'}} />
        </View>
        <View style={styles.divider} />
        <View style={styles.settingRow}>
          <Text style={[styles.settingText, {color: theme.colors.text}]}>Push Notifications</Text>
          <Switch value={notifications} onValueChange={setNotifications} trackColor={{false: '#CBD5E1', true: '#4F46E5'}} />
        </View>
        <View style={styles.divider} />
        <View style={styles.settingRow}>
          <Text style={[styles.settingText, {color: theme.colors.text}]}>Email Alerts</Text>
          <Switch value={emailAlerts} onValueChange={setEmailAlerts} trackColor={{false: '#CBD5E1', true: '#4F46E5'}} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Data & Storage</Text>
      <View style={[styles.card, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
        <TouchableOpacity style={styles.actionRow} onPress={handleClearCache}>
          <Text style={[styles.actionText, {color: theme.colors.primary}]}>Clear App Cache</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>About</Text>
      <View style={[styles.card, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
        <View style={styles.infoRow}>
          <Text style={[styles.settingText, {color: theme.colors.text}]}>App Version</Text>
          <Text style={[styles.infoText, {color: theme.colors.mutedText}]}>1.0.4</Text>
        </View>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.actionRow}>
          <Text style={[styles.actionText, {color: theme.colors.primary}]}>Privacy Policy</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.actionRow}>
          <Text style={[styles.actionText, {color: theme.colors.primary}]}>Terms of Service</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  sectionTitle: {fontSize: 14, fontWeight: '600', color: '#94A3B8', marginBottom: 8, marginLeft: 4, marginTop: 12},
  card: {
    borderRadius: 16,
    paddingVertical: 4,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  actionRow: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingText: {fontSize: 16, color: '#334155', fontWeight: '500'},
  actionText: {fontSize: 16, color: '#4F46E5', fontWeight: '500'},
  infoText: {fontSize: 16, color: '#94A3B8'},
  divider: {height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 16},
});
