import React, { useState, useEffect } from "react";
import { Label } from "../../../design/system/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../design/system/select";
import {
  getCommonTimezones,
  getUserTimezone,
  formatTimezoneOffset,
  getTimezoneDisplayName,
} from "../../../core/lib/timezone";

interface TimezoneSelectorProps {
  value?: string;
  onChange: (timezone: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function TimezoneSelector({
  value,
  onChange,
  label = "Timezone",
  placeholder = "Select your timezone",
  className = "",
}: TimezoneSelectorProps) {
  const [selectedTimezone, setSelectedTimezone] = useState(
    value || getUserTimezone()
  );
  const timezones = getCommonTimezones();

  useEffect(() => {
    if (value) {
      setSelectedTimezone(value);
    }
  }, [value]);

  const handleTimezoneChange = (newTimezone: string) => {
    setSelectedTimezone(newTimezone);
    onChange(newTimezone);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor="timezone-select">{label}</Label>
      <Select value={selectedTimezone} onValueChange={handleTimezoneChange}>
        <SelectTrigger id="timezone-select">
          <SelectValue placeholder={placeholder}>
            {selectedTimezone && (
              <div className="flex items-center justify-between w-full">
                <span>{getTimezoneDisplayName(selectedTimezone)}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  {formatTimezoneOffset(selectedTimezone)}
                </span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {timezones.map((timezone) => (
            <SelectItem key={timezone.value} value={timezone.value}>
              <div className="flex items-center justify-between w-full">
                <span>{timezone.label}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  {formatTimezoneOffset(timezone.value)}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedTimezone && (
        <div className="text-xs text-muted-foreground">
          Current time:{" "}
          {new Date().toLocaleTimeString("en-US", {
            timeZone: selectedTimezone,
            hour: "2-digit",
            minute: "2-digit",
            timeZoneName: "short",
          })}
        </div>
      )}
    </div>
  );
}

export default TimezoneSelector;
