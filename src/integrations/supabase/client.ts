import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wixwdkgxjyirbsnnqpxs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpeHdka2d4anlpcmJzbm5xcHhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMTU2NDcsImV4cCI6MjA4OTg5MTY0N30.rOeGFPZPeQbpBc1ogBQCOjNi2v1yq_OfRjaJ9SvGhfY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
