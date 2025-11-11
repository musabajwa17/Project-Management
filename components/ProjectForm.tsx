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
    <form onSubmit={handleSubmit} className="p-4 border rounded-md space-y-3">
      <h2 className="text-lg font-semibold">Create Project</h2>

      <label className="block">
        <div className="text-sm">Title</div>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border px-2 py-1 rounded"
        />
      </label>

      <label className="block">
        <div className="text-sm">Client Name</div>
        <input
          name="client_name"
          value={formData.client_name}
          onChange={handleChange}
          required
          className="w-full border px-2 py-1 rounded"
        />
      </label>

      <label className="block">
        <div className="text-sm">Client Email</div>
        <input
          type="email"
          name="client_email"
          value={formData.client_email}
          onChange={handleChange}
          required
          className="w-full border px-2 py-1 rounded"
        />
      </label>

      <label className="block">
        <div className="text-sm">Deadline</div>
        <input
          type="date"
          name="deadline"
          // key: empty string or YYYY-MM-DD => browser date picker shows.
          value={formData.deadline}
          onChange={handleChange}
          required
          className="w-full border px-2 py-1 rounded"
        />
      </label>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </div>
    </form>
  );
}
