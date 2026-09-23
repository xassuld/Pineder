import React from "react";

type CommunityBasicInfoProps = {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  category: string;
  setCategory: (category: string) => void;
  isPrivate: boolean;
  setIsPrivate: (isPrivate: boolean) => void;
  colors: any;
};

export const CommunityBasicInfo: React.FC<CommunityBasicInfoProps> = ({
  name,
  setName,
  description,
  setDescription,
  category,
  setCategory,
  isPrivate,
  setIsPrivate,
  colors,
}) => {
  const categories = [
    "Programming",
    "Data Science",
    "Mobile Development",
    "Design",
    "DevOps",
    "Product Management",
    "Cybersecurity",
    "AI/ML",
    "Cloud Computing",
    "Other",
  ];

  return (
    <>
      {/* Community Name */}
      <div>
        <label
          htmlFor="name"
          className="block mb-3 text-sm font-semibold"
          style={{ color: colors.text.primary }}
        >
          Community Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., React Developers, Data Science Enthusiasts..."
          className="w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
          style={{
            borderColor: colors.border.primary,
            backgroundColor: colors.background.primary,
            color: colors.text.primary,
          }}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block mb-3 text-sm font-semibold"
          style={{ color: colors.text.primary }}
        >
          Community Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what your community is about, who it's for, and what members can expect..."
          rows={4}
          className="w-full px-4 py-3 transition-all duration-200 border-2 resize-none rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
          style={{
            borderColor: colors.border.primary,
            backgroundColor: colors.background.primary,
            color: colors.text.primary,
          }}
          required
        />
      </div>

      {/* Category and Privacy */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="category"
            className="block mb-3 text-sm font-semibold"
            style={{ color: colors.text.primary }}
          >
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
            style={{
              borderColor: colors.border.primary,
              backgroundColor: colors.background.primary,
              color: colors.text.primary,
            }}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="block mb-3 text-sm font-semibold"
            style={{ color: colors.text.primary }}
          >
            Privacy Settings
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isPrivate"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-5 h-5"
              style={{
                accentColor: colors.accent.primary,
              }}
            />
            <label htmlFor="isPrivate" style={{ color: colors.text.secondary }}>
              Make this community private (invite-only)
            </label>
          </div>
        </div>
      </div>
    </>
  );
};
