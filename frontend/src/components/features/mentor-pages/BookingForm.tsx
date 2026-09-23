import React, { useState } from "react";
import { Button } from "../../../design/system/button";
import { Input } from "../../../design/system/input";
import { Label } from "../../../design/system/label";
import { Textarea } from "../../../design/system/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../design/system/select";

interface Teacher {
  id?: string | number;
  _id?: string;
  name?: string;
  hourlyRate?: number;
  // Mentor data structure
  userId?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
    title?: string;
    bio?: string;
  };
}

interface BookingData {
  teacherId: string;
  date: string;
  time: string;
  duration: number;
  subject: string;
  description: string;
  meetingType: "online" | "in-person";
  location?: string;
}

interface BookingFormProps {
  teacher: Teacher;
  onSubmit: (bookingData: BookingData) => void;
  onCancel: () => void;
  colors?: any;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  teacher,
  onSubmit,
  onCancel,
  colors,
}) => {
  const themeColors = colors || {
    text: {
      primary: "#000000",
      secondary: "#6b7280",
    },
  };

  const [bookingData, setBookingData] = useState<BookingData>({
    teacherId: teacher._id?.toString() || teacher.id?.toString() || "",
    date: "",
    time: "",
    duration: 1,
    subject: "",
    description: "",
    meetingType: "online",
    location: "",
  });

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const availableDates = [
    "2024-01-20",
    "2024-01-21",
    "2024-01-22",
    "2024-01-23",
    "2024-01-24",
    "2024-01-25",
    "2024-01-26",
    "2024-01-27",
    "2024-01-28",
    "2024-01-29",
  ];

  const availableTimes = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && selectedTime) {
      const finalBookingData: BookingData = {
        ...bookingData,
        date: selectedDate,
        time: selectedTime,
      };
      onSubmit(finalBookingData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date Selection */}
      <div className="space-y-3">
        <Label
          className="text-base font-semibold"
          style={{ color: themeColors.text.primary }}
        >
          Select Date
        </Label>
        <div className="grid grid-cols-5 gap-2">
          {availableDates.map((date) => (
            <button
              key={date}
              type="button"
              onClick={() => setSelectedDate(date)}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                selectedDate === date
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div
                className="text-sm font-medium"
                style={{ color: themeColors.text.primary }}
              >
                {formatDate(date)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      <div className="space-y-3">
        <Label
          className="text-base font-semibold"
          style={{ color: themeColors.text.primary }}
        >
          Select Time
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {availableTimes.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => setSelectedTime(time)}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                selectedTime === time
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div
                className="text-sm font-medium"
                style={{ color: themeColors.text.primary }}
              >
                {formatTime(time)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Session Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (hours)</Label>
          <Select
            value={bookingData.duration.toString()}
            onValueChange={(value) =>
              setBookingData((prev) => ({
                ...prev,
                duration: parseInt(value),
              }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 hour</SelectItem>
              <SelectItem value="1.5">1.5 hours</SelectItem>
              <SelectItem value="2">2 hours</SelectItem>
              <SelectItem value="2.5">2.5 hours</SelectItem>
              <SelectItem value="3">3 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="meetingType">Meeting Type</Label>
          <Select
            value={bookingData.meetingType}
            onValueChange={(value: "online" | "in-person") =>
              setBookingData((prev) => ({ ...prev, meetingType: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Online (Zoom)</SelectItem>
              <SelectItem value="in-person">In-Person</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <Label htmlFor="subject">Subject/Topic</Label>
        <Input
          id="subject"
          value={bookingData.subject}
          onChange={(e) =>
            setBookingData((prev) => ({ ...prev, subject: e.target.value }))
          }
          placeholder="e.g., Calculus, React Development, Machine Learning"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Session Description</Label>
        <Textarea
          id="description"
          value={bookingData.description}
          onChange={(e) =>
            setBookingData((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          placeholder="Describe what you'd like to learn or work on during this session..."
          rows={3}
          required
        />
      </div>

      {/* Location (for in-person meetings) */}
      {bookingData.meetingType === "in-person" && (
        <div className="space-y-2">
          <Label htmlFor="location">Meeting Location</Label>
          <Input
            id="location"
            value={bookingData.location || ""}
            onChange={(e) =>
              setBookingData((prev) => ({
                ...prev,
                location: e.target.value,
              }))
            }
            placeholder="e.g., Library, Coffee Shop, Campus Building"
            required
          />
        </div>
      )}

      {/* Total Cost */}
      <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <span
            className="font-medium"
            style={{ color: themeColors.text.primary }}
          >
            Total Cost:
          </span>
          <span className="text-2xl font-bold text-blue-600">
            ${((teacher.hourlyRate || 0) * bookingData.duration).toFixed(2)}
          </span>
        </div>
        <div className="text-sm" style={{ color: themeColors.text.secondary }}>
          {bookingData.duration} hour{bookingData.duration > 1 ? "s" : ""} × $
          {teacher.hourlyRate || 0}/hr
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            !selectedDate ||
            !selectedTime ||
            !bookingData.subject ||
            !bookingData.description
          }
          className="px-8 text-white bg-blue-600 hover:bg-blue-700"
        >
          Book Session
        </Button>
      </div>
    </form>
  );
};
