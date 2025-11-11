"use client";

import React, { useEffect, useState } from "react";
import ProjectForm, { Project } from "../components/ProjectForm";
import ProjectList from "../components/ProjectList";

export default function Page() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchProjects() {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const json = await res.json();
      setProjects(json.projects || []);
    } catch (err) {
      console.error(err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mini Project Manager</h1>

      <ProjectForm
        onCreated={(updated) => {
          setProjects(updated);
        }}
      />

      <hr className="my-6" />

      {loading ? (
        <div>Loading projects...</div>
      ) : (
        <ProjectList projects={projects} onProjectsUpdate={(p) => setProjects(p)} />
      )}
    </main>
  );
}
