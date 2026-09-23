import { motion } from "framer-motion";
import { Button } from "../../design/system/button";
import { useTheme } from "../../core/contexts/ThemeContext";
import {
  Target,
  Users,
  MessageCircle,
  Calendar,
  BookOpen,
  TrendingUp,
  Sparkles,
  Gift,
  IceCream,
  Coffee,
} from "lucide-react";

export function Pricing() {
  const { isDarkMode, colors } = useTheme();
  const pricingPlans = [
    {
      name: "Free",
      price: "Free",
      currency: "Free",
      description: "Perfect for getting started with mentorship",
      icon: Gift,
      features: [
        "Access to community forums",
        "Basic mentor profiles",
        "Group sessions",
        "Standard support",
        "Progress tracking",
        "Direct mentor messaging",
        "Basic booking",
        "Community access",
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      popular: false,
      priceDescription: "forever",
    },
    {
      name: "Ice Cream",
      price: "1",
      currency: "Ice Cream",
      description: "Sweet learning experience with enhanced features",
      icon: IceCream,
      features: [
        "Everything in Free",
        "Priority mentor access",
        "Advanced group sessions",
        "Premium support",
        "Detailed progress analytics",
        "Direct mentor messaging",
        "Priority booking",
        "Exclusive content",
        "Mentor recommendations",
      ],
      buttonText: "Choose Ice Cream",
      buttonVariant: "outline" as const,
      popular: false,
      priceDescription: "ice cream cone",
    },
    {
      name: "Coffee",
      price: "1",
      currency: "Coffee",
      description: "Energizing boost for serious learners",
      icon: Coffee,
      features: [
        "Everything in Ice Cream",
        "VIP mentor access",
        "1-on-1 sessions",
        "24/7 priority support",
        "Custom learning paths",
        "Advanced analytics dashboard",
        "Exclusive workshops",
        "Career guidance",
        "Networking events",
        "Certificate programs",
      ],
      buttonText: "Choose Coffee",
      buttonVariant: "default" as const,
      popular: true,
      priceDescription: "coffee",
    },
  ];

  const features = [
    {
      icon: Users,
      title: "Expert Mentors",
      description: "Access to verified industry professionals",
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set and monitor your learning objectives",
    },
    {
      icon: MessageCircle,
      title: "Direct Communication",
      description: "Connect with mentors through chat and calls",
    },
    {
      icon: Calendar,
      title: "Flexible Scheduling",
      description: "Book sessions that fit your timeline",
    },
    {
      icon: BookOpen,
      title: "Learning Resources",
      description: "Curated content and study materials",
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description: "Track your growth with detailed insights",
    },
  ];

  return (
    <section
      id="pricing"
      className="py-24 transition-colors duration-200"
      style={{ backgroundColor: colors.background.primary }}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center mb-4"
          >
            <div
              className="flex items-center justify-center w-12 h-12 rounded-2xl"
              style={{
                background: `linear-gradient(to bottom right, ${colors.accent.success}, ${colors.accent.info})`,
              }}
            >
              <Sparkles
                className="w-6 h-6"
                style={{ color: colors.text.inverse }}
              />
            </div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl"
            style={{ color: colors.text.primary }}
          >
            Choose Your
            <span
              className="block text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(to right, ${colors.accent.success}, ${colors.accent.info}, ${colors.accent.warning})`,
              }}
            >
              Flavor
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg"
            style={{ color: colors.text.secondary }}
          >
            Same opportunities, different flavors! Choose between ice cream or
            coffee - both give you access to the same amazing mentorship
            features.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-8 mx-auto md:grid-cols-2 lg:grid-cols-3 max-w-7xl">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 ${
                plan.popular ? "lg:scale-105 border-2" : "border"
              }`}
              style={{
                backgroundColor: isDarkMode
                  ? colors.background.secondary
                  : colors.background.primary,
                borderColor: plan.popular
                  ? colors.accent.success
                  : colors.border.primary,
              }}
            >
              {plan.popular && (
                <div className="absolute transform -translate-x-1/2 -top-4 left-1/2">
                  <span
                    className="px-4 py-2 text-sm font-medium text-white rounded-full"
                    style={{
                      background: `linear-gradient(to right, ${colors.accent.success}, ${colors.accent.info})`,
                    }}
                  >
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6 text-center">
                <div
                  className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-2xl"
                  style={{
                    background: `linear-gradient(to bottom right, ${colors.accent.success}, ${colors.accent.info})`,
                  }}
                >
                  <plan.icon
                    className="w-8 h-8"
                    style={{ color: colors.text.inverse }}
                  />
                </div>
                <h3
                  className="mb-2 text-2xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  {plan.name}
                </h3>
                <div className="flex items-center justify-center mb-2 space-x-2">
                  {plan.price === "Free" ? (
                    <>
                      <Gift
                        className="w-12 h-12"
                        style={{ color: colors.accent.success }}
                      />
                      <span
                        className="text-4xl font-bold"
                        style={{ color: colors.text.primary }}
                      >
                        {plan.price}
                      </span>
                    </>
                  ) : (
                    <>
                      {plan.name === "Ice Cream" ? (
                        <IceCream
                          className="w-12 h-12"
                          style={{ color: colors.accent.warning }}
                        />
                      ) : (
                        <Coffee
                          className="w-12 h-12"
                          style={{ color: colors.accent.error }}
                        />
                      )}
                      <span
                        className="text-4xl font-bold"
                        style={{ color: colors.text.primary }}
                      >
                        {plan.price}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-lg" style={{ color: colors.text.secondary }}>
                  {plan.price === "Free" ? "free" : plan.priceDescription}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Fun Pricing Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12 text-center"
        >
          <div
            className="p-8 transition-colors duration-200 border rounded-3xl"
            style={{
              backgroundColor: isDarkMode
                ? colors.background.secondary
                : colors.background.primary,
              borderColor: colors.border.primary,
            }}
          >
            <div className="flex items-center justify-center mb-4 space-x-4">
              <IceCream
                className="w-12 h-12"
                style={{ color: colors.accent.warning }}
              />
              <Coffee
                className="w-12 h-12"
                style={{ color: colors.accent.error }}
              />
            </div>
            <h3
              className="mb-3 text-xl font-semibold"
              style={{ color: colors.text.primary }}
            >
              Why Ice Cream & Coffee Pricing?
            </h3>
            <p
              className="max-w-3xl mx-auto"
              style={{ color: colors.text.secondary }}
            >
              We believe learning should be as delightful as your favorite
              treats! Both plans offer the same amazing opportunities -
              it&apos;s just a matter of whether you prefer something sweet (Ice
              Cream) or energizing (Coffee). The choice is yours!
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12 text-center"
        ></motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center"
        >
          <div
            className="p-8 transition-colors duration-200 border shadow-lg rounded-3xl"
            style={{
              backgroundColor: isDarkMode
                ? colors.background.secondary
                : colors.background.primary,
              borderColor: colors.border.primary,
            }}
          >
            <h3
              className="mb-4 text-2xl font-bold"
              style={{ color: colors.text.primary }}
            >
              Ready to Choose Your Flavor?
            </h3>
            <p
              className="max-w-2xl mx-auto mb-6"
              style={{ color: colors.text.secondary }}
            >
              Join thousands of professionals who have transformed their careers
              through mentorship. Start your journey today - pick your favorite
              flavor and get started! 🍦☕
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
