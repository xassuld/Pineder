import React from "react";
import { Plus, Image as ImageIcon, Users } from "lucide-react";
import { Button } from "../../../design/system/button";
import { Card, CardContent } from "../../../design/system/card";

type CommunityFormActionsProps = {
  image: string;
  setImage: (image: string) => void;
  colors: any;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

export const CommunityFormActions: React.FC<CommunityFormActionsProps> = ({
  image,
  setImage,
  colors,
  onClose,
  onSubmit,
}) => {
  return (
    <>
      {/* Community Image */}
      <div>
        <label
          htmlFor="image"
          className="block mb-3 text-sm font-semibold"
          style={{ color: colors.text.primary }}
        >
          Community Image (Optional)
        </label>
        <div className="flex space-x-2">
          <input
            id="image"
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Enter image URL..."
            className="flex-1 rounded-xl border-2 px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent"
            style={{
              borderColor: colors.border.primary,
              backgroundColor: colors.background.primary,
              color: colors.text.primary,
            }}
          />
          <Button
            type="button"
            variant="outline"
            className="px-4 py-3 transition-all duration-300 hover:shadow-lg"
            style={{
              borderColor: colors.border.primary,
              color: colors.text.primary,
              backgroundColor: `${colors.accent.primary}10`,
            }}
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Tips */}
      <Card
        className="overflow-hidden border-0 shadow-lg"
        style={{
          backgroundColor: `${colors.accent.primary}10`,
          borderColor: colors.border.primary,
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Users
              className="mt-0.5 h-5 w-5 flex-shrink-0"
              style={{ color: colors.accent.primary }}
            />
            <div style={{ color: colors.accent.primary }}>
              <p className="mb-1 font-medium">💡 Tips for great communities:</p>
              <ul className="space-y-1">
                <li>• Be clear about the community&apos;s purpose</li>
                <li>• Set clear rules and expectations</li>
                <li>• Choose relevant topics and tags</li>
                <li>• Consider privacy needs of your members</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 pt-6 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="h-12 flex-1 rounded-xl border-2 text-lg transition-all duration-200 hover:shadow-lg"
          style={{
            borderColor: colors.border.primary,
            color: colors.text.primary,
            backgroundColor: `${colors.accent.primary}10`,
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="h-12 flex-1 rounded-xl text-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          style={{
            background: `linear-gradient(135deg, ${colors.accent.secondary} 0%, ${colors.accent.success} 100%)`,
            color: colors.text.inverse,
          }}
        >
          <Plus className="mr-2 h-5 w-5" />
          Create Community
        </Button>
      </div>
    </>
  );
};
