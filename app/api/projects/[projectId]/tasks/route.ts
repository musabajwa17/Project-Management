import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ projectId: string }> } // <-- params is a Promise now
) {
  try {
    const { projectId } = await context.params; // <-- unwrap the promise

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Task name is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert({ name, project_id: projectId })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ task: data });
  } catch (err: any) {
    console.error("POST /api/projects/[projectId]/tasks error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
