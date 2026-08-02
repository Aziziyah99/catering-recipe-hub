import { useVolunteerHours } from "@/hooks/useVolunteerHours";
import { VolunteerHoursForm } from "@/components/VolunteerHoursForm";
import { VolunteerHoursCard } from "@/components/VolunteerHoursCard";
import { Card, CardContent } from "@/components/ui/card";
import { HeartHandshake, Clock, Hourglass, ListChecks, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";


const fmt = (n: number) => (n % 1 === 0 ? n.toString() : n.toFixed(2));

const VolunteersPage = () => {
  const { entries, loading, addEntry, deleteEntry, updateEntry } = useVolunteerHours();

  const totalCompleted = entries.reduce((sum, e) => sum + e.completedHours, 0);
  // Hours still needed = the most recent entry's remaining figure (latest by date)
  const stillNeeded = entries.length > 0 ? entries[0].remainingHours : 0;
  const required = totalCompleted + stillNeeded;
  const progressPct = required > 0 ? Math.min(100, Math.round((totalCompleted / required) * 100)) : 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b bg-card/60 backdrop-blur-sm">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Volunteer Hours
            </h1>
            <p className="text-sm text-muted-foreground">
              Log the hours you completed and track what's still needed
            </p>
          </div>
          <VolunteerHoursForm onSave={addEntry} />
        </div>
      </header>

      <main className="container mx-auto space-y-6 px-4 py-8">
        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Completed</p>
                <p className="font-display text-3xl font-bold">{fmt(totalCompleted)} <span className="text-base font-normal text-muted-foreground">hrs</span></p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                <Hourglass className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Still Needed</p>
                <p className="font-display text-3xl font-bold">{fmt(stillNeeded)} <span className="text-base font-normal text-muted-foreground">hrs</span></p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <ListChecks className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Entries Logged</p>
                <p className="font-display text-3xl font-bold">{entries.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        {required > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-display text-lg font-semibold">Overall Progress</span>
                <span className="text-sm font-medium text-muted-foreground">{progressPct}%</span>
              </div>
              <Progress value={progressPct} className="h-3" />
              <p className="mt-2 text-sm text-muted-foreground">
                {fmt(totalCompleted)} of {fmt(required)} hours completed toward your goal.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Entries */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : entries.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {entries.map((entry) => (
              <VolunteerHoursCard
                key={entry.id}
                entry={entry}
                onDelete={deleteEntry}
                onUpdate={updateEntry}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <HeartHandshake className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl font-semibold">No hours logged yet</h2>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Start tracking your volunteer hours. Log completed hours and the hours you still need to finish.
            </p>
            <div className="mt-6">
              <VolunteerHoursForm onSave={addEntry} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VolunteersPage;
