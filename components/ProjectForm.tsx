// "use client";

// import React, { useState } from "react";

// export type Project = {
//   id: string;
//   title: string;
//   client_name: string;
//   client_email: string;
//   deadline: string; // YYYY-MM-DD
//   tasks?: { id: string; name: string; status: string }[];
// };

// interface ProjectFormProps {
//   onCreated: (projects: Project[]) => void;
// }

// export default function ProjectForm({ onCreated }: ProjectFormProps) {
//   const [formData, setFormData] = useState({
//     title: "",
//     client_name: "",
//     client_email: "",
//     deadline: "", // always keep this as empty string or YYYY-MM-DD
//   });
//   const [loading, setLoading] = useState(false);

//   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const { name, value } = e.target;
//     setFormData((s) => ({ ...s, [name]: value }));
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch("/api/projects", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         alert(data.error || "Failed to create project");
//         setLoading(false);
//         return;
//       }

//       // refresh projects list
//       const projRes = await fetch("/api/projects");
//       const projJson = await projRes.json();
//       onCreated(projJson.projects || []);

//       // reset form
//       setFormData({ title: "", client_name: "", client_email: "", deadline: "" });
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="p-4 border rounded-md space-y-3">
//       <h2 className="text-lg font-semibold">Create Project</h2>

//       <label className="block">
//         <div className="text-sm">Title</div>
//         <input
//           name="title"
//           value={formData.title}
//           onChange={handleChange}
//           required
//           className="w-full border px-2 py-1 rounded"
//         />
//       </label>

//       <label className="block">
//         <div className="text-sm">Client Name</div>
//         <input
//           name="client_name"
//           value={formData.client_name}
//           onChange={handleChange}
//           required
//           className="w-full border px-2 py-1 rounded"
//         />
//       </label>

//       <label className="block">
//         <div className="text-sm">Client Email</div>
//         <input
//           type="email"
//           name="client_email"
//           value={formData.client_email}
//           onChange={handleChange}
//           required
//           className="w-full border px-2 py-1 rounded"
//         />
//       </label>

//       <label className="block">
//         <div className="text-sm">Deadline</div>
//         <input
//           type="date"
//           name="deadline"
//           // key: empty string or YYYY-MM-DD => browser date picker shows.
//           value={formData.deadline}
//           onChange={handleChange}
//           required
//           className="w-full border px-2 py-1 rounded"
//         />
//       </label>

//       <div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
//         >
//           {loading ? "Creating..." : "Create Project"}
//         </button>
//       </div>
//     </form>
//   );
// }


"use client";

import React, { useState } from "react";

export type Project = {
  id: string;
  title: string;
  client_name: string;
  client_email: string;
  deadline: string; // YYYY-MM-DD
  tasks?: { id: string; name: string; status: string }[];
};

interface ProjectFormProps {
  onCreated: (projects: Project[]) => void;
}

export default function ProjectForm({ onCreated }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    client_name: "",
    client_email: "",
    deadline: "", // always keep this as empty string or YYYY-MM-DD
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to create project");
        setLoading(false);
        return;
      }

      // refresh projects list
      const projRes = await fetch("/api/projects");
      const projJson = await projRes.json();
      onCreated(projJson.projects || []);

      // reset form
      setFormData({ title: "", client_name: "", client_email: "", deadline: "" });
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-xl border border-blue-100">
        <div className="mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Create New Project
          </h2>
          <p className="text-gray-600 mt-2">Fill in the details to get started</p>
        </div>

        <div className="space-y-5">
          <label className="block group">
            <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</span>
              Project Title
            </div>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter project title..."
              className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 bg-white shadow-sm"
            />
          </label>

          <label className="block group">
            <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">2</span>
              Client Name
            </div>
            <input
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              required
              placeholder="Enter client name..."
              className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 bg-white shadow-sm"
            />
          </label>

          <label className="block group">
            <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">3</span>
              Client Email
            </div>
            <input
              type="email"
              name="client_email"
              value={formData.client_email}
              onChange={handleChange}
              required
              placeholder="client@example.com"
              className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 bg-white shadow-sm"
            />
          </label>

          <label className="block group">
            <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">4</span>
              Project Deadline
            </div>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 bg-white shadow-sm"
            />
          </label>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-4 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Project...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Project
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}