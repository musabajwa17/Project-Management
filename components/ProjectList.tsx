// "use client";

// import React, { useState } from "react";
// import type { Project } from "./ProjectForm";

// type Task = { id: string; name: string; status: string };

// export default function ProjectList({
//   projects,
//   onProjectsUpdate,
// }: {
//   projects: Project[];
//   onProjectsUpdate: (projects: Project[]) => void;
// }) {
//     console.log(projects)
//   const [open, setOpen] = useState<Record<string, boolean>>({});
//   const [loadingNotify, setLoadingNotify] = useState<Record<string, boolean>>({});
//   const [addingTask, setAddingTask] = useState<Record<string, boolean>>({});
//   const [taskName, setTaskName] = useState<Record<string, string>>({});
//   const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({});

//   const toggleOpen = (id: string) => setOpen((s) => ({ ...s, [id]: !s[id] }));

//   const notify = async (id: string) => {
//     setLoadingNotify((s) => ({ ...s, [id]: true }));
//     try {
//       const res = await fetch(`/api/projects/${id}/notify`, { method: "POST" });
//       const json = await res.json();
//       alert(json.message || json.error || "Done");
//     } catch (err) {
//       console.error(err);
//       alert("Notify failed");
//     } finally {
//       setLoadingNotify((s) => ({ ...s, [id]: false }));
//     }
//   };

//   const addTask = async (projectId: string) => {
//     const name = taskName[projectId]?.trim();
//     if (!name) return;

//     setAddingTask((s) => ({ ...s, [projectId]: true }));

//     try {
//       const res = await fetch(`/api/projects/${projectId}/tasks`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name }),
//       });

//       if (!res.ok) {
//         const j = await res.json();
//         alert(j.error || "Failed to add task");
//       } else {
//         const projRes = await fetch("/api/projects");
//         const projJson = await projRes.json();
//         onProjectsUpdate(projJson.projects || []);
//         setTaskName((s) => ({ ...s, [projectId]: "" }));
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Failed to add task");
//     } finally {
//       setAddingTask((s) => ({ ...s, [projectId]: false }));
//     }
//   };

// const updateTaskStatus = async (
//   taskId: string,
//   projectId: string,
//   status: string
// ) => {
//     console.log("Task Id", taskId)
//   // Optimistic UI update
//   onProjectsUpdate(
//     projects.map((p) =>
//       p.id === projectId
//         ? {
//             ...p,
//             tasks: (p.tasks || []).map((t: Task) =>
//               t.id === taskId ? { ...t, status } : t
//             ),
//           }
//         : p
//     )
//   );

//   setUpdatingStatus((s) => ({ ...s, [taskId]: true }));

//   try {
//     const res = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ status }),
//     });

//     if (!res.ok) {
//       const errorData = await res.json();
//       throw new Error(errorData.error || "Failed to update task status");
//     }

//     const updatedTask = await res.json();
//     // Optional: update local state with returned task to ensure sync
//     onProjectsUpdate(
//       projects.map((p) =>
//         p.id === projectId
//           ? {
//               ...p,
//               tasks: (p.tasks || []).map((t: Task) =>
//                 t.id === taskId ? { ...t, ...updatedTask.task } : t
//               ),
//             }
//           : p
//       )
//     );
//   } catch (err: any) {
//     console.error(err);
//     alert("Failed to update task status. Refreshing data...");

//     // Refetch projects to sync state
//     const projRes = await fetch("/api/projects");
//     const projJson = await projRes.json();
//     onProjectsUpdate(projJson.projects || []);
//   } finally {
//     setUpdatingStatus((s) => ({ ...s, [taskId]: false }));
//   }
// };


//   return (
//     <div>
//       <h2 className="text-lg font-semibold mb-3">Projects</h2>

//       {projects.length === 0 && <div>No projects yet</div>}

//       {projects.map((p) => (
//         <div key={p.id} className="border p-3 rounded mb-3">
//           <div className="flex justify-between items-start">
//             <div>
//               <div className="font-semibold">{p.title}</div>
//               <div className="text-sm text-gray-600">
//                 {p.client_name} ({p.client_email})
//               </div>
//               <div className="text-sm">
//                 Deadline: {p.deadline ? new Date(p.deadline).toLocaleDateString() : "—"}
//               </div>
//             </div>

//             <div className="flex flex-col items-end gap-2">
//               <button onClick={() => toggleOpen(p.id)} className="px-2 py-1 border rounded text-sm">
//                 {open[p.id] ? "Hide" : "Show"}
//               </button>

//               <button
//                 onClick={() => notify(p.id)}
//                 disabled={Boolean(loadingNotify[p.id])}
//                 className="px-3 py-1 rounded text-sm bg-green-600 text-white disabled:opacity-60"
//               >
//                 {loadingNotify[p.id] ? "Sending..." : "Notify Me"}
//               </button>
//             </div>
//           </div>

//           {open[p.id] && (
//             <div className="mt-3">
//               <div className="mb-2">
//                 <strong>Tasks</strong>
//               </div>

//               {(p.tasks || []).length === 0 ? (
//                 <div className="text-gray-500 mb-2">No tasks yet</div>
//               ) : (
//                 <div>
//                   {(p.tasks || []).map((t: Task) => (
//                     <div key={t.id} className="flex items-center justify-between p-2 border-b">
//                       <div>{t.name}</div>
//                       <div className="flex items-center gap-2">
//                         <select
//                           value={t.status}
//                           onChange={(e) => updateTaskStatus(t.id, p.id, e.target.value)}
//                           disabled={Boolean(updatingStatus[t.id])}
//                           className="border px-2 py-1 rounded"
//                         >
//                           <option value="todo">To do</option>
//                           <option value="in-progress">In progress</option>
//                           <option value="done">Done</option>
//                         </select>

//                         {updatingStatus[t.id] && (
//                           <span className="text-sm text-gray-500">Updating...</span>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               <div className="mt-2 flex gap-2">
//                 <input
//                   placeholder="New task name"
//                   value={taskName[p.id] || ""}
//                   onChange={(e) => setTaskName((s) => ({ ...s, [p.id]: e.target.value }))}
//                   className="border px-2 py-1 rounded flex-1"
//                 />
//                 <button
//                   onClick={() => addTask(p.id)}
//                   disabled={Boolean(addingTask[p.id])}
//                   className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-60"
//                 >
//                   Add
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }



"use client";

import React, { useState } from "react";

type Task = { id: string; name: string; status: string };
type Project = {
  id: string;
  title: string;
  client_name: string;
  client_email: string;
  deadline: string;
  tasks?: Task[];
};

export default function ProjectList({
  projects = [],
  onProjectsUpdate,
}: {
  projects?: Project[];
  onProjectsUpdate: (projects: Project[]) => void;
}) {
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
    } catch (err) {
      console.error(err);
      alert("Failed to update task status. Refreshing data...");

      const projRes = await fetch("/api/projects");
      const projJson = await projRes.json();
      onProjectsUpdate(projJson.projects || []);
    } finally {
      setUpdatingStatus((s) => ({ ...s, [taskId]: false }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Active Projects
        </h2>
        <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
          {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
        </div>
      </div>

      {projects.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
          <div className="text-6xl mb-4">📋</div>
          <div className="text-gray-500 text-lg">No projects yet</div>
          <div className="text-gray-400 text-sm mt-2">Create your first project to get started!</div>
        </div>
      )}

      {projects.map((p) => (
        <div 
          key={p.id} 
          className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
        >
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2"></div>
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{p.title}</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {(p.tasks || []).filter((t: Task) => t.status === 'done').length}/{(p.tasks || []).length} Done
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-500">👤</span>
                    <span className="font-medium">{p.client_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">✉️</span>
                    <span>{p.client_email}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-orange-500">📅</span>
                  <span className="font-medium text-gray-700">
                    {p.deadline ? new Date(p.deadline).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    }) : "No deadline"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button 
                  onClick={() => toggleOpen(p.id)} 
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  {open[p.id] ? "Hide Tasks ▲" : "Show Tasks ▼"}
                </button>

                <button
                  onClick={() => notify(p.id)}
                  disabled={Boolean(loadingNotify[p.id])}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loadingNotify[p.id] ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span> Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      🔔 Notify Me
                    </span>
                  )}
                </button>
              </div>
            </div>

            {open[p.id] && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-800">Tasks</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent"></div>
                </div>

                {(p.tasks || []).length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="text-4xl mb-2">✨</div>
                    <div className="text-gray-500 font-medium">No tasks yet</div>
                    <div className="text-gray-400 text-sm mt-1">Add your first task below</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {(p.tasks || []).map((t: Task) => (
                      <div 
                        key={t.id} 
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-2 h-2 rounded-full ${
                            t.status === 'done' ? 'bg-green-500' : 
                            t.status === 'in-progress' ? 'bg-yellow-500' : 
                            'bg-gray-400'
                          }`}></div>
                          <span className={`font-medium ${
                            t.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-800'
                          }`}>
                            {t.name}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <select
                            value={t.status}
                            onChange={(e) => updateTaskStatus(t.id, p.id, e.target.value)}
                            disabled={Boolean(updatingStatus[t.id])}
                            className="border-2 border-gray-200 px-3 py-2 rounded-lg font-medium text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="todo">📝 To do</option>
                            <option value="in-progress">⚡ In progress</option>
                            <option value="done">✅ Done</option>
                          </select>

                          {updatingStatus[t.id] && (
                            <span className="text-sm text-purple-600 font-medium animate-pulse">
                              Updating...
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <input
                    placeholder="✨ Add a new task..."
                    value={taskName[p.id] || ""}
                    onChange={(e) => setTaskName((s) => ({ ...s, [p.id]: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && addTask(p.id)}
                    className="border-2 border-gray-200 px-4 py-3 rounded-xl flex-1 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                  <button
                    onClick={() => addTask(p.id)}
                    disabled={Boolean(addingTask[p.id]) || !taskName[p.id]?.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {addingTask[p.id] ? "Adding..." : "Add Task"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}