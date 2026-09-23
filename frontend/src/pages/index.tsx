import Head from "next/head";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { PageLayout } from "../components/layout";
import { useTheme } from "../core/contexts/ThemeContext";
import { useUser } from "@clerk/nextjs";
import { useEmailRouting } from "../core/hooks/useEmailRouting";
import { Layout } from "../components/layout/Layout";
import { Hero } from "../components/common/Hero";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../design/system/card";
import { Badge } from "../design/system/badge";
import {
  Users,
  Clock,
  MapPin,
  Star,
  ArrowRight,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import { mentorCategories } from "../core/lib/data/mentors";
import { HomePageMentors } from "../components/features/mentors/HomePageMentors";
import { Button } from "../design/system/button";
import { mockTopicSubmissions } from "../core/lib/data/groupSessions";
import { TrendingTopics } from "../components/features/community/TrendingTopics";
import { HomePageEvents } from "../components/features/events/HomePageEvents";

export default function HomePage() {
  const { colors, isDarkMode, getAccentColor } = useTheme();
  const { user, isSignedIn, isLoaded } = useUser();
  const { userRole, isMentor } = useEmailRouting();

  // Get recommended mentors from the first category (software engineers) for homepage
  const recommendedMentors = mentorCategories[0];

  // Mock data for topic discussions
  const trendingTopics = [
    {
      id: 1,
      title: "Building Scalable Microservices",
      category: "Architecture",
      participants: 24,
      replies: 18,
      lastActivity: "2 hours ago",
      tags: ["Microservices", "Scalability", "Best Practices"],
      author: "Community",
      upvotes: 15,
      downvotes: 2,
      description:
        "Learn how to design and implement scalable microservices architecture for enterprise applications.",
    },
    {
      id: 2,
      title: "Modern React Patterns in 2024",
      category: "Frontend",
      participants: 31,
      replies: 25,
      lastActivity: "4 hours ago",
      tags: ["React", "JavaScript", "Patterns"],
      author: "Community",
      upvotes: 22,
      downvotes: 1,
      description:
        "Explore the latest React patterns and best practices for building modern, performant applications.",
    },
    {
      id: 3,
      title: "AI in Software Development",
      category: "Emerging Tech",
      participants: 42,
      replies: 33,
      lastActivity: "6 hours ago",
      tags: ["AI", "Development", "Future"],
      author: "Community",
      upvotes: 28,
      downvotes: 3,
      description:
        "Discover how AI is transforming software development and learn practical implementation strategies.",
    },
  ];

  // Real data from group sessions section (matching the image)
  const groupSessionTopics = [
    {
      id: "1",
      title: "React Performance Optimization",
      category: "Frontend Development",
      author: "Alex Chen",
      date: "12/1/2024",
      description:
        "I want to learn how to make my React apps faster and more efficient. Looking for practical tips and real-world examples.",
      upvotes: 3,
      downvotes: 0,
      responses: 0,
      tags: ["React", "Performance", "Optimization"],
    },
    {
      id: "2",
      title: "MongoDB Aggregation Pipelines",
      category: "Backend Development",
      author: "Sarah Kim",
      date: "12/1/2024",
      description:
        "I need help understanding complex MongoDB aggregations for data analysis. The syntax is confusing me.",
      upvotes: 2,
      downvotes: 0,
      responses: 0,
      tags: ["MongoDB", "Aggregation", "Data Analysis"],
    },
    {
      id: "3",
      title: "Next.js Authentication",
      category: "Full-Stack Development",
      author: "Mike Johnson",
      date: "12/1/2024",
      description:
        "How to implement secure authentication in Next.js? I want to understand the best practices.",
      upvotes: 2,
      downvotes: 0,
      responses: 0,
      tags: ["Next.js", "Authentication", "Security"],
    },
    {
      id: "4",
      title: "React Hooks",
      category: "Frontend Development",
      author: "Enkhzaya Bumbo",
      date: "12/1/2024",
      description:
        "Understanding React Hooks and their best practices for modern React development.",
      upvotes: 2,
      downvotes: 0,
      responses: 0,
      tags: ["React", "Hooks", "Modern Development"],
    },
    {
      id: "5",
      title: "React",
      category: "Frontend Development",
      author: "zaya bumbo",
      date: "12/1/2024",
      description:
        "Learning React fundamentals and building interactive user interfaces.",
      upvotes: 2,
      downvotes: 0,
      responses: 0,
      tags: ["React", "Fundamentals", "UI"],
    },
    {
      id: "6",
      title: "MongoDB",
      category: "Backend Development",
      author: "zaya bumbo",
      date: "12/1/2024",
      description:
        "Understanding MongoDB database operations and data modeling.",
      upvotes: 2,
      downvotes: 0,
      responses: 0,
      tags: ["MongoDB", "Database", "Data Modeling"],
    },
  ];

  // Combine trending topics with real group session topics
  const allTopics = [
    ...trendingTopics,
    ...groupSessionTopics.map((topic) => ({
      id: `group-${topic.id}`,
      title: topic.title,
      category: topic.category,
      participants: topic.upvotes + topic.downvotes + topic.responses + 5, // Calculate from real data
      replies: topic.responses,
      lastActivity: topic.date,
      tags: topic.tags,
      author: topic.author,
      upvotes: topic.upvotes,
      downvotes: topic.downvotes,
      description: topic.description,
    })),
  ];

  // Mock data for today's events
  const todaysEvents = [
    {
      id: 1,
      title: "React Performance Workshop",
      time: "2:00 PM - 4:00 PM",
      mentor: "Sarah Chen",
      participants: 12,
      maxParticipants: 20,
      type: "Workshop",
      status: "Open",
    },
    {
      id: 2,
      title: "System Design Interview Prep",
      time: "6:00 PM - 7:30 PM",
      mentor: "Marcus Rodriguez",
      participants: 8,
      maxParticipants: 15,
      type: "Study Group",
      status: "Open",
    },
    {
      id: 3,
      title: "Data Science Q&A Session",
      time: "8:00 PM - 9:00 PM",
      mentor: "Aisha Patel",
      participants: 15,
      maxParticipants: 25,
      type: "Q&A",
      status: "Almost Full",
    },
  ];

  return (
    <Layout>
      <Hero />
      <Head>
        <title>Pineder - Mentorship Platform</title>
        <meta
          name="description"
          content="Connect with mentors and grow your skills"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Recommended Mentors Section */}
      <section
        className="py-20 transition-colors duration-300"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="flex items-center justify-center mb-4"></div>
            <h2
              className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl"
              style={{ color: colors.text.primary }}
            >
              {isMentor ? (
                <>
                  Your Knowledge
                  <span
                    className="block text-transparent bg-gradient-to-r bg-clip-text"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${getAccentColor()}, ${getAccentColor()})`,
                    }}
                  >
                    Their Growth
                  </span>
                </>
              ) : (
                <>
                  Learn from the
                  <span
                    className="block text-transparent bg-gradient-to-r bg-clip-text"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${getAccentColor()}, ${getAccentColor()})`,
                    }}
                  >
                    Best in Tech
                  </span>
                </>
              )}
            </h2>
            <p
              className="max-w-3xl mx-auto text-xl"
              style={{ color: colors.text.secondary }}
            >
              {isMentor
                ? "Every mentor has a story worth sharing. Contribute your experience and help students unlock their potential in tech."
                : "Connect with experienced professionals who are passionate about sharing their knowledge and helping you grow."}
            </p>
          </div>

          <div className="w-full">
            {/* Full Width Mentor Categories */}
            <div className="w-full">
              <div
                className={`w-full p-6 border-0 shadow-lg transition-all duration-200 ${
                  isDarkMode
                    ? "bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20"
                    : "bg-white border border-black/20"
                } rounded-3xl`}
              >
                <div className="space-y-8">
                  <HomePageMentors
                    category={recommendedMentors}
                    isDarkMode={isDarkMode}
                    onTeacherClick={() => {}}
                    onBookSession={() => {}}
                    isMentor={isMentor}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Topics Section */}
      <TrendingTopics allTopics={allTopics} isMentor={isMentor} />

      {/* Today's Events Section */}
      <HomePageEvents events={todaysEvents} />
    </Layout>
  );
}
