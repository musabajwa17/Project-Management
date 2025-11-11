import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ projectId: string; taskId: string }> }
) {
  try {
    // Unwrap the params Promise
    const { projectId, taskId } = await context.params;

    const { status } = await req.json();
    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("tasks")
      .update({ status })
      .eq("id", taskId)
      .eq("project_id", projectId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ task: data });
  } catch (err: any) {
    console.error("PATCH /api/projects/[projectId]/tasks/[taskId] error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
