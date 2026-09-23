import React, { useState } from "react";
import { Button } from "../../../design/system/button";
import { Input } from "../../../design/system/input";
import { Label } from "../../../design/system/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../design/system/card";
import {
  getUserTimezone,
  formatDateInTimezone,
} from "../../../core/lib/timezone";

interface TimezoneDebuggerProps {
  className?: string;
}

export function TimezoneDebugger({ className = "" }: TimezoneDebuggerProps) {
  const [utcTime, setUtcTime] = useState(new Date().toISOString());
  const [mentorTimezone, setMentorTimezone] = useState("America/New_York");
  const [userTimezone, setUserTimezone] = useState(getUserTimezone());
  const [debugResult, setDebugResult] = useState<any>(null);

  const testTimezoneConversion = async () => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/mentors/availability/debug-timezone?` +
          new URLSearchParams({
            utcTime,
            mentorTimezone,
            userTimezone,
          }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      setDebugResult(result);
    } catch (error) {
      console.error("Debug error:", error);
      setDebugResult({ error: "Failed to debug timezone" });
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Timezone Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="utc-time">UTC Time</Label>
          <Input
            id="utc-time"
            type="datetime-local"
            value={utcTime.slice(0, 16)}
            onChange={(e) => setUtcTime(new Date(e.target.value).toISOString())}
          />
        </div>

        <div>
          <Label htmlFor="mentor-tz">Mentor Timezone</Label>
          <Input
            id="mentor-tz"
            value={mentorTimezone}
            onChange={(e) => setMentorTimezone(e.target.value)}
            placeholder="America/New_York"
          />
        </div>

        <div>
          <Label htmlFor="user-tz">User Timezone</Label>
          <Input
            id="user-tz"
            value={userTimezone}
            onChange={(e) => setUserTimezone(e.target.value)}
            placeholder="Europe/London"
          />
        </div>

        <Button onClick={testTimezoneConversion} className="w-full">
          Test Timezone Conversion
        </Button>

        {debugResult && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h4 className="font-semibold mb-2">Debug Result:</h4>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(debugResult, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-semibold mb-2">
            Current Time in Different Timezones:
          </h4>
          <div className="space-y-1 text-sm">
            <div>
              <strong>UTC:</strong> {new Date().toISOString()}
            </div>
            <div>
              <strong>Your timezone ({userTimezone}):</strong>{" "}
              {formatDateInTimezone(new Date(), userTimezone)}
            </div>
            <div>
              <strong>Mentor timezone ({mentorTimezone}):</strong>{" "}
              {formatDateInTimezone(new Date(), mentorTimezone)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TimezoneDebugger;
