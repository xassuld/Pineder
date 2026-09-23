import Head from "next/head";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Video,
  Mic,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../../design/system/button";
import { Layout } from "../../components/layout/Layout";
import { useState, useEffect } from "react";
import { useTheme } from "../../core/contexts/ThemeContext";
import {
  EventSubmissionForm,
  EventDetails,
} from "../../components/features/events";
import { useEvents, Event, CreateEventData } from "../../core/hooks/useEvents";
import { useUser } from "@clerk/nextjs";

export default function CommunityEvents() {
  const { isDarkMode, colors } = useTheme();
  const { user, isSignedIn } = useUser();
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Current month
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("week");

  // State for event form
  const [showEventForm, setShowEventForm] = useState(false);

  // State for event details
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  // Store original backend events for EventDetails
  const [originalEvents, setOriginalEvents] = useState<Event[]>([]);

  // Use the events hook
  const {
    events,
    loading,
    error,
    createEvent,
    registerForEvent,
    unregisterFromEvent,
    canCreateEvents,
    canRegisterForEvents,
  } = useEvents();

  // Handler for event submission
  const handleEventSubmit = async (newEvent: CreateEventData) => {
    try {
      await createEvent(newEvent);
      alert("Event created successfully!");
      setShowEventForm(false);
    } catch (error) {
      console.error("Failed to create event:", error);
      alert(error instanceof Error ? error.message : "Failed to create event");
    }
  };

  // Helper function to transform backend event to frontend format
  const transformEventForDisplay = (event: Event) => {
    const startDate = new Date(event.startTime);
    const endDate = new Date(event.endTime);

    // Handle eventId safely
    let eventId = 0;
    if (event.eventId) {
      try {
        eventId = parseInt(event.eventId.replace("#", ""));
      } catch (error) {
        console.error("Error parsing eventId:", error);
        eventId = 0;
      }
    }

    return {
      id: eventId,
      title: event.title,
      startTime: startDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      endTime: endDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: startDate,
      endDate: endDate,
      type: event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1),
      status:
        event.currentParticipants >= (event.maxParticipants || 0)
          ? "Full"
          : "Open",
      icon: getEventIcon(event.eventType),
      description: event.description,
      location: event.location,
      attendees: event.currentParticipants,
      category: event.category,
      color: getEventColor(event.eventType),
    };
  };

  // Helper function to get event icon
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "workshop":
        return BookOpen;
      case "discussion":
        return Mic;
      case "webinar":
        return Video;
      case "q&a":
        return Users;
      default:
        return Calendar;
    }
  };

  // Helper function to get event color
  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case "workshop":
        return "bg-blue-500";
      case "discussion":
        return "bg-green-500";
      case "webinar":
        return "bg-purple-500";
      case "q&a":
        return "bg-orange-500";
      default:
        return "bg-indigo-500";
    }
  };

  // Handler for opening event details
  const handleEventClick = (
    event: Event | ReturnType<typeof transformEventForDisplay>
  ) => {
    // If it's already a backend Event, use it directly
    if ("_id" in event) {
      setSelectedEvent(event);
      setShowEventDetails(true);
      return;
    }

    // If it's a transformed event, find the original backend event
    const originalEvent = originalEvents.find((e) => e.title === event.title);

    if (originalEvent) {
      setSelectedEvent(originalEvent);
      setShowEventDetails(true);
    }
  };

  // Handler for closing event details
  const handleCloseEventDetails = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

  // Handler for registering/unregistering from event
  const handleEventRegistration = async (event: Event) => {
    try {
      // Check if user is already registered (safely handle undefined registeredStudents)
      // registeredStudents might be ObjectIds or strings, so we need to handle both
      const isRegistered =
        event.registeredStudents?.some(
          (studentId: any) =>
            studentId === user?.id ||
            studentId._id === user?.id ||
            studentId.toString() === user?.id
        ) || false;

      if (isRegistered) {
        await unregisterFromEvent(event._id);
        alert("Successfully unregistered from event!");
      } else {
        await registerForEvent(event._id);
        alert("Successfully registered for event!");
      }
    } catch (error) {
      console.error("Failed to handle event registration:", error);
      alert(
        error instanceof Error ? error.message : "Failed to handle registration"
      );
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getWeekDays = () => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return weekDays;
  };

  const getMonthName = (date: Date) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[date.getMonth()];
  };

  const getYear = (date: Date) => {
    return date.getFullYear();
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const goToCurrentWeek = () => {
    const today = new Date();
    const currentWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay()
    );
    setCurrentMonth(currentWeek);
  };

  const goToEventsWeek = () => {
    // Go to the week of the first event if available, otherwise go to current week
    if (events.length > 0) {
      const firstEvent = events[0];
      const eventDate = new Date(firstEvent.startTime);
      const eventWeek = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate() - eventDate.getDay()
      );
      setCurrentMonth(eventWeek);
    } else {
      // If no events, go to current week
      goToCurrentWeek();
    }
  };

  // Store original events and set initial view
  useEffect(() => {
    // Store original backend events for EventDetails
    if (events.length > 0) {
      setOriginalEvents(events);

      // Automatically go to the events week when the page loads
      const firstEvent = events[0];
      const eventDate = new Date(firstEvent.startTime);

      // Create a new date object and set it to Sunday of that week (since week starts on Sunday)
      const eventWeek = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate() - eventDate.getDay()
      );
      setCurrentMonth(eventWeek);
    }
  }, [events]);

  const getEventsForDate = (date: Date) => {
    if (events.length === 0) {
      return [];
    }

    // Normalize the target date to start of day
    const targetDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.startTime);
      // Normalize event date to start of day
      const normalizedEventDate = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate()
      );

      const matches = normalizedEventDate.getTime() === targetDate.getTime();
      return matches;
    });

    return filteredEvents.map(transformEventForDisplay);
  };

  const getEventsForWeek = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    if (events.length === 0) {
      return [];
    }

    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.startTime);
      // Normalize event date to start of day for comparison
      const normalizedEventDate = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate()
      );

      const inRange =
        normalizedEventDate >= startDate && normalizedEventDate <= endDate;
      return inRange;
    });

    return filteredEvents.map(transformEventForDisplay);
  };

  const getEventsForDay = (date: Date) => {
    return getEventsForDate(date);
  };

  const renderMonthView = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const weekDays = getWeekDays();
    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-20"
          style={{ backgroundColor: colors.background.secondary }}
        ></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const dayEvents = getEventsForDate(currentDate);
      const isToday = currentDate.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={day}
          className={`h-16 sm:h-20 border p-1 sm:p-1.5 transition-all duration-200 hover:shadow-md`}
          style={{
            borderColor: colors.border.primary,
            backgroundColor: isToday
              ? `${colors.accent.primary}20`
              : colors.background.card,
          }}
        >
          <div
            className="mb-1 text-xs font-medium sm:text-sm"
            style={{ color: colors.text.primary }}
          >
            {day}
          </div>
          <div className="space-y-0.5">
            {dayEvents.slice(0, 2).map((event) => {
              // Find the original backend event for this transformed event
              const originalEvent = originalEvents.find(
                (e) => e.title === event.title
              );
              return (
                <div
                  key={event.id}
                  className={`text-xs p-0.5 rounded ${event.color} text-white truncate cursor-pointer hover:opacity-80 transition-opacity`}
                  title={event.title}
                  onClick={() => handleEventClick(originalEvent || event)}
                >
                  {event.title}
                </div>
              );
            })}
            {dayEvents.length > 2 && (
              <div
                className="text-xs cursor-pointer hover:underline"
                style={{ color: colors.text.tertiary }}
              >
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        className="overflow-hidden rounded-lg shadow-lg"
        style={{
          backgroundColor: colors.background.card,
          borderColor: colors.border.primary,
        }}
      >
        <div
          className="grid grid-cols-7 gap-px"
          style={{ backgroundColor: colors.border.primary }}
        >
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-2 text-xs font-medium text-center sm:p-3 sm:text-sm"
              style={{
                backgroundColor: colors.background.secondary,
                color: colors.text.primary,
              }}
            >
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    // Use currentMonth instead of today to show the correct week
    const startOfWeek = new Date(currentMonth);
    startOfWeek.setDate(currentMonth.getDate() - currentMonth.getDay());

    const weekEvents = getEventsForWeek(startOfWeek);

    return (
      <div
        className="overflow-hidden rounded-lg shadow-lg"
        style={{
          backgroundColor: colors.background.card,
          borderColor: colors.border.primary,
        }}
      >
        <div
          className="grid grid-cols-7 gap-px"
          style={{ backgroundColor: colors.border.primary }}
        >
          {weekDays.map((day, index) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + index);
            const isToday = date.toDateString() === new Date().toDateString();
            const dayEvents = weekEvents.filter((event) => {
              const matches = event.date.toDateString() === date.toDateString();
              return matches;
            });

            return (
              <div
                key={day}
                className="min-h-[150px] sm:min-h-[200px] transition-all duration-200"
                style={{
                  backgroundColor: isToday
                    ? `${colors.accent.primary}20`
                    : colors.background.card,
                }}
              >
                <div
                  className={`p-2 sm:p-3 text-center border-b transition-all duration-200`}
                  style={{
                    borderColor: colors.border.primary,
                    backgroundColor: isToday
                      ? `${colors.accent.primary}30`
                      : colors.background.secondary,
                  }}
                >
                  <div
                    className="text-xs font-medium sm:text-sm"
                    style={{ color: colors.text.primary }}
                  >
                    {day}
                  </div>
                  <div
                    className={`text-xs sm:text-sm ${
                      isToday ? colors.accent.primary : colors.text.tertiary
                    }`}
                  >
                    {date.getDate()}
                  </div>
                </div>

                <div className="p-1 sm:p-2">
                  {dayEvents.length === 0 ? (
                    <div
                      className="py-4 text-xs text-center sm:py-8 sm:text-sm"
                      style={{ color: colors.text.tertiary }}
                    >
                      No events
                    </div>
                  ) : (
                    <div className="space-y-1 sm:space-y-2">
                      {dayEvents.map((event) => {
                        // Find the original backend event for this transformed event
                        const originalEvent = originalEvents.find(
                          (e) => e.title === event.title
                        );
                        return (
                          <div
                            key={event.id}
                            className={`p-1.5 sm:p-2 rounded-lg ${event.color} text-white text-xs cursor-pointer hover:opacity-80 transition-opacity`}
                            onClick={() =>
                              handleEventClick(originalEvent || event)
                            }
                          >
                            <div className="mb-1 font-medium truncate">
                              {event.title}
                            </div>
                            <div className="text-xs text-white/80">
                              {event.startTime} - {event.endTime}
                            </div>
                            <div className="mt-1 text-xs truncate text-white/70">
                              {event.location}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const today = new Date();
    const dayEvents = getEventsForDay(today);
    const weekDays = getWeekDays();
    const currentDay = weekDays[today.getDay()];

    return (
      <div
        className="overflow-hidden rounded-lg shadow-lg"
        style={{
          backgroundColor: colors.background.card,
          borderColor: colors.border.primary,
        }}
      >
        <div
          className="p-4 border-b"
          style={{ borderColor: colors.border.primary }}
        >
          <div
            className="text-lg font-semibold"
            style={{ color: colors.text.primary }}
          >
            {currentDay}, {today.toLocaleDateString()}
          </div>
        </div>

        <div className="p-4">
          {dayEvents.length === 0 ? (
            <div
              className="py-8 text-center"
              style={{ color: colors.text.tertiary }}
            >
              No events scheduled for today
            </div>
          ) : (
            <div className="space-y-4">
              {dayEvents.map((event) => {
                // Find the original backend event for this transformed event
                const originalEvent = originalEvents.find(
                  (e) => e.title === event.title
                );
                return (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border-l-4 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer`}
                    style={{
                      borderLeftColor:
                        event.color.split("-")[1] === "08CB00"
                          ? "#08CB00"
                          : event.color.split("-")[1],
                      backgroundColor: colors.background.card,
                      borderColor: colors.border.primary,
                    }}
                    onClick={() => handleEventClick(originalEvent || event)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3
                          className="mb-2 text-lg font-semibold"
                          style={{ color: colors.text.primary }}
                        >
                          {event.title}
                        </h3>
                        <p
                          className="mb-3"
                          style={{ color: colors.text.secondary }}
                        >
                          {event.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Clock
                              className="w-4 h-4"
                              style={{ color: colors.text.tertiary }}
                            />
                            <span style={{ color: colors.text.tertiary }}>
                              {event.startTime} - {event.endTime}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin
                              className="w-4 h-4"
                              style={{ color: colors.text.tertiary }}
                            />
                            <span style={{ color: colors.text.tertiary }}>
                              {event.location}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users
                              className="w-4 h-4"
                              style={{ color: colors.text.tertiary }}
                            />
                            <span style={{ color: colors.text.tertiary }}>
                              {event.attendees} attendees
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`p-2 rounded-full ${event.color} text-white`}
                        >
                          <event.icon className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <Head>
        <title>Events | Pineder</title>
        <meta name="description" content="Browse and join community events" />
      </Head>

      <div
        className="min-h-screen w-full"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div className="px-4 py-8 sm:py-12 md:py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 mb-4 sm:flex-row sm:items-center sm:mb-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Calendar
                  className="w-6 h-6 sm:w-8 sm:h-8"
                  style={{ color: colors.accent.primary }}
                />
                <div>
                  <h1
                    className="text-2xl font-bold sm:text-3xl"
                    style={{ color: colors.text.primary }}
                  >
                    Events
                  </h1>
                  <p
                    className="text-xs sm:text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    Manage and view community events
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-stretch w-full gap-2 sm:flex-row sm:items-center sm:w-auto">
              {canCreateEvents() && (
                <Button
                  onClick={() => setShowEventForm(true)}
                  className="px-4 py-2 sm:px-6 sm:py-3 border-0 hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
                  style={{
                    backgroundColor: colors.accent.primary,
                    color: colors.text.inverse,
                  }}
                >
                  <Plus className="w-4 h-4 mr-1 sm:w-5 sm:h-5 sm:mr-2" />
                  <span className="text-xs sm:text-sm">Add Event</span>
                </Button>
              )}
            </div>
          </div>

          <div
            className="p-3 rounded-lg shadow-lg sm:p-4 mb-6"
            style={{
              backgroundColor: colors.background.card,
              borderColor: colors.border.primary,
            }}
          >
            <div className="flex justify-end">
              <div className="flex items-center space-x-1 sm:space-x-2">
                {[
                  { key: "month", label: "Month" },
                  { key: "week", label: "Week" },
                  { key: "day", label: "Day" },
                ].map(({ key, label }) => (
                  <Button
                    key={key}
                    onClick={() => {
                      setViewMode(key as any);
                      // Reset to current week when switching to week view
                      if (key === "week") {
                        goToCurrentWeek();
                      }
                    }}
                    variant={viewMode === key ? "default" : "outline"}
                    size="sm"
                    className="flex-1 px-2 py-1 text-xs transition-all duration-300 sm:text-sm sm:px-3 sm:py-2 lg:flex-none"
                    style={{
                      backgroundColor:
                        viewMode === key
                          ? colors.accent.primary
                          : "transparent",
                      color:
                        viewMode === key
                          ? colors.text.inverse
                          : colors.text.primary,
                      borderColor: colors.border.primary,
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            {viewMode === "month" && renderMonthView()}
            {viewMode === "week" && renderWeekView()}
            {viewMode === "day" && renderDayView()}
          </div>

          <div
            className="overflow-hidden rounded-lg shadow-lg"
            style={{
              backgroundColor: colors.background.card,
              borderColor: colors.border.primary,
            }}
          >
            <div
              className="p-3 border-b sm:p-4"
              style={{ borderColor: colors.border.primary }}
            >
              <h3
                className="text-sm font-semibold sm:text-base"
                style={{ color: colors.text.primary }}
              >
                Upcoming Events
              </h3>
            </div>
            <div className="p-3 sm:p-4">
              {loading ? (
                <div className="py-8 text-center">
                  <div className="w-8 h-8 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
                  <p className="mt-2 text-sm text-gray-600">
                    Loading events...
                  </p>
                </div>
              ) : error ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-red-600">
                    Error loading events: {error}
                  </p>
                </div>
              ) : events.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-600">
                    No events available (Total: {events.length})
                  </p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {(() => {
                    const futureEvents = events.filter(
                      (event) => new Date(event.startTime) >= new Date()
                    );
                    const sortedEvents = futureEvents.sort(
                      (a, b) =>
                        new Date(a.startTime).getTime() -
                        new Date(b.startTime).getTime()
                    );
                    const displayEvents = sortedEvents.slice(0, 3);
                    return displayEvents;
                  })().map((event) => {
                    const displayEvent = transformEventForDisplay(event);
                    return (
                      <div
                        key={event.eventId || event.title}
                        className="flex items-start p-2 space-x-2 transition-all duration-200 border rounded-lg cursor-pointer sm:items-center sm:p-3 sm:space-x-3 hover:shadow-md"
                        style={{
                          borderColor: colors.border.primary,
                          backgroundColor: colors.background.card,
                        }}
                        onClick={() => handleEventClick(event)}
                      >
                        <div
                          className={`p-1.5 sm:p-2 rounded-full ${displayEvent.color} text-white flex-shrink-0`}
                        >
                          <displayEvent.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className="text-sm font-medium truncate sm:text-base"
                            style={{ color: colors.text.primary }}
                          >
                            {displayEvent.title}
                          </h4>
                          <p
                            className="mt-1 text-xs line-clamp-2"
                            style={{ color: colors.text.secondary }}
                          >
                            {displayEvent.description}
                          </p>
                          <div className="flex flex-col mt-1 space-y-1 text-xs sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                            <span style={{ color: colors.text.tertiary }}>
                              {displayEvent.date.toLocaleDateString()}
                            </span>
                            <span style={{ color: colors.text.tertiary }}>
                              {displayEvent.startTime} - {displayEvent.endTime}
                            </span>
                            <span
                              style={{ color: colors.text.tertiary }}
                              className="truncate"
                            >
                              {displayEvent.location}
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div
                            className="text-xs font-medium"
                            style={{ color: colors.text.primary }}
                          >
                            {displayEvent.status}
                          </div>
                          <div
                            className="text-xs"
                            style={{ color: colors.text.tertiary }}
                          >
                            {displayEvent.category}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Submission Form */}
      <EventSubmissionForm
        isOpen={showEventForm}
        onClose={() => setShowEventForm(false)}
        onSubmit={handleEventSubmit}
      />

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          isOpen={showEventDetails}
          onClose={handleCloseEventDetails}
          onRegister={handleEventRegistration}
        />
      )}
    </Layout>
  );
}
