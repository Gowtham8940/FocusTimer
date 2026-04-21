import React, {useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {ScreenShell} from '../components/common/ScreenShell';
import {useAuthStore} from '../store/authStore';
import {useCategoryStore} from '../store/categoryStore';
import {useNotesStore} from '../store/notesStore';
import {theme} from '../theme/theme';

export function NotesScreen() {
  const [draft, setDraft] = useState('');

  const notes = useNotesStore(state => state.notes);
  const isSyncing = useNotesStore(state => state.isSyncing);
  const lastSyncAt = useNotesStore(state => state.lastSyncAt);
  const addNote = useNotesStore(state => state.addNote);
  const syncToCloud = useNotesStore(state => state.syncToCloud);
  const hydrateFromCloud = useNotesStore(state => state.hydrateFromCloud);

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const userId = useAuthStore(state => state.userId);
  const signInForCloud = useAuthStore(state => state.signInForCloud);
  const signOut = useAuthStore(state => state.signOut);

  const selectedCategoryId = useCategoryStore(state => state.selectedCategoryId);
  const categories = useCategoryStore(state => state.categories);

  const selectedCategoryName = useMemo(
    () => categories.find(category => category.id === selectedCategoryId)?.name,
    [categories, selectedCategoryId],
  );

  const onSaveNote = () => {
    addNote(draft, selectedCategoryId);
    setDraft('');
  };

  const onEnableCloud = async () => {
    try {
      await signInForCloud();
      Alert.alert('Cloud Ready', 'You can now sync notes with Firebase.');
    } catch {
      Alert.alert('Error', 'Unable to sign in for cloud sync.');
    }
  };

  const onSync = async () => {
    if (!userId) {
      Alert.alert('Sign in required', 'Enable cloud first to sync notes.');
      return;
    }

    try {
      await syncToCloud(userId);
      Alert.alert('Synced', 'Notes uploaded to cloud.');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to sync notes.';
      Alert.alert('Sync Failed', message);
    }
  };

  const onRestore = async () => {
    if (!userId) {
      Alert.alert('Sign in required', 'Enable cloud first to restore notes.');
      return;
    }

    try {
      await hydrateFromCloud(userId);
      Alert.alert('Restored', 'Local notes replaced with cloud notes.');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to restore notes.';
      Alert.alert('Restore Failed', message);
    }
  };

  const onDisableCloud = async () => {
    try {
      await signOut();
      Alert.alert('Cloud Disabled', 'You are back to local-only notes.');
    } catch {
      Alert.alert('Error', 'Unable to sign out.');
    }
  };

  return (
    <ScreenShell>
      <View style={styles.section}>
        <Text style={styles.heading}>New Note</Text>
        <Text style={styles.caption}>Category: {selectedCategoryName ?? 'None'}</Text>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Write a quick note"
          placeholderTextColor={theme.colors.mutedText}
          style={styles.input}
          multiline
        />
        <Pressable style={styles.button} onPress={onSaveNote}>
          <Text style={styles.buttonText}>Save Note</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Cloud Sync (Optional)</Text>
        <Text style={styles.caption}>
          {isAuthenticated ? 'Cloud enabled' : 'Local-only mode'}
        </Text>
        {!isAuthenticated ? (
          <Pressable style={styles.button} onPress={onEnableCloud}>
            <Text style={styles.buttonText}>Enable Cloud</Text>
          </Pressable>
        ) : (
          <View style={styles.rowButtons}>
            <Pressable style={styles.button} onPress={onSync} disabled={isSyncing}>
              <Text style={styles.buttonText}>{isSyncing ? 'Syncing...' : 'Sync'}</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={onRestore} disabled={isSyncing}>
              <Text style={styles.buttonText}>Restore</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={onDisableCloud}>
              <Text style={styles.buttonText}>Sign Out</Text>
            </Pressable>
          </View>
        )}
        <Text style={styles.caption}>
          Last sync: {lastSyncAt ? new Date(lastSyncAt).toLocaleString() : 'Never'}
        </Text>
      </View>

      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No notes yet.</Text>}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 14,
  },
  heading: {
    color: theme.colors.text,
    fontWeight: '700',
    marginBottom: 6,
  },
  caption: {
    color: theme.colors.mutedText,
    marginBottom: 8,
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 70,
    marginBottom: 8,
  },
  button: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  rowButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  empty: {
    color: theme.colors.mutedText,
  },
  card: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  text: {
    color: theme.colors.text,
  },
});
