import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useCallback } from "react";

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, fetchNotes]);

  const createNote = async (noteData) => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .insert([
          {
            ...noteData,
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setNotes((prev) => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const updateNote = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      setNotes((prev) => prev.map((note) => (note.id === id ? data : note)));
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const deleteNote = async (id) => {
    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      setNotes((prev) => prev.filter((note) => note.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err.message };
    }
  };

  const archiveNote = async (id, archived = true) => {
    return updateNote(id, { archived });
  };

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    archiveNote,
    refetch: fetchNotes,
  };
}
