"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  CheckCircle,
  Calendar,
  Users,
  BarChart3,
  Zap,
  Smartphone,
  ListTodo,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export default function LandingPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-white">
        <Navigation />

        <HeroSection />

        <TodoStatsSection />

        <FeaturesSection />

        <Footer />
      </div>
    </AuthGuard>
  );
}



function HeroSection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Organize Your Tasks
            <span className="block text-blue-600">Like Never Before</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your workflow, boost productivity, and achieve your goals
            with our intuitive task management platform. From simple to-dos to
            complex projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/todos"
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              View Todos
            </Link>
          </div>

          {/* Hero Image Placeholder */}
          <div className="mt-16 relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-blue-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-green-200 rounded animate-pulse w-4/5"></div>
                    <div className="h-3 bg-yellow-200 rounded animate-pulse w-3/5"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-purple-200 rounded animate-pulse w-5/6"></div>
                    <div className="h-3 bg-red-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-indigo-200 rounded animate-pulse w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-orange-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-teal-200 rounded animate-pulse w-5/6"></div>
                    <div className="h-3 bg-pink-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TodoStatsSection() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTodoStats();
    } else {
      setLoading(false);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadTodoStats = async () => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("completed")
        .eq("user_id", user?.id);

      if (error) throw error;

      const todos = data || [];
      const total = todos.length;
      const completed = todos.filter(todo => todo.completed).length;
      const active = total - completed;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      setStats({ total, completed, active, completionRate });
    } catch (error) {
      console.error("Error loading todo stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Don't show stats section if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Todo Stats
          </h2>
          <p className="text-lg text-gray-600">
            Track your productivity and stay motivated
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Total Todos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ListTodo className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Todos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            {/* Completed Todos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                </div>
              </div>
            </div>

            {/* Active Todos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                </div>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Action */}
        <div className="text-center mt-8">
          <Link
            href="/todos"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <ListTodo className="w-5 h-5 mr-2" />
            Manage Your Todos
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <CheckCircle className="w-8 h-8 text-blue-600" />,
      title: "Smart Task Management",
      description:
        "Organize tasks with priorities, due dates, and custom categories. Never miss a deadline again.",
    },
    {
      icon: <Calendar className="w-8 h-8 text-green-600" />,
      title: "Intelligent Scheduling",
      description:
        "AI-powered scheduling suggestions help you optimize your time and meet all your deadlines.",
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Team Collaboration",
      description:
        "Share projects, assign tasks, and collaborate seamlessly with your team members.",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-orange-600" />,
      title: "Progress Analytics",
      description:
        "Track your productivity with detailed analytics and insights into your work patterns.",
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Quick Actions",
      description:
        "Lightning-fast task creation and updates with keyboard shortcuts and smart suggestions.",
    },
    {
      icon: <Smartphone className="w-8 h-8 text-indigo-600" />,
      title: "Mobile Sync",
      description:
        "Access your tasks anywhere with real-time sync across all your devices.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to stay productive
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to help individuals and teams accomplish
            more in less time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">TaskFlow</span>
            </div>
            <p className="text-gray-400">
              The ultimate task management solution for individuals and teams.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/todos"
                  className="hover:text-white transition-colors"
                >
                  Todos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/login"
                  className="hover:text-white transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-white transition-colors"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <span className="text-gray-500">Help Center Coming Soon</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 TaskFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
