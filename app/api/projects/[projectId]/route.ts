import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ projectId: string }> } // Note: params is a Promise
) {
  try {
    const { projectId } = await context.params; // unwrap the promise

    const { data, error } = await supabase
      .from("projects")
      .select("*, tasks(*)") // get tasks along with project
      .eq("id", projectId)
      .single();

    if (error) throw error;

    return NextResponse.json({ project: data });
  } catch (err: any) {
    console.error("GET /api/projects/[projectId] error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ projectId: string }> } // params is a Promise
) {
  try {
    const { projectId } = await context.params; // unwrap the promise
    const body = await req.json();
    const { title, deadline, client_name, client_email } = body;

    const { data, error } = await supabase
      .from("projects")
      .update({ title, deadline, client_name, client_email })
      .eq("id", projectId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ project: data });
  } catch (err: any) {
    console.error("PATCH /api/projects/[projectId] error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
