"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/src/components/Header";
import FilterBar from "@/src/components/FilterBar";
import TaskCard from "@/src/components/TaskCard";
import TaskMapView from "@/src/components/TaskMapView";
import { MOCK_TASKS } from "@/src/data/mock-tasks";
import { PAGE_ROUTES } from "@/src/constants/page-routes";

export default function TaskMapPage() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [filters, setFilters] = useState({
    category: "Category",
    location: "50km Davao City 8000 & remotely",
    priceRange: "Any price",
    sort: "Sort",
  });

  const tasks = MOCK_TASKS;

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
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Main Container with max-width */}
      <div className="flex-1 flex flex-col max-w-6xl w-full mx-auto bg-white shadow-lg overflow-hidden">
        {/* Filter Bar with List View Toggle */}
        <div className="relative flex-shrink-0">
          <FilterBar onSearch={handleSearch} onFilterChange={handleFilterChange} />
          
          {/* List View Toggle Button */}
          <Link
            href={PAGE_ROUTES.tasks}
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
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            List View
          </Link>
        </div>

        {/* Main Content - Split View */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Left Sidebar - Task List */}
          <div className="w-[380px] bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
            {/* New Tasks Header */}
            <div className="bg-[#1565C0] text-white px-4 py-3 font-semibold text-center">
              {tasks.length} NEW TASKS
            </div>

            {/* Task Cards */}
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isActive={task.id === selectedTaskId}
                onClick={() => handleTaskSelect(task.id)}
              />
            ))}
          </div>

          {/* Right Panel - Map View */}
          <div className="flex-1 bg-gray-100 overflow-hidden">
            {/* Map */}
            <TaskMapView
              tasks={tasks}
              selectedTaskId={selectedTaskId}
              onTaskSelect={handleTaskSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

