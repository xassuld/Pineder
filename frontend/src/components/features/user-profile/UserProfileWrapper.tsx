"use client";

import { Button } from "../../../design/system/button";
import { UserProfile } from "./UserProfile";

interface UserProfileWrapperProps {
  isSignedIn?: boolean;
  user?: {
    name: string;
    username: string;
    avatar?: string;
    role: "student" | "mentor";
    rating?: number;
    topics?: string[];
    bio?: string;
  };
  onSignIn?: () => void;
  className?: string;
}

export function UserProfileWrapper({
  isSignedIn = false,
  user,
  onSignIn,
  className = "",
}: UserProfileWrapperProps) {
  if (isSignedIn) {
    return <UserProfile user={user} isSignedIn={true} />;
  }

  return (
    <Button
      variant="ghost"
      className={`hover:text-[var(--pico-secondary)] hover:bg-foreground/5 glow-hover rounded-2xl font-medium ${className}`}
      onClick={onSignIn}
    >
      Sign In
    </Button>
  );
}
