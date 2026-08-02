import { VolunteerHourEntry } from "@/types/volunteer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Calendar, Clock, Hourglass } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { VolunteerHoursForm } from "./VolunteerHoursForm";

interface VolunteerHoursCardProps {
  entry: VolunteerHourEntry;
  onDelete: (id: string) => void;
  onUpdate: (entry: VolunteerHourEntry) => void;
}

const fmt = (n: number) => (n % 1 === 0 ? n.toString() : n.toFixed(2));

export function VolunteerHoursCard({ entry, onDelete, onUpdate }: VolunteerHoursCardProps) {
  return (
    <Card className="group animate-fade-in overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-secondary/20 px-2.5 py-0.5 text-xs font-medium text-secondary">
              <Calendar className="h-3 w-3" />
              {new Date(entry.entryDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <CardTitle className="font-display text-xl leading-tight">{entry.activity}</CardTitle>
          </div>
          <div className="flex shrink-0 gap-1">
            <VolunteerHoursForm
              initial={entry}
              onSave={onUpdate}
              trigger={
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                  <AlertDialogDescription>This action cannot be undone. The hours entry will be permanently removed.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(entry.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-primary/5 p-3">
            <div className="flex items-center gap-1.5 text-primary">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Completed</span>
            </div>
            <p className="mt-1 font-display text-2xl font-bold tabular-nums text-primary">
              {fmt(entry.completedHours)}
              <span className="text-sm font-normal text-muted-foreground"> hrs</span>
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Hourglass className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Still Needed</span>
            </div>
            <p className="mt-1 font-display text-2xl font-bold tabular-nums">
              {fmt(entry.remainingHours)}
              <span className="text-sm font-normal text-muted-foreground"> hrs</span>
            </p>
          </div>
        </div>

        {entry.notes && <p className="text-sm text-muted-foreground">{entry.notes}</p>}

        {entry.remainingHours > 0 && (
          <Badge variant="outline" className="text-amber-600 border-amber-500/40">In progress</Badge>
        )}
        {entry.remainingHours <= 0 && entry.completedHours > 0 && (
          <Badge variant="outline" className="text-emerald-600 border-emerald-500/40">Completed</Badge>
        )}
      </CardContent>
    </Card>
  );
}
