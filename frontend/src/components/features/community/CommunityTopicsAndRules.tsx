import React from "react";
import { Plus, Hash, Shield } from "lucide-react";
import { Button } from "../../../design/system/button";
import { Badge } from "../../../design/system/badge";

type CommunityTopicsAndRulesProps = {
  topics: string[];
  setTopics: (topics: string[]) => void;
  newTopic: string;
  setNewTopic: (topic: string) => void;
  rules: string[];
  setRules: (rules: string[]) => void;
  newRule: string;
  setNewRule: (rule: string) => void;
  colors: any;
};

export const CommunityTopicsAndRules: React.FC<
  CommunityTopicsAndRulesProps
> = ({
  topics,
  setTopics,
  newTopic,
  setNewTopic,
  rules,
  setRules,
  newRule,
  setNewRule,
  colors,
}) => {
  const addTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const removeTopic = (topicToRemove: string) => {
    setTopics(topics.filter((topic) => topic !== topicToRemove));
  };

  const addRule = () => {
    if (newRule.trim() && !rules.includes(newRule.trim())) {
      setRules([...rules, newRule.trim()]);
      setNewRule("");
    }
  };

  const removeRule = (ruleToRemove: string) => {
    setRules(rules.filter((rule) => rule !== ruleToRemove));
  };

  return (
    <>
      {/* Topics */}
      <div>
        <label
          className="block mb-3 text-sm font-semibold"
          style={{ color: colors.text.primary }}
        >
          Topics & Tags
        </label>
        <div className="flex mb-3 space-x-2">
          <input
            type="text"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            placeholder="Add a topic..."
            className="flex-1 px-4 py-2 transition-all duration-200 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
            style={{
              borderColor: colors.border.primary,
              backgroundColor: colors.background.primary,
              color: colors.text.primary,
            }}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addTopic())
            }
          />
          <Button
            type="button"
            onClick={addTopic}
            className="px-4 py-2 transition-all duration-300 hover:shadow-lg"
            style={{
              backgroundColor: colors.accent.primary,
              color: colors.text.inverse,
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic, index) => (
            <Badge
              key={index}
              className="flex items-center px-3 py-1 space-x-1"
              style={{
                backgroundColor: `${colors.accent.primary}20`,
                color: colors.accent.primary,
                borderColor: colors.border.primary,
              }}
            >
              <Hash className="w-3 h-3" />
              <span>{topic}</span>
              <button
                type="button"
                onClick={() => removeTopic(topic)}
                className="ml-1 transition-colors duration-200 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Community Rules */}
      <div>
        <label
          className="block mb-3 text-sm font-semibold"
          style={{ color: colors.text.primary }}
        >
          Community Rules
        </label>
        <div className="flex mb-3 space-x-2">
          <input
            type="text"
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            placeholder="Add a rule..."
            className="flex-1 px-4 py-2 transition-all duration-200 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
            style={{
              borderColor: colors.border.primary,
              backgroundColor: colors.background.primary,
              color: colors.text.primary,
            }}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addRule())
            }
          />
          <Button
            type="button"
            onClick={addRule}
            className="px-4 py-2 transition-all duration-300 hover:shadow-lg"
            style={{
              backgroundColor: colors.accent.primary,
              color: colors.text.inverse,
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {rules.map((rule, index) => (
            <div
              key={index}
              className="flex items-center p-3 space-x-3 transition-all duration-200 rounded-lg hover:shadow-md"
              style={{
                backgroundColor: colors.background.secondary,
                border: `1px solid ${colors.border.primary}`,
              }}
            >
              <Shield
                className="flex-shrink-0 w-5 h-5 mt-1"
                style={{ color: colors.accent.primary }}
              />
              <span className="flex-1" style={{ color: colors.text.primary }}>
                {rule}
              </span>
              <button
                type="button"
                onClick={() => removeRule(rule)}
                className="text-red-500 transition-colors duration-200 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
