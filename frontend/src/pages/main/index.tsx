import Head from "next/head";
import Link from "next/link";
import { Layout } from "../../components/layout/Layout";
import { Teachers } from "../../features/mentorship/Teachers";
import { Pricing } from "../../components/common/Pricing";
// import { Dashboard } from "../../components/features/dashboard/Dashboard";
import { Users, Lightbulb, ThumbsUp, Target } from "lucide-react";
import { useTheme } from "../../core/contexts/ThemeContext";
import { PostSignInRedirect } from "../../components/features/auth/PostSignInRedirect";

export default function Home() {
  const { isDarkMode, colors } = useTheme();

  return (
    <Layout>
      <PostSignInRedirect />
      <Head>
        <title>Pineder - Mentorship Platform</title>
        <meta
          name="description"
          content="Connect with mentors and grow your skills"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Teachers />
      <Pricing />
      {/* <Dashboard /> */}

      {/* Group Sessions Section */}
      <section
        className="py-24 transition-colors duration-200"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="flex items-center justify-center mb-4">
              <Users
                className="w-6 h-6 mr-2"
                style={{ color: colors.accent.primary }}
              />
              <span
                className="text-sm tracking-wider uppercase"
                style={{ color: colors.text.secondary }}
              >
                Collaborative Learning
              </span>
            </div>
            <h2
              className="mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl"
              style={{ color: colors.text.primary }}
            >
              Join Group Study Sessions
              <span
                className="block text-transparent bg-gradient-to-r bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(to right, ${colors.accent.primary}, ${colors.accent.secondary}, ${colors.accent.success})`,
                }}
              >
                Learn Together, Grow Together
              </span>
            </h2>
            <p
              className="max-w-2xl mx-auto text-lg"
              style={{ color: colors.text.secondary }}
            >
              Suggest topics, vote on what to learn, and join collaborative
              group sessions with peers and mentors.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-3">
            <div
              className="p-6 text-center transition-colors duration-200 border rounded-xl"
              style={{
                backgroundColor: isDarkMode
                  ? colors.background.secondary
                  : colors.background.primary,
                borderColor: colors.border.primary,
              }}
            >
              <div
                className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full"
                style={{
                  background: `linear-gradient(to bottom right, ${colors.accent.primary}, ${colors.accent.secondary})`,
                }}
              >
                <Lightbulb
                  className="w-8 h-8"
                  style={{ color: colors.text.inverse }}
                />
              </div>
              <h3
                className="mb-2 text-xl font-semibold"
                style={{ color: colors.text.primary }}
              >
                Suggest Topics
              </h3>
              <p style={{ color: colors.text.secondary }}>
                Share what you want to learn and get feedback from the
                community.
              </p>
            </div>

            <div
              className="p-6 text-center transition-colors duration-200 border rounded-xl"
              style={{
                backgroundColor: isDarkMode
                  ? colors.background.secondary
                  : colors.background.primary,
                borderColor: colors.border.primary,
              }}
            >
              <div
                className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full"
                style={{
                  background: `linear-gradient(to bottom right, ${colors.accent.secondary}, ${colors.accent.success})`,
                }}
              >
                <ThumbsUp
                  className="w-8 h-8"
                  style={{ color: colors.text.inverse }}
                />
              </div>
              <h3
                className="mb-2 text-xl font-semibold"
                style={{ color: colors.text.primary }}
              >
                Vote & Choose
              </h3>
              <p style={{ color: colors.text.secondary }}>
                Vote on topics you&apos;re interested in and help decide what
                gets studied.
              </p>
            </div>

            <div
              className="p-6 text-center transition-colors duration-200 border rounded-xl"
              style={{
                backgroundColor: isDarkMode
                  ? colors.background.secondary
                  : colors.background.primary,
                borderColor: colors.border.primary,
              }}
            >
              <div
                className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full"
                style={{
                  background: `linear-gradient(to bottom right, ${colors.accent.success}, ${colors.accent.primary})`,
                }}
              >
                <Target
                  className="w-8 h-8"
                  style={{ color: colors.text.inverse }}
                />
              </div>
              <h3
                className="mb-2 text-xl font-semibold"
                style={{ color: colors.text.primary }}
              >
                Join Sessions
              </h3>
              <p style={{ color: colors.text.secondary }}>
                Participate in group learning sessions with peers and expert
                mentors.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/group-sessions"
              className="inline-flex items-center px-6 py-3 text-lg font-medium transition-all duration-300 transform rounded-xl hover:scale-105"
              style={{
                background: `linear-gradient(to right, ${colors.accent.primary}, ${colors.accent.secondary})`,
                color: colors.text.inverse,
              }}
            >
              Explore Group Sessions
              <Users className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
