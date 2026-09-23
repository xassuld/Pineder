import { motion } from "framer-motion";
import {
  Users,
  Search,
  Plus,
  ArrowLeft,
  Hash,
  MessageCircle,
  Calendar,
  MapPin,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../../design/system/button";
import { Layout } from "../../components/layout/Layout";
import { useState } from "react";

export default function CommunityCommunities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const communities = [
    {
      id: 1,
      name: "React Developers",
      description:
        "A community for React developers to share knowledge, ask questions, and collaborate on projects.",
      members: 1247,
      category: "Frontend",
      location: "Global",
      lastActivity: "2 hours ago",
      topics: ["React", "JavaScript", "TypeScript", "Frontend"],
      isJoined: false,
    },
    {
      id: 2,
      name: "Python Beginners",
      description:
        "Perfect for those starting their Python journey. Share resources, ask questions, and grow together.",
      members: 892,
      category: "Backend",
      location: "Global",
      lastActivity: "1 day ago",
      topics: ["Python", "Programming", "Beginners", "Learning"],
      isJoined: true,
    },
    {
      id: 3,
      name: "Mobile App Development",
      description:
        "Discuss mobile app development across platforms including iOS, Android, and cross-platform solutions.",
      members: 567,
      category: "Mobile",
      location: "Global",
      lastActivity: "3 hours ago",
      topics: ["Mobile", "iOS", "Android", "React Native"],
      isJoined: false,
    },
    {
      id: 4,
      name: "Data Science Enthusiasts",
      description:
        "Explore data science, machine learning, and AI. Share insights, projects, and learn from experts.",
      members: 2034,
      category: "Data Science",
      location: "Global",
      lastActivity: "5 hours ago",
      topics: ["Data Science", "Machine Learning", "AI", "Python"],
      isJoined: false,
    },
    {
      id: 5,
      name: "Web Design & UX",
      description:
        "Focus on web design principles, user experience, and creating beautiful, functional interfaces.",
      members: 756,
      category: "Design",
      location: "Global",
      lastActivity: "1 day ago",
      topics: ["Design", "UX", "UI", "Web Design"],
      isJoined: true,
    },
    {
      id: 6,
      name: "DevOps & Cloud",
      description:
        "Discuss DevOps practices, cloud platforms, and infrastructure as code.",
      members: 445,
      category: "DevOps",
      location: "Global",
      lastActivity: "4 hours ago",
      topics: ["DevOps", "AWS", "Docker", "Kubernetes"],
      isJoined: false,
    },
  ];

  const categories = [
    "All",
    "Frontend",
    "Backend",
    "Mobile",
    "Data Science",
    "Design",
    "DevOps",
    "Other",
  ];

  const filteredCommunities = communities.filter((community) => {
    const matchesSearch =
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.topics.some((topic) =>
        topic.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "All" || community.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleJoinToggle = (communityId: number) => {
    // In a real app, this would make an API call
  };

  return (
    <Layout className="bg-white dark:bg-[#0F0E0E]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--pico-secondary)] to-[var(--pico-accent)] text-white">
        <div className="container px-4 py-16 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Link
              href="/"
              className="inline-flex items-center mb-6 space-x-2 transition-opacity hover:opacity-80"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Discover Communities
            </h1>
            <p className="max-w-2xl mx-auto text-xl opacity-90">
              Join vibrant communities, connect with like-minded developers, and
              grow your skills together
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-16 mx-auto">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search communities, topics, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--pico-secondary)]"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-[var(--pico-secondary)] text-white hover:bg-[var(--pico-secondary)]/90"
                      : "border-border hover:bg-foreground/5"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Header Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-start justify-between mb-8 md:flex-row md:items-center"
        >
          <div>
            <h2 className="mb-2 text-3xl font-bold text-foreground">
              Available Communities
            </h2>
            <p className="text-muted-foreground">
              {filteredCommunities.length} community
              {filteredCommunities.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <Button className="bg-gradient-to-r from-[var(--pico-secondary)] to-[var(--pico-accent)] text-white hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4 mr-2" />
            Create Community
          </Button>
        </motion.div>

        {/* Communities Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredCommunities.map((community, index) => (
            <motion.div
              key={community.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="p-6 transition-shadow duration-300 border rounded-lg bg-card border-border hover:shadow-lg"
            >
              {/* Community Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2 space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-[var(--pico-secondary)] to-[var(--pico-accent)] rounded-lg flex items-center justify-center">
                      <Hash className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {community.name}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {community.category}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant={community.isJoined ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleJoinToggle(community.id)}
                  className={
                    community.isJoined
                      ? "border-[var(--pico-secondary)] text-[var(--pico-secondary)] hover:bg-[var(--pico-secondary)]/10"
                      : "bg-[var(--pico-secondary)] hover:bg-[var(--pico-secondary)]/90"
                  }
                >
                  {community.isJoined ? "Joined" : "Join"}
                </Button>
              </div>

              {/* Description */}
              <p className="mb-4 text-muted-foreground line-clamp-3">
                {community.description}
              </p>

              {/* Topics */}
              <div className="flex flex-wrap gap-2 mb-4">
                {community.topics.slice(0, 3).map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-1 bg-[var(--pico-secondary)]/10 text-[var(--pico-secondary)] rounded-full text-xs"
                  >
                    {topic}
                  </span>
                ))}
                {community.topics.length > 3 && (
                  <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                    +{community.topics.length - 3} more
                  </span>
                )}
              </div>

              {/* Community Stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Users2 className="w-4 h-4" />
                    <span>{community.members.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>Active</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{community.lastActivity}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredCommunities.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="py-16 text-center"
          >
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              No communities found
            </h3>
            <p className="mb-6 text-muted-foreground">
              {searchTerm || selectedCategory !== "All"
                ? "Try adjusting your search or filters"
                : "Be the first to create a community!"}
            </p>
            {!searchTerm && selectedCategory === "All" && (
              <Button className="bg-gradient-to-r from-[var(--pico-secondary)] to-[var(--pico-accent)] text-white hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4 mr-2" />
                Create First Community
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
