import { Layout } from "../../components/layout/Layout";
import Head from "next/head";

export default function ProfileDemo() {
  return (
    <Layout className="bg-white dark:bg-[#0F0E0E]">
      <Head>
        <title>Profile Demo - Pineder</title>
        <meta name="description" content="Demo of the UserProfile component" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="px-4 pt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-8 text-3xl font-bold text-center">
            User Profile Component Demo
          </h1>

          <div className="p-8 border rounded-lg bg-card">
            <h2 className="mb-4 text-xl font-semibold">How to use:</h2>
            <ol className="space-y-2 list-decimal list-inside text-muted-foreground">
              <li>
                Sign in to your account using the Sign In button in the
                navigation
              </li>
              <li>
                Once signed in, you&apos;ll see your profile avatar in the
                top-right corner
              </li>
              <li>Click on the avatar to open the profile modal</li>
              <li>
                The profile shows your name, email, role, topics, rating, and
                more
              </li>
              <li>Click outside or the X button to close the modal</li>
            </ol>

            <div className="p-4 mt-8 rounded-lg bg-muted">
              <h3 className="mb-2 font-medium">Component Features:</h3>
              <ul className="space-y-1 text-sm list-disc list-inside text-muted-foreground">
                <li>Responsive design that works on mobile and desktop</li>
                <li>Smooth animations using Framer Motion</li>
                <li>Dark mode support</li>
                <li>Accessible dialog implementation</li>
                <li>Customizable user data through props</li>
                <li>Role-based display (Student/Teacher)</li>
              </ul>
            </div>

            <div className="p-4 mt-8 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <h3 className="mb-2 font-medium text-blue-800 dark:text-blue-200">
                How to Test:
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  • Sign in to your account to see the profile avatar in the
                  navigation
                </p>
                <p>• Click on the avatar to open the profile modal</p>
                <p>
                  • The profile shows your name, email, role, and other details
                </p>
                <p>• Click outside or the X button to close the modal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
