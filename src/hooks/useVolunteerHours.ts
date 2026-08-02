import { useState, useEffect, useCallback } from "react";
import { VolunteerHourEntry } from "@/types/volunteer";
import { supabase } from "@/integrations/supabase/client";

interface VolunteerHourRow {
  id: string;
  user_id: string;
  entry_date: string;
  completed_hours: number | string | null;
  remaining_hours: number | string | null;
  activity: string | null;
  notes: string | null;
  created_at: string;
}

const mapRow = (r: VolunteerHourRow): VolunteerHourEntry => ({
  id: r.id,
  entryDate: r.entry_date,
  completedHours: Number(r.completed_hours ?? 0),
  remainingHours: Number(r.remaining_hours ?? 0),
  activity: r.activity ?? "",
  notes: r.notes ?? "",
});

export function useVolunteerHours() {
  const [entries, setEntries] = useState<VolunteerHourEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    const { data, error } = await supabase
      .from("volunteer_hours")
      .select("*")
      .order("entry_date", { ascending: false });

    if (!error && data) {
      setEntries((data as VolunteerHourRow[]).map(mapRow));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const addEntry = useCallback(async (entry: VolunteerHourEntry) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("volunteer_hours").insert({
      user_id: user.id,
      entry_date: entry.entryDate,
      completed_hours: entry.completedHours,
      remaining_hours: entry.remainingHours,
      activity: entry.activity,
      notes: entry.notes,
    });
    if (!error) fetchEntries();
  }, [fetchEntries]);

  const updateEntry = useCallback(async (entry: VolunteerHourEntry) => {
    const { error } = await supabase
      .from("volunteer_hours")
      .update({
        entry_date: entry.entryDate,
        completed_hours: entry.completedHours,
        remaining_hours: entry.remainingHours,
        activity: entry.activity,
        notes: entry.notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", entry.id);
    if (!error) fetchEntries();
  }, [fetchEntries]);

  const deleteEntry = useCallback(async (id: string) => {
    const { error } = await supabase.from("volunteer_hours").delete().eq("id", id);
    if (!error) setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { entries, loading, addEntry, deleteEntry, updateEntry };
}
