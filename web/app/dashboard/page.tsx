"use client";

import Link from "next/link";
import { PAGE_ROUTES } from "@/src/constants/page-routes";
import { useState, useEffect } from "react";
import Header from "@/src/components/Header";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";
import { tasksApi, type Task } from "@/src/api/tasks";
import { offersApi, type Offer } from "@/src/api/offers";

export default function DashboardPage() {
  const [userType, setUserType] = useState<"user" | "tasker">("user");
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [myOffers, setMyOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's tasks and offers
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch in parallel for better performance
        const [tasksResponse, offersResponse] = await Promise.all([
          tasksApi.getMyTasks().catch(() => []),
          offersApi.getMyOffers().catch(() => []),
        ]);

        setMyTasks(tasksResponse);
        setMyOffers(offersResponse);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#1565C0]">Dashboard</h1>
            <Link
              href={PAGE_ROUTES.tasks}
              className="px-6 py-2 bg-[#FDB913] text-[#1565C0] font-semibold rounded-md hover:bg-[#E5A812] transition"
            >
              View All Tasks
            </Link>
          </div>

          {/* User Type Toggle */}
          <div className="mb-6 flex gap-4">
            <button
              onClick={() => setUserType("user")}
              className={`px-6 py-3 rounded-md font-semibold transition ${
                userType === "user"
                  ? "bg-[#1565C0] text-white"
                  : "bg-white border-2 border-gray-300 text-gray-700 hover:border-[#1565C0]"
              }`}
            >
              My Tasks
            </button>
            <button
              onClick={() => setUserType("tasker")}
              className={`px-6 py-3 rounded-md font-semibold transition ${
                userType === "tasker"
                  ? "bg-[#1565C0] text-white"
                  : "bg-white border-2 border-gray-300 text-gray-700 hover:border-[#1565C0]"
              }`}
            >
              My Bids
            </button>
          </div>

          {/* User View - My Tasks */}
          {userType === "user" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  My Posted Tasks
                </h2>
                <Link
                  href={PAGE_ROUTES.createTask}
                  className="px-4 py-2 bg-[#1565C0] text-white font-semibold rounded-md hover:bg-[#0D47A1] transition"
                >
                  + Post New Task
                </Link>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
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
                    <p className="text-gray-600">Loading your tasks...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !error && myTasks.length === 0 && (
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <svg
                    className="w-16 h-16 text-gray-300 mx-auto mb-4"
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No tasks posted yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start by creating your first task!
                  </p>
                  <Link
                    href={PAGE_ROUTES.createTask}
                    className="inline-block px-6 py-3 bg-[#1565C0] text-white font-semibold rounded-md hover:bg-[#0D47A1] transition"
                  >
                    Post Your First Task
                  </Link>
                </div>
              )}

              {/* Tasks List */}
              {!isLoading && !error && myTasks.length > 0 && (
                <div className="space-y-4">
                  {myTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white border-2 border-gray-200 p-6 rounded-lg hover:border-[#1565C0] transition"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-xl text-[#1565C0] mb-2">
                            {task.title}
                          </h3>
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Status</p>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                  task.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : task.status === "in_progress"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-orange-100 text-orange-700"
                                }`}
                              >
                                {task.status === "in_progress"
                                  ? "In Progress"
                                  : task.status.charAt(0).toUpperCase() +
                                    task.status.slice(1)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Budget</p>
                              <p className="text-lg font-bold text-gray-900">
                                ${task.budget_min || 0}
                                {task.budget_max &&
                                  task.budget_max !== task.budget_min &&
                                  ` - $${task.budget_max}`}
                              </p>
                            </div>
                          </div>
                          {task.location_address && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                              </svg>
                              {task.location_address}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Posted{" "}
                            {new Date(task.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <Link
                          href={PAGE_ROUTES.taskDetails(task.id)}
                          className="ml-4 px-4 py-2 border-2 border-[#1565C0] text-[#1565C0] font-semibold rounded-md hover:bg-[#1565C0] hover:text-white transition whitespace-nowrap"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tasker View - My Bids/Offers */}
          {userType === "tasker" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                My Bids
              </h2>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
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
                    <p className="text-gray-600">Loading your bids...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !error && myOffers.length === 0 && (
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <svg
                    className="w-16 h-16 text-gray-300 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No bids submitted yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Browse available tasks and make your first offer!
                  </p>
                  <Link
                    href={PAGE_ROUTES.tasks}
                    className="inline-block px-6 py-3 bg-[#1565C0] text-white font-semibold rounded-md hover:bg-[#0D47A1] transition"
                  >
                    Browse Tasks
                  </Link>
                </div>
              )}

              {/* Offers List */}
              {!isLoading && !error && myOffers.length > 0 && (
                <div className="space-y-4">
                  {myOffers.map((offer) => (
                    <div
                      key={offer.id}
                      className="bg-white border-2 border-gray-200 p-6 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-xl text-[#1565C0]">
                          {(offer as any).tasks?.title || "Task"}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            offer.status === "accepted"
                              ? "bg-green-100 text-green-700"
                              : offer.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : offer.status === "withdrawn"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {offer.status.charAt(0).toUpperCase() +
                            offer.status.slice(1)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-700">
                          <span className="font-semibold">Your Bid:</span>{" "}
                          <span className="text-[#FDB913] font-bold text-lg">
                            ${offer.amount}
                          </span>
                        </p>
                        {offer.message && (
                          <p className="text-gray-600 text-sm">
                            <span className="font-semibold">Message:</span>{" "}
                            {offer.message.length > 150
                              ? `${offer.message.substring(0, 150)}...`
                              : offer.message}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Submitted{" "}
                          {new Date(offer.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      {(offer as any).tasks?.id && (
                        <Link
                          href={
                            offer.status === "accepted"
                              ? PAGE_ROUTES.myBidTask((offer as any).tasks.id)
                              : PAGE_ROUTES.taskDetails((offer as any).tasks.id)
                          }
                          className="mt-4 inline-block px-4 py-2 border-2 border-[#1565C0] text-[#1565C0] font-semibold rounded-md hover:bg-[#1565C0] hover:text-white transition text-sm"
                        >
                          View Task
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
