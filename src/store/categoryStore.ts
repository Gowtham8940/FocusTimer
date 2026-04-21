import {create} from 'zustand';

import {DEFAULT_CATEGORIES} from '../constants/categories';
import {Category, Subcategory} from '../types/models';

const initialCategoryId = DEFAULT_CATEGORIES[0]?.id ?? 'others';
const initialSubcategoryId =
  DEFAULT_CATEGORIES[0]?.subcategories[0]?.id ?? undefined;

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

interface CategoryState {
  categories: Category[];
  selectedCategoryId: string;
  selectedSubcategoryId?: string;
  addCategory: (name: string) => void;
  addSubcategory: (categoryId: string, name: string) => void;
  setSelectedCategory: (categoryId: string) => void;
  setSelectedSubcategory: (subcategoryId?: string) => void;
}

export const useCategoryStore = create<CategoryState>(set => ({
  categories: DEFAULT_CATEGORIES,
  selectedCategoryId: initialCategoryId,
  selectedSubcategoryId: initialSubcategoryId,
  addCategory: name =>
    set(state => {
      const trimmed = name.trim();
      if (!trimmed) {
        return state;
      }

      const existing = state.categories.find(
        category => category.name.toLowerCase() === trimmed.toLowerCase(),
      );
      if (existing) {
        return {
          ...state,
          selectedCategoryId: existing.id,
          selectedSubcategoryId: existing.subcategories[0]?.id,
        };
      }

      const baseId = slugify(trimmed) || 'category';
      let nextId = baseId;
      let suffix = 1;
      while (state.categories.some(category => category.id === nextId)) {
        suffix += 1;
        nextId = `${baseId}-${suffix}`;
      }

      const nextCategory: Category = {
        id: nextId,
        name: trimmed,
        subcategories: [],
      };

      return {
        ...state,
        categories: [...state.categories, nextCategory],
        selectedCategoryId: nextId,
        selectedSubcategoryId: undefined,
      };
    }),
  addSubcategory: (categoryId, name) =>
    set(state => {
      const trimmed = name.trim();
      if (!trimmed) {
        return state;
      }

      let selectedSubcategoryId = state.selectedSubcategoryId;

      return {
        ...state,
        categories: state.categories.map(category => {
        if (category.id !== categoryId) {
          return category;
        }

        const existing = category.subcategories.find(
          subcategory => subcategory.name.toLowerCase() === trimmed.toLowerCase(),
        );
        if (existing) {
          selectedSubcategoryId = existing.id;
          return category;
        }

        const baseId = slugify(trimmed) || 'subcategory';
        let nextId = baseId;
        let suffix = 1;
        while (category.subcategories.some(sub => sub.id === nextId)) {
          suffix += 1;
          nextId = `${baseId}-${suffix}`;
        }

        const nextSubcategory: Subcategory = {
          id: nextId,
          name: trimmed,
        };
        selectedSubcategoryId = nextSubcategory.id;

        return {
          ...category,
          subcategories: [...category.subcategories, nextSubcategory],
        };
      }),
        selectedCategoryId:
          state.selectedCategoryId === categoryId
            ? categoryId
            : state.selectedCategoryId,
        selectedSubcategoryId:
          state.selectedCategoryId === categoryId
            ? selectedSubcategoryId
            : state.selectedSubcategoryId,
      };
    }),
  setSelectedCategory: categoryId =>
    set(state => {
      const selectedCategory = state.categories.find(
        category => category.id === categoryId,
      );

      if (!selectedCategory) {
        return state;
      }

      return {
        ...state,
        selectedCategoryId: categoryId,
        selectedSubcategoryId: selectedCategory.subcategories[0]?.id,
      };
    }),
  setSelectedSubcategory: subcategoryId =>
    set(state => ({
      ...state,
      selectedSubcategoryId: subcategoryId,
    })),
}));
