import { useState } from "react";
import { VolunteerHourEntry } from "@/types/volunteer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface VolunteerHoursFormProps {
  onSave: (entry: VolunteerHourEntry) => void;
  initial?: VolunteerHourEntry;
  trigger?: React.ReactNode;
}

const today = () => new Date().toISOString().slice(0, 10);

export function VolunteerHoursForm({ onSave, initial, trigger }: VolunteerHoursFormProps) {
  const [open, setOpen] = useState(false);
  const [activity, setActivity] = useState(initial?.activity ?? "");
  const [entryDate, setEntryDate] = useState(initial?.entryDate ?? today());
  const [completedHours, setCompletedHours] = useState(initial?.completedHours ?? 0);
  const [remainingHours, setRemainingHours] = useState(initial?.remainingHours ?? 0);
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const reset = () => {
    if (!initial) {
      setActivity(""); setEntryDate(today()); setCompletedHours(0);
      setRemainingHours(0); setNotes("");
    }
  };

  const handleSubmit = () => {
    if (!activity.trim()) return;
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      entryDate,
      completedHours,
      remainingHours,
      activity,
      notes,
    });
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="lg" className="gap-2 font-display text-base">
            <Plus className="h-5 w-5" /> Log Hours
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {initial ? "Edit Entry" : "Log Volunteer Hours"}
          </DialogTitle>
          <DialogDescription>
            {initial ? "Update your hours entry." : "Record the hours you completed and how many you still need."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label>Activity</Label>
            <Input
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="e.g. Food prep at community kitchen"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Completed (hrs)</Label>
              <Input type="number" min={0} step="0.25" value={completedHours || ""} onChange={(e) => setCompletedHours(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Still Needed (hrs)</Label>
              <Input type="number" min={0} step="0.25" value={remainingHours || ""} onChange={(e) => setRemainingHours(Number(e.target.value))} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." rows={2} />
          </div>

          <Button onClick={handleSubmit} className="w-full font-display text-base" size="lg">
            {initial ? "Update Entry" : "Save Hours"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
