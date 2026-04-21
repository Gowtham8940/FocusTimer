import firestore from '@react-native-firebase/firestore';

import {Note} from '../../types/models';

function noteToPayload(note: Note) {
  return {
    text: note.text,
    categoryId: note.categoryId ?? null,
    sessionId: note.sessionId ?? null,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
}

export const notesSyncService = {
  async syncNotes(userId: string, notes: Note[]) {
    const batch = firestore().batch();
    const notesRef = firestore().collection('users').doc(userId).collection('notes');

    notes.forEach(note => {
      const ref = notesRef.doc(note.id);
      batch.set(ref, noteToPayload(note), {merge: true});
    });

    await batch.commit();
  },

  async fetchNotes(userId: string): Promise<Note[]> {
    const snapshot = await firestore()
      .collection('users')
      .doc(userId)
      .collection('notes')
      .orderBy('updatedAt', 'desc')
      .get();

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        text: data.text ?? '',
        categoryId: data.categoryId ?? undefined,
        sessionId: data.sessionId ?? undefined,
        createdAt: data.createdAt ?? Date.now(),
        updatedAt: data.updatedAt ?? Date.now(),
      };
    });
  },
};
