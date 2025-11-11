import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: projects, error } = await supabase
      .from("projects")
      .select("*, tasks(*)");

    if (error) throw error;
    return NextResponse.json({ projects });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, deadline, client_name, client_email } = body;

    const { data, error } = await supabase
      .from("projects")
      .insert({ title, deadline, client_name, client_email })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ project: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
