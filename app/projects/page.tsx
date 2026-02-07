"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadProjects } from "@/lib/storage";
import { Project } from "@/lib/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  return (
    <div className="min-h-screen bg-shell">
      <header className="px-6 py-6 border-b border-ink/10 bg-white/70 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-ink/50">
              Weblive AI
            </p>
            <h1 className="text-2xl md:text-3xl font-display">Projects</h1>
          </div>
          <Link
            className="text-sm font-medium text-accent hover:text-accentDark"
            href="/"
          >
            Back to generator
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {projects.length === 0 ? (
          <div className="bg-white shadow-soft rounded-3xl p-6 border border-ink/5">
            <p className="text-ink/70">No projects saved yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/?projectId=${project.id}`}
                className="bg-white shadow-soft rounded-3xl p-5 border border-ink/5 hover:border-accent transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-display">
                      {project.inputs.businessName || "Untitled"}
                    </h2>
                    <p className="text-sm text-ink/60">
                      {project.inputs.category} • {project.inputs.city} • {new Date(
                        project.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.3em] text-ink/40">
                    Open
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
