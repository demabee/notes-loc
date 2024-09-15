import { db, storage } from '@/config/firebaseConfig';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { useCallback, useEffect, useState } from 'react';

// type Note = {
//   id: string;
//   title: string;
//   content: string;
// };

export const useGetAllNotes = () => {
  const [notes, setNotes] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const notesCollection = collection(db, 'notes');
      const querySnapshot = await getDocs(notesCollection);

      const notesData: any = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<any, 'id'>),
      }));

      setNotes(notesData);
    } catch (error: any) {
      setError('Failed to fetch notes');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, []);

  return {
    notes,
    fetchNotes,
    loading,
    error,
  };
};

export const useGetNote = (id: string) => {
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNote = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const noteDoc = doc(db, 'notes', id);
      const docSnapshot = await getDoc(noteDoc);

      if (docSnapshot.exists()) {
        setNote({
          id: docSnapshot.id,
          ...docSnapshot.data()
        });
      } else {
        setError('Note not found');
      }
    } catch (error: any) {
      setError('Failed to fetch note');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchNote();
    }
  }, [id, fetchNote]);

  return {
    note,
    loading,
    error,
  };
}

export const useAddNote = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addNote = useCallback(async (title: string, content: string, createdAt: Date, location: any) => {
    setLoading(true);
    setError(null);

    try {
      const notesCollection = collection(db, 'notes');
      const docRef = await addDoc(notesCollection, {
        title,
        content,
        createdAt,
        location
      });
      console.log('useAddNote', docRef);
      return docRef.id;
    } catch (error: any) {
      setError('Failed to add note');
      console.error('useAddNote error', error)
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    addNote,
    loading,
    error,
  };
};

export const useUpdateNote = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateNote = useCallback(async (id: string, updates: Partial<{ title: string; content: string; createdAt: Date; location: any, imageUri: string }>) => {
    setLoading(true);
    setError(null);

    try {
      const noteDoc = doc(db, 'notes', id);
      await updateDoc(noteDoc, updates);
      return {
        success: true,
        message: 'Successfully updated note'
      }
    } catch (error: any) {
      setError('Failed to update note');
      return {
        success: false,
        message: 'Error updating note'
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateNote,
    loading,
    error,
  };
};

export const useDeleteNote = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteNote = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const noteDoc = doc(db, 'notes', id);
      const res = await deleteDoc(noteDoc);
      console.log('useDeleteNote', res)
    } catch (error: any) {
      setError('Failed to delete note');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deleteNote,
    loading,
    error,
  };
};

export const useUploadImage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(async (imageUri: string, noteId: string) => {
    setLoading(true);
    setError(null);

    try {
      const blob: Blob = await fetch(imageUri).then(response => response.blob());

      const storage = getStorage();
      const storageRef = ref(storage, `notes_images/${noteId}`);


      const uploadTask = await uploadBytesResumable(storageRef, blob);
      const downloadURL = await getDownloadURL(uploadTask.ref);

      return downloadURL;
    } catch (error: any) {
      setError('Failed to upload image');
      console.error('useUploadImage error', error)
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    uploadImage,
    loading,
    error,
  };
}