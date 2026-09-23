import { useState, useEffect } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { useTheme } from "../../core/contexts/ThemeContext";
import { Layout } from "../../components/layout/Layout";
import { Button } from "../../design/system/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../design/system/card";
import { EventSubmissionForm } from "../../components/features/events/EventSubmissionForm";
import { EventDetails } from "../../components/features/events/EventDetails";
import { useEvents } from "../../core/hooks/useEvents";
import { useUser } from "@clerk/nextjs";
import {
  Plus,
  Calendar,
  Users,
  Clock,
  MapPin,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  BookOpen,
  Video,
  Mic,
} from "lucide-react";

export default function MentorEventsPage() {
  const { colors } = useTheme();
  const { user, isSignedIn } = useUser();
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "drafts">(
    "upcoming"
  );

  const { events, loading, error, createEvent, canCreateEvents } = useEvents();

  // Filter events based on active tab
  const getFilteredEvents = () => {
    const now = new Date();
    const upcoming = events.filter((event) => new Date(event.startTime) > now);
    const past = events.filter((event) => new Date(event.startTime) <= now);

    return {
      upcoming,
      past,
      drafts: [], // You can add draft events later
    };
  };

  const handleEventSubmit = async (newEvent: any) => {
    try {
      await createEvent(newEvent);
      alert("Event created successfully!");
      setShowEventForm(false);
    } catch (error) {
      console.error("Failed to create event:", error);
      alert(error instanceof Error ? error.message : "Failed to create event");
    }
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "workshop":
        return BookOpen;
      case "webinar":
        return Video;
      case "discussion":
        return Mic;
      default:
        return Calendar;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case "workshop":
        return "bg-blue-500";
      case "webinar":
        return "bg-purple-500";
      case "discussion":
        return "bg-green-500";
      case "q&a":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredEvents = getFilteredEvents();

  if (!isSignedIn || !canCreateEvents()) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p>Only mentors can access this page.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>My Events | Mentor Dashboard | Pineder</title>
        <meta name="description" content="Manage your events as a mentor" />
      </Head>

      <div
        className="min-h-screen w-full"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div className="px-4 py-8 sm:py-12 md:py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1
                  className="text-2xl font-bold sm:text-3xl md:text-4xl mb-2"
                  style={{ color: colors.text.primary }}
                >
                  My Events
                </h1>
                <p
                  className="text-sm sm:text-base"
                  style={{ color: colors.text.secondary }}
                >
                  Create and manage your learning events
                </p>
              </div>

              <Button
                onClick={() => setShowEventForm(true)}
                className="mt-4 sm:mt-0 px-6 py-3 transition-all duration-300"
                style={{
                  backgroundColor: colors.accent.primary,
                  color: colors.text.inverse,
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Event
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card
              className="transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: colors.background.card,
                borderColor: colors.border.primary,
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: `${colors.accent.primary}20` }}
                  >
                    <Calendar
                      className="w-6 h-6"
                      style={{ color: colors.accent.primary }}
                    />
                  </div>
                  <div className="ml-4">
                    <p
                      className="text-sm font-medium"
                      style={{ color: colors.text.secondary }}
                    >
                      Upcoming Events
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: colors.text.primary }}
                    >
                      {filteredEvents.upcoming.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: colors.background.card,
                borderColor: colors.border.primary,
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: `${colors.accent.secondary}20` }}
                  >
                    <Users
                      className="w-6 h-6"
                      style={{ color: colors.accent.secondary }}
                    />
                  </div>
                  <div className="ml-4">
                    <p
                      className="text-sm font-medium"
                      style={{ color: colors.text.secondary }}
                    >
                      Total Registrations
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: colors.text.primary }}
                    >
                      {events.reduce(
                        (total, event) =>
                          total + (event.currentParticipants || 0),
                        0
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: colors.background.card,
                borderColor: colors.border.primary,
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: `${colors.accent.secondary}20` }}
                  >
                    <TrendingUp
                      className="w-6 h-6"
                      style={{ color: colors.accent.secondary }}
                    />
                  </div>
                  <div className="ml-4">
                    <p
                      className="text-sm font-medium"
                      style={{ color: colors.text.secondary }}
                    >
                      Past Events
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: colors.text.primary }}
                    >
                      {filteredEvents.past.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div
              className="border-b"
              style={{ borderColor: colors.border.primary }}
            >
              <nav className="-mb-px flex space-x-8">
                {[
                  {
                    id: "upcoming",
                    label: "Upcoming Events",
                    count: filteredEvents.upcoming.length,
                  },
                  {
                    id: "past",
                    label: "Past Events",
                    count: filteredEvents.past.length,
                  },
                  {
                    id: "drafts",
                    label: "Drafts",
                    count: filteredEvents.drafts.length,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors`}
                    style={{
                      borderColor:
                        activeTab === tab.id
                          ? colors.accent.primary
                          : "transparent",
                      color:
                        activeTab === tab.id
                          ? colors.accent.primary
                          : colors.text.secondary,
                    }}
                  >
                    {tab.label}
                    <span
                      className="ml-2 py-0.5 px-2.5 rounded-full text-xs"
                      style={{
                        backgroundColor:
                          activeTab === tab.id
                            ? colors.accent.primary
                            : colors.background.secondary,
                        color:
                          activeTab === tab.id
                            ? colors.text.inverse
                            : colors.text.primary,
                      }}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div
                  className="w-8 h-8 mx-auto border-b-2 rounded-full animate-spin"
                  style={{ borderColor: colors.accent.primary }}
                ></div>
                <p className="mt-2" style={{ color: colors.text.secondary }}>
                  Loading your events...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p style={{ color: "#ef4444" }}>
                  Error loading events: {error}
                </p>
              </div>
            ) : filteredEvents[activeTab].length === 0 ? (
              <div className="text-center py-12">
                <Calendar
                  className="w-12 h-12 mx-auto mb-4"
                  style={{ color: colors.text.tertiary }}
                />
                <h3
                  className="text-lg font-medium mb-2"
                  style={{ color: colors.text.primary }}
                >
                  No {activeTab} events
                </h3>
                <p style={{ color: colors.text.secondary }}>
                  {activeTab === "upcoming"
                    ? "Create your first event to get started!"
                    : activeTab === "past"
                    ? "You haven't hosted any events yet."
                    : "No draft events saved."}
                </p>
                {activeTab === "upcoming" && (
                  <Button
                    onClick={() => setShowEventForm(true)}
                    className="mt-4 px-6 py-3"
                    style={{
                      backgroundColor: colors.accent.primary,
                      color: colors.text.inverse,
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents[activeTab].map((event) => {
                  const Icon = getEventIcon(event.eventType);
                  const colorClass = getEventColor(event.eventType);
                  const eventDate = new Date(event.startTime);

                  return (
                    <Card
                      key={event._id}
                      className="hover:shadow-xl transition-shadow"
                      style={{
                        backgroundColor: colors.background.card,
                        borderColor: colors.border.primary,
                      }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div
                            className="p-2 rounded-full"
                            style={{ backgroundColor: colors.accent.primary }}
                          >
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEventClick(event)}
                              className="p-1 h-8 w-8"
                              style={{ color: colors.text.secondary }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-8 w-8"
                              style={{ color: colors.text.secondary }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-8 w-8"
                              style={{ color: "#ef4444" }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <h3
                          className="font-semibold text-lg mb-2 line-clamp-2"
                          style={{ color: colors.text.primary }}
                        >
                          {event.title}
                        </h3>
                        <p
                          className="text-sm mb-4 line-clamp-3"
                          style={{ color: colors.text.secondary }}
                        >
                          {event.description}
                        </p>

                        <div
                          className="space-y-2 text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {eventDate.toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {eventDate.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.location}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            {event.currentParticipants || 0} /{" "}
                            {event.maxParticipants} registered
                          </div>
                        </div>

                        <div
                          className="mt-4 pt-4 border-t"
                          style={{ borderColor: colors.border.primary }}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className="text-xs font-medium uppercase tracking-wide"
                              style={{ color: colors.text.tertiary }}
                            >
                              {event.eventType}
                            </span>
                            <span
                              className="px-2 py-1 text-xs font-medium rounded-full"
                              style={{
                                backgroundColor:
                                  eventDate > new Date()
                                    ? `${colors.accent.secondary}20`
                                    : colors.background.secondary,
                                color:
                                  eventDate > new Date()
                                    ? colors.accent.secondary
                                    : colors.text.secondary,
                              }}
                            >
                              {eventDate > new Date() ? "Upcoming" : "Past"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Creation Form */}
      {showEventForm && (
        <EventSubmissionForm
          onSubmit={handleEventSubmit}
          isOpen={showEventForm}
          onClose={() => setShowEventForm(false)}
        />
      )}

      {/* Event Details Modal */}
      {selectedEvent && showEventDetails && (
        <EventDetails
          event={selectedEvent}
          isOpen={showEventDetails}
          onClose={() => {
            setShowEventDetails(false);
            setSelectedEvent(null);
          }}
          onRegister={() => {}}
        />
      )}
    </Layout>
  );
}
