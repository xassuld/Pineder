import { useState } from "react";
import { Community } from "../../../core/lib/data/communities";
import { CommunityFormHeader } from "./CommunityFormHeader";
import { CommunityBasicInfo } from "./CommunityBasicInfo";
import { CommunityTopicsAndRules } from "./CommunityTopicsAndRules";
import { CommunityFormActions } from "./CommunityFormActions";
import { useTheme } from "../../../core/contexts/ThemeContext";

type CommunityCreationFormProps = {
  onSubmit: (
    community: Omit<
      Community,
      "id" | "createdAt" | "members" | "memberIds" | "recentActivity"
    >
  ) => void;
  isOpen: boolean;
  onClose: () => void;
};

export const CommunityCreationForm = ({
  onSubmit,
  isOpen,
  onClose,
}: CommunityCreationFormProps) => {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState("");
  const [rules, setRules] = useState<string[]>(["Be respectful and inclusive"]);
  const [newRule, setNewRule] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [image, setImage] = useState("");

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !description.trim() ||
      !category ||
      topics.length === 0
    ) {
      return;
    }

    const newCommunity = {
      name: name.trim(),
      description: description.trim(),
      category,
      topics,
      status: "new" as const,
      createdBy: "Current User",
      rules,
      isPrivate,
      image: image.trim() || undefined,
    };

    onSubmit(newCommunity);

    // Reset form
    setName("");
    setDescription("");
    setCategory("");
    setTopics([]);
    setRules(["Be respectful and inclusive"]);
    setIsPrivate(false);
    setImage("");

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div
        className="relative w-full max-w-3xl overflow-hidden border shadow-2xl rounded-3xl"
        style={{
          background: `linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 50%, ${colors.background.tertiary} 100%)`,
          borderColor: colors.border.primary,
        }}
      >
        <CommunityFormHeader colors={colors} onClose={onClose} />

        <div className="p-8">
          <form onSubmit={submitForm} className="space-y-6">
            <CommunityBasicInfo
              name={name}
              setName={setName}
              description={description}
              setDescription={setDescription}
              category={category}
              setCategory={setCategory}
              isPrivate={isPrivate}
              setIsPrivate={setIsPrivate}
              colors={colors}
            />

            <CommunityTopicsAndRules
              topics={topics}
              setTopics={setTopics}
              newTopic={newTopic}
              setNewTopic={setNewTopic}
              rules={rules}
              setRules={setRules}
              newRule={newRule}
              setNewRule={setNewRule}
              colors={colors}
            />

            <CommunityFormActions
              image={image}
              setImage={setImage}
              colors={colors}
              onClose={onClose}
              onSubmit={submitForm}
            />
          </form>
        </div>
      </div>
    </div>
  );
};
