export interface VolunteerHourEntry {
  id: string;
  entryDate: string; // ISO date string (yyyy-mm-dd)
  completedHours: number;
  remainingHours: number; // hours still needed to complete
  activity: string;
  notes: string;
}
