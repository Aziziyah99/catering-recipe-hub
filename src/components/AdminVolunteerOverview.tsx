import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface VolunteerHourRow {
  id: string;
  user_id: string;
  entry_date: string;
  completed_hours: number | string | null;
  remaining_hours: number | string | null;
  activity: string | null;
  notes: string | null;
}

interface RoleRow {
  id: string;
  user_id: string;
  email: string | null;
  role: string;
}

interface VolunteerEntry {
  id: string;
  entryDate: string;
  completedHours: number;
  remainingHours: number;
  activity: string;
  notes: string;
}

interface VolunteerGroup {
  userId: string;
  email: string;
  totalCompleted: number;
  totalRemaining: number;
  entries: VolunteerEntry[];
}

const AdminVolunteerOverview = () => {
  const [groups, setGroups] = useState<VolunteerGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const fetchAll = useCallback(async () => {
    setLoading(true);

    const [hoursRes, rolesRes] = await Promise.all([
      supabase.from("volunteer_hours").select("*").order("entry_date", { ascending: false }),
      supabase.rpc("get_user_roles_with_email"),
    ]);

    if (hoursRes.error) {
      toast({
        title: "Failed to load volunteer hours",
        description: hoursRes.error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const emailById = new Map<string, string>();
    ((rolesRes.data as RoleRow[] | null) || []).forEach((r) => {
      if (r.email) emailById.set(r.user_id, r.email);
    });

    const byUser = new Map<string, VolunteerGroup>();
    ((hoursRes.data as VolunteerHourRow[] | null) || []).forEach((r) => {
      const completed = Number(r.completed_hours ?? 0);
      const remaining = Number(r.remaining_hours ?? 0);

      let group = byUser.get(r.user_id);
      if (!group) {
        group = {
          userId: r.user_id,
          email: emailById.get(r.user_id) || r.user_id,
          totalCompleted: 0,
          totalRemaining: 0,
          entries: [],
        };
        byUser.set(r.user_id, group);
      }

      group.totalCompleted += completed;
      group.totalRemaining += remaining;
      group.entries.push({
        id: r.id,
        entryDate: r.entry_date,
        completedHours: completed,
        remainingHours: remaining,
        activity: r.activity ?? "",
        notes: r.notes ?? "",
      });
    });

    setGroups([...byUser.values()].sort((a, b) => b.totalCompleted - a.totalCompleted));
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const grandCompleted = groups.reduce((sum, g) => sum + g.totalCompleted, 0);
  const grandRemaining = groups.reduce((sum, g) => sum + g.totalRemaining, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Volunteer Hours Overview
        </CardTitle>
        <CardDescription>
          All volunteers · {grandCompleted}h completed · {grandRemaining}h remaining
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : groups.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No volunteer hours logged yet.</p>
        ) : (
          <div className="space-y-3">
            {groups.map((g) => (
              <div key={g.userId} className="rounded-lg border">
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => ({ ...prev, [g.userId]: !prev[g.userId] }))}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {g.email[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{g.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {g.entries.length} {g.entries.length === 1 ? "entry" : "entries"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{g.totalCompleted}h done</Badge>
                    <Badge variant="secondary">{g.totalRemaining}h left</Badge>
                    {expanded[g.userId] ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {expanded[g.userId] && (
                  <div className="space-y-2 border-t p-4">
                    {g.entries.map((e) => (
                      <div
                        key={e.id}
                        className="flex flex-col gap-1 rounded-md bg-muted/40 p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium">{e.activity || "Volunteer work"}</p>
                          <p className="text-xs text-muted-foreground">{e.entryDate}</p>
                          {e.notes && (
                            <p className="mt-1 text-xs text-muted-foreground">{e.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-2 text-xs">
                          <span className="font-medium text-primary">{e.completedHours}h done</span>
                          <span className="text-muted-foreground">{e.remainingHours}h left</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={fetchAll} disabled={loading}>
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminVolunteerOverview;
