"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/src/components/Header";
import FilterBar from "@/src/components/FilterBar";
import TaskCard from "@/src/components/TaskCard";
import TaskDetail from "@/src/components/TaskDetail";
import { tasksApi, type Task as ApiTask } from "@/src/api/tasks";
import { PAGE_ROUTES } from "@/src/constants/page-routes";

// Type for the component's task format
type ComponentTask = {
  id: string;
  title: string;
  budget: number;
  location: string;
  deadline: string;
  status: "open" | "assigned" | "completed";
  isRemote: boolean;
  isFlexible: boolean;
  offers?: number;
  posterAvatar?: string;
  postedBy: string;
  postedTime: string;
  details: string;
};

// Transform API task to component task format
function transformTask(apiTask: ApiTask): ComponentTask {
  // Format date
  let deadline = "Flexible";
  if (apiTask.task_date && apiTask.date_type !== "flexible") {
    const date = new Date(apiTask.task_date);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
    };
    if (apiTask.date_type === "before_date") {
      deadline = `Before ${date.toLocaleDateString("en-US", options)}`;
    } else {
      deadline = `On ${date.toLocaleDateString("en-US", options)}`;
    }
  }

  // Format posted time
  const createdDate = new Date(apiTask.created_at);
  const now = new Date();
  const diffMs = now.getTime() - createdDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  let postedTime = "Just now";
  if (diffMins < 60) {
    postedTime = `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    postedTime = `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else {
    postedTime = `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  }

  // Map status
  let status: "open" | "assigned" | "completed" = "open";
  if (apiTask.status === "in_progress") {
    status = "assigned";
  } else if (apiTask.status === "completed") {
    status = "completed";
  }

  // Determine if remote (no specific location)
  const isRemote =
    !apiTask.location_address || apiTask.location_address === "Remote";

  return {
    id: apiTask.id,
    title: apiTask.title,
    budget: apiTask.budget_min || 0,
    location: apiTask.location_address || "Remote",
    deadline,
    status,
    isRemote,
    isFlexible: apiTask.date_type === "flexible",
    offers: apiTask.offer_count || 0, // Use actual offer count from API
    posterAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiTask.user_id}`,
    postedBy: "TaskHero User", // We'll need to join with user data later
    postedTime,
    details: apiTask.description || "No details provided",
  };
}

export default function BrowseTasksPage() {
  const [tasks, setTasks] = useState<ComponentTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [filters, setFilters] = useState({
    category: "Category",
    location: "Within 10KM",
    priceRange: "Any price",
    sort: "Sort",
  });

  // Fetch tasks on component mount
  useEffect(() => {
    async function fetchTasks() {
      try {
        setIsLoading(true);
        setError(null);
        const apiTasks = await tasksApi.getAllTasks();
        const transformedTasks = apiTasks.map(transformTask);
        setTasks(transformedTasks);

        // Auto-select first task if available
        if (transformedTasks.length > 0 && !selectedTaskId) {
          setSelectedTaskId(transformedTasks[0].id);
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError(err instanceof Error ? err.message : "Failed to load tasks");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTasks();
  }, []);

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || null;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowMobileDetail(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Main Container with max-width */}
      <div className="flex-1 flex flex-col max-w-6xl w-full mx-auto bg-white shadow-lg">
        {/* Filter Bar */}
        <FilterBar
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />

        {/* Main Content - Split View */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Task List */}
          <div
            className={`w-full md:w-[380px] bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0 ${
              showMobileDetail ? "hidden md:block" : "block"
            }`}
          >
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center p-8">
                <div className="flex flex-col items-center gap-3">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <p className="text-gray-600">Loading tasks...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="flex-1">
                      <h3 className="text-red-800 font-semibold mb-1">
                        Failed to load tasks
                      </h3>
                      <p className="text-red-700 text-sm">{error}</p>
                      <button
                        onClick={() => window.location.reload()}
                        className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium underline"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <svg
                  className="w-16 h-16 text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No tasks found
                </h3>
                <p className="text-gray-600 mb-4">
                  Be the first to post a task!
                </p>
                <Link
                  href={PAGE_ROUTES.createTask}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Create Task
                </Link>
              </div>
            )}

            {/* Task List */}
            {!isLoading && !error && tasks.length > 0 && (
              <>
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isActive={task.id === selectedTaskId}
                    onClick={() => handleTaskSelect(task.id)}
                  />
                ))}
              </>
            )}
          </div>

          {/* Right Panel - Task Detail */}
          <div
            className={`flex-1 bg-white overflow-hidden ${
              showMobileDetail ? "block" : "hidden md:block"
            }`}
          >
            {/* Mobile back button */}
            {showMobileDetail && (
              <div className="md:hidden p-4 border-b border-gray-200">
                <button
                  onClick={() => setShowMobileDetail(false)}
                  className="flex items-center gap-2 text-blue-600 font-medium"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to tasks
                </button>
              </div>
            )}
            <TaskDetail task={selectedTask} />
          </div>
        </div>
      </div>
    </div>
  );
}
