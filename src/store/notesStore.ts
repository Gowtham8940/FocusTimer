import {create} from 'zustand';

import {notesSyncService} from '../services/firebase/notesSyncService';
import {storage} from '../services/storage';
import {Note} from '../types/models';

const NOTES_STORAGE_KEY = 'notes.v1';

function loadLocalNotes(): Note[] {
  try {
    const raw = storage.getString(NOTES_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as Note[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistLocalNotes(notes: Note[]) {
  storage.set(NOTES_STORAGE_KEY, JSON.stringify(notes));
}

interface NotesState {
  notes: Note[];
  isSyncing: boolean;
  lastSyncAt?: number;
  addNote: (text: string, categoryId?: string) => void;
  syncToCloud: (userId: string) => Promise<void>;
  hydrateFromCloud: (userId: string) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: loadLocalNotes(),
  isSyncing: false,
  lastSyncAt: undefined,
  addNote: (text, categoryId) =>
    set(state => {
      const trimmed = text.trim();
      if (!trimmed) {
        return state;
      }

      const now = Date.now();
      const nextNote: Note = {
        id: `${now}`,
        text: trimmed,
        categoryId,
        createdAt: now,
        updatedAt: now,
      };

      const nextNotes = [nextNote, ...state.notes];
      persistLocalNotes(nextNotes);

      return {
        ...state,
        notes: nextNotes,
      };
    }),
  syncToCloud: async userId => {
    set(state => ({...state, isSyncing: true}));
    try {
      const {notes} = get();
      await notesSyncService.syncNotes(userId, notes);
      set(state => ({...state, isSyncing: false, lastSyncAt: Date.now()}));
    } catch {
      set(state => ({...state, isSyncing: false}));
      throw new Error('Failed to sync notes to cloud.');
    }
  },
  hydrateFromCloud: async userId => {
    set(state => ({...state, isSyncing: true}));
    try {
      const cloudNotes = await notesSyncService.fetchNotes(userId);
      persistLocalNotes(cloudNotes);
      set(state => ({
        ...state,
        notes: cloudNotes,
        isSyncing: false,
        lastSyncAt: Date.now(),
      }));
    } catch {
      set(state => ({...state, isSyncing: false}));
      throw new Error('Failed to fetch notes from cloud.');
    }
  },
}));
