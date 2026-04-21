import React, {useMemo, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {ScreenShell} from '../components/common/ScreenShell';
import {useCategoryStore} from '../store/categoryStore';
import {theme} from '../theme/theme';
import {Category} from '../types/models';
import {RootStackParamList} from '../types/navigation';

export function CategoryManagerScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const categories = useCategoryStore(state => state.categories);
  const selectedCategoryId = useCategoryStore(state => state.selectedCategoryId);
  const selectedSubcategoryId = useCategoryStore(
    state => state.selectedSubcategoryId,
  );
  const addCategory = useCategoryStore(state => state.addCategory);
  const addSubcategory = useCategoryStore(state => state.addSubcategory);
  const setSelectedCategory = useCategoryStore(state => state.setSelectedCategory);
  const setSelectedSubcategory = useCategoryStore(
    state => state.setSelectedSubcategory,
  );

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  const selectedCategory = useMemo(
    () => categories.find(category => category.id === selectedCategoryId),
    [categories, selectedCategoryId],
  );

  const onAddCategory = () => {
    addCategory(newCategoryName);
    setNewCategoryName('');
  };

  const onAddSubcategory = () => {
    if (!selectedCategory) {
      return;
    }

    addSubcategory(selectedCategory.id, newSubcategoryName);
    setNewSubcategoryName('');
  };

  const renderCategoryItem = ({item}: {item: Category}) => {
    const isSelected = item.id === selectedCategoryId;
    return (
      <Pressable
        style={[styles.item, isSelected && styles.selectedItem]}
        onPress={() => setSelectedCategory(item.id)}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>
          {item.subcategories.length} subcategories
        </Text>
      </Pressable>
    );
  };

  return (
    <ScreenShell>
      <View style={styles.block}>
        <Text style={styles.label}>Add Category</Text>
        <TextInput
          value={newCategoryName}
          onChangeText={setNewCategoryName}
          placeholder="e.g. Revision"
          placeholderTextColor={theme.colors.mutedText}
          style={styles.input}
        />
        <Pressable style={styles.actionButton} onPress={onAddCategory}>
          <Text style={styles.actionText}>Save Category</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionHeading}>Choose Category</Text>
      <FlatList
        data={categories}
        keyExtractor={item => item.id}
        renderItem={renderCategoryItem}
        style={styles.list}
      />

      <View style={styles.block}>
        <Text style={styles.label}>Add Subcategory</Text>
        <TextInput
          value={newSubcategoryName}
          onChangeText={setNewSubcategoryName}
          placeholder={
            selectedCategory
              ? `for ${selectedCategory.name}`
              : 'select a category first'
          }
          placeholderTextColor={theme.colors.mutedText}
          editable={Boolean(selectedCategory)}
          style={[
            styles.input,
            !selectedCategory && {opacity: 0.6},
          ]}
        />
        <Pressable
          style={styles.actionButton}
          onPress={onAddSubcategory}
          disabled={!selectedCategory}>
          <Text style={styles.actionText}>Save Subcategory</Text>
        </Pressable>
      </View>

      {!!selectedCategory?.subcategories.length && (
        <View style={styles.block}>
          <Text style={styles.label}>Choose Subcategory</Text>
          <View style={styles.pills}>
            {selectedCategory.subcategories.map(subcategory => {
              const isSelected = subcategory.id === selectedSubcategoryId;
              return (
                <Pressable
                  key={subcategory.id}
                  style={[styles.pill, isSelected && styles.selectedPill]}
                  onPress={() => setSelectedSubcategory(subcategory.id)}>
                  <Text style={styles.pillText}>{subcategory.name}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      <Pressable
        style={[styles.actionButton, styles.backButton]}
        onPress={() => navigation.navigate('Timer')}>
        <Text style={styles.actionText}>Back To Timer</Text>
      </Pressable>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  block: {
    marginBottom: 14,
  },
  label: {
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionHeading: {
    color: theme.colors.text,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: theme.colors.surface,
    marginBottom: 8,
  },
  actionButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  actionText: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  list: {
    maxHeight: 200,
    marginBottom: 14,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: 10,
  },
  selectedItem: {
    backgroundColor: '#111111',
  },
  title: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    color: theme.colors.mutedText,
    marginTop: 4,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: theme.colors.surface,
  },
  selectedPill: {
    borderColor: theme.colors.text,
  },
  pillText: {
    color: theme.colors.text,
    fontSize: 12,
  },
  backButton: {
    marginTop: 4,
  },
});
