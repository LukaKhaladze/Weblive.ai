import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { SiteSchema, SeoSchema } from "@/lib/schema";
import { runGeneration } from "@/lib/generator/runGeneration";

function isExpired(expiresAt: string) {
  return new Date(expiresAt).getTime() < Date.now();
}

export async function POST(_: Request, { params }: { params: { token: string } }) {
  const supabaseServer = getSupabaseServer();
  const { data: project, error } = await supabaseServer
    .from("projects")
    .select("id, input, expires_at, share_slug, edit_token")
    .eq("edit_token", params.token)
    .single();

  if (error || !project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (isExpired(project.expires_at)) {
    return NextResponse.json({ error: "Expired" }, { status: 410 });
  }

  const { site, seo } = await runGeneration({
    input: project.input,
    supabaseServer,
    projectId: project.id,
  });

  const siteParsed = SiteSchema.safeParse(site);
  const seoParsed = SeoSchema.safeParse(seo);
  if (!siteParsed.success || !seoParsed.success) {
    return NextResponse.json({ error: "Generator output invalid." }, { status: 500 });
  }

  const { data, error: updateError } = await supabaseServer
    .from("projects")
    .update({
      site: siteParsed.data,
      seo: seoParsed.data,
      status: "generated",
      updated_at: new Date().toISOString(),
    })
    .eq("edit_token", params.token)
    .select("id, input, site, seo, expires_at, share_slug, edit_token, status")
    .single();

  if (updateError || !data) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json(data);
}
