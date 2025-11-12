import { NextResponse } from "next/server";
import { readProjects } from "app/utils/fileUtils";

export async function GET() {
  const projects = readProjects();
  return NextResponse.json(projects);
}
