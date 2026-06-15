import { useState, useEffect } from 'react';

const categories = ['Tech', 'Health', 'AI', 'Education', 'Sustainability', 'Business', 'Finance', 'Other'];

export default function IdeaForm({ initialData, onSubmit, submitLabel = 'Submit Idea', loading = false }) {
  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: categories[0],
    tags: '',
    imageURL: '',
    budget: '',
    targetAudience: '',
    problem: '',
    solution: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        shortDescription: initialData.shortDescription || '',
        description: initialData.description || '',
        category: initialData.category || categories[0],
        tags: initialData.tags?.join(', ') || '',
        imageURL: initialData.imageURL || '',
        budget: initialData.budget || '',
        targetAudience: initialData.targetAudience || '',
        problem: initialData.problem || '',
        solution: initialData.solution || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      budget: form.budget ? Number(form.budget) : undefined,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Idea Title *</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="A clear, catchy name for your idea"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Category *</span>
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Short Description *</span>
        </label>
        <input
          type="text"
          name="shortDescription"
          value={form.shortDescription}
          onChange={handleChange}
          placeholder="One-line summary that hooks readers"
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Detailed Description *</span>
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Explain what the product does, who it helps, and why it matters"
          className="textarea textarea-bordered w-full min-h-[120px]"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Problem Statement *</span>
          </label>
          <textarea
            name="problem"
            value={form.problem}
            onChange={handleChange}
            placeholder="What pain point are you solving?"
            className="textarea textarea-bordered w-full min-h-[100px]"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Proposed Solution *</span>
          </label>
          <textarea
            name="solution"
            value={form.solution}
            onChange={handleChange}
            placeholder="How does your idea solve the problem uniquely?"
            className="textarea textarea-bordered w-full min-h-[100px]"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Target Audience *</span>
          </label>
          <input
            type="text"
            name="targetAudience"
            value={form.targetAudience}
            onChange={handleChange}
            placeholder="Who will use or pay for this?"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Estimated Budget (USD, optional)</span>
          </label>
          <input
            type="number"
            name="budget"
            value={form.budget}
            onChange={handleChange}
            placeholder="e.g. 50000"
            className="input input-bordered w-full"
            min={0}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Image URL</span>
          </label>
          <input
            type="url"
            name="imageURL"
            value={form.imageURL}
            onChange={handleChange}
            placeholder="https://example.com/hero-image.jpg"
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Tags (optional, comma separated)</span>
          </label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="SaaS, B2B, Marketplace"
            className="input input-bordered w-full"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="btn btn-primary w-full md:w-auto min-w-[160px]"
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
