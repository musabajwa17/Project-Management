"use client";

import React, { useState } from "react";
import type { Project } from "./ProjectForm";

type Task = { id: string; name: string; status: string };

export default function ProjectList({
  projects,
  onProjectsUpdate,
}: {
  projects: Project[];
  onProjectsUpdate: (projects: Project[]) => void;
}) {
    console.log(projects)
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [loadingNotify, setLoadingNotify] = useState<Record<string, boolean>>({});
  const [addingTask, setAddingTask] = useState<Record<string, boolean>>({});
  const [taskName, setTaskName] = useState<Record<string, string>>({});
  const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({});

  const toggleOpen = (id: string) => setOpen((s) => ({ ...s, [id]: !s[id] }));

  const notify = async (id: string) => {
    setLoadingNotify((s) => ({ ...s, [id]: true }));
    try {
      const res = await fetch(`/api/projects/${id}/notify`, { method: "POST" });
      const json = await res.json();
      alert(json.message || json.error || "Done");
    } catch (err) {
      console.error(err);
      alert("Notify failed");
    } finally {
      setLoadingNotify((s) => ({ ...s, [id]: false }));
    }
  };

  const addTask = async (projectId: string) => {
    const name = taskName[projectId]?.trim();
    if (!name) return;

    setAddingTask((s) => ({ ...s, [projectId]: true }));

    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const j = await res.json();
        alert(j.error || "Failed to add task");
      } else {
        const projRes = await fetch("/api/projects");
        const projJson = await projRes.json();
        onProjectsUpdate(projJson.projects || []);
        setTaskName((s) => ({ ...s, [projectId]: "" }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add task");
    } finally {
      setAddingTask((s) => ({ ...s, [projectId]: false }));
    }
  };

const updateTaskStatus = async (
  taskId: string,
  projectId: string,
  status: string
) => {
    console.log("Task Id", taskId)
  // Optimistic UI update
  onProjectsUpdate(
    projects.map((p) =>
      p.id === projectId
        ? {
            ...p,
            tasks: (p.tasks || []).map((t: Task) =>
              t.id === taskId ? { ...t, status } : t
            ),
          }
        : p
    )
  );

  setUpdatingStatus((s) => ({ ...s, [taskId]: true }));

  try {
    const res = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to update task status");
    }

    const updatedTask = await res.json();
    // Optional: update local state with returned task to ensure sync
    onProjectsUpdate(
      projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              tasks: (p.tasks || []).map((t: Task) =>
                t.id === taskId ? { ...t, ...updatedTask.task } : t
              ),
            }
          : p
      )
    );
  } catch (err: any) {
    console.error(err);
    alert("Failed to update task status. Refreshing data...");

    // Refetch projects to sync state
    const projRes = await fetch("/api/projects");
    const projJson = await projRes.json();
    onProjectsUpdate(projJson.projects || []);
  } finally {
    setUpdatingStatus((s) => ({ ...s, [taskId]: false }));
  }
};


  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Projects</h2>

      {projects.length === 0 && <div>No projects yet</div>}

      {projects.map((p) => (
        <div key={p.id} className="border p-3 rounded mb-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-gray-600">
                {p.client_name} ({p.client_email})
              </div>
              <div className="text-sm">
                Deadline: {p.deadline ? new Date(p.deadline).toLocaleDateString() : "—"}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <button onClick={() => toggleOpen(p.id)} className="px-2 py-1 border rounded text-sm">
                {open[p.id] ? "Hide" : "Show"}
              </button>

              <button
                onClick={() => notify(p.id)}
                disabled={Boolean(loadingNotify[p.id])}
                className="px-3 py-1 rounded text-sm bg-green-600 text-white disabled:opacity-60"
              >
                {loadingNotify[p.id] ? "Sending..." : "Notify Me"}
              </button>
            </div>
          </div>

          {open[p.id] && (
            <div className="mt-3">
              <div className="mb-2">
                <strong>Tasks</strong>
              </div>

              {(p.tasks || []).length === 0 ? (
                <div className="text-gray-500 mb-2">No tasks yet</div>
              ) : (
                <div>
                  {(p.tasks || []).map((t: Task) => (
                    <div key={t.id} className="flex items-center justify-between p-2 border-b">
                      <div>{t.name}</div>
                      <div className="flex items-center gap-2">
                        <select
                          value={t.status}
                          onChange={(e) => updateTaskStatus(t.id, p.id, e.target.value)}
                          disabled={Boolean(updatingStatus[t.id])}
                          className="border px-2 py-1 rounded"
                        >
                          <option value="todo">To do</option>
                          <option value="in-progress">In progress</option>
                          <option value="done">Done</option>
                        </select>

                        {updatingStatus[t.id] && (
                          <span className="text-sm text-gray-500">Updating...</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-2 flex gap-2">
                <input
                  placeholder="New task name"
                  value={taskName[p.id] || ""}
                  onChange={(e) => setTaskName((s) => ({ ...s, [p.id]: e.target.value }))}
                  className="border px-2 py-1 rounded flex-1"
                />
                <button
                  onClick={() => addTask(p.id)}
                  disabled={Boolean(addingTask[p.id])}
                  className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-60"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
