"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/src/components/Header";
import FilterBar from "@/src/components/FilterBar";
import TaskCard from "@/src/components/TaskCard";
import TaskDetail from "@/src/components/TaskDetail";
import { MOCK_TASKS } from "@/src/data/mock-tasks";
import { PAGE_ROUTES } from "@/src/constants/page-routes";

export default function BrowseTasksPage() {
  const [selectedTaskId, setSelectedTaskId] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [filters, setFilters] = useState({
    category: "Category",
    location: "50km Davao City 8000 & remotely",
    priceRange: "Any price",
    sort: "Sort",
  });

  const tasks = MOCK_TASKS;
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
        {/* Filter Bar with Map Toggle */}
        <div className="relative">
          <FilterBar onSearch={handleSearch} onFilterChange={handleFilterChange} />
          
          {/* Map View Toggle Button */}
          <Link
            href={PAGE_ROUTES.tasksMap}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#1565C0] hover:bg-[#0D47A1] text-white px-4 py-2 rounded-md font-semibold text-sm flex items-center gap-2 transition z-10"
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
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            Map View
          </Link>
        </div>

        {/* Main Content - Split View */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Task List */}
          <div
            className={`w-full md:w-[380px] bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0 ${
              showMobileDetail ? "hidden md:block" : "block"
            }`}
          >
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isActive={task.id === selectedTaskId}
                onClick={() => handleTaskSelect(task.id)}
              />
            ))}
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

