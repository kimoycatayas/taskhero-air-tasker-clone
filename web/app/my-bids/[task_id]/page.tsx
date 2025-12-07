"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/src/components/Header";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";
import { tasksApi, type Task } from "@/src/api/tasks";
import { offersApi, type Offer } from "@/src/api/offers";
import { PAGE_ROUTES } from "@/src/constants/page-routes";

export default function MyBidTaskPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.task_id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch task and offer details
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch task details and my offers in parallel
        const [taskData, offersData] = await Promise.all([
          tasksApi.getTaskById(taskId),
          offersApi.getMyOffers(),
        ]);

        // Find the specific offer for this task
        const myOffer = offersData.find((o: any) => {
          const offerTaskId = o.tasks?.id || o.task_id;
          return offerTaskId === taskId;
        });

        if (!myOffer) {
          setError("You don't have an offer for this task");
          return;
        }

        // Check if the offer is accepted
        if (myOffer.status !== "accepted") {
          setError("This offer has not been accepted yet");
          return;
        }

        setTask(taskData);
        setOffer(myOffer);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load task details"
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (taskId) {
      fetchData();
    }
  }, [taskId]);

  const handleCompleteTask = async () => {
    if (!task || !offer) return;

    const confirmed = window.confirm(
      "Are you sure you want to mark this task as completed? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setActionLoading("complete");
      await tasksApi.completeTask(task.id);

      // Redirect to dashboard with success message
      router.push(PAGE_ROUTES.dashboard);
    } catch (err) {
      console.error("Error completing task:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Failed to complete task. Please try again."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineTask = async () => {
    if (!task || !offer) return;

    const confirmed = window.confirm(
      "Are you sure you want to decline this task? Your accepted offer will be withdrawn."
    );

    if (!confirmed) return;

    try {
      setActionLoading("decline");
      await tasksApi.declineTask(task.id);

      // Redirect to dashboard
      router.push(PAGE_ROUTES.dashboard);
    } catch (err) {
      console.error("Error declining task:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Failed to decline task. Please try again."
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Back Button */}
          <Link
            href={PAGE_ROUTES.dashboard}
            className="inline-flex items-center text-[#1565C0] hover:underline mb-6"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </Link>

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
                <p className="text-gray-600">Loading task details...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-red-700 mb-2">
                Error
              </h3>
              <p className="text-red-600">{error}</p>
              <Link
                href={PAGE_ROUTES.dashboard}
                className="mt-4 inline-block px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
              >
                Return to Dashboard
              </Link>
            </div>
          )}

          {/* Task Details */}
          {!isLoading && !error && task && offer && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h1 className="text-3xl font-bold text-[#1565C0] mb-4">
                  {task.title}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
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
                  <span className="px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                    Your Offer Accepted
                  </span>
                </div>
              </div>

              {/* Your Offer Details */}
              <div className="bg-white border-2 border-[#1565C0] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Your Accepted Bid
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Your Bid Amount</p>
                    <p className="text-3xl font-bold text-[#FDB913]">
                      ${offer.amount}
                    </p>
                  </div>
                  {offer.message && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Your Message</p>
                      <p className="text-gray-700">{offer.message}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Submitted</p>
                    <p className="text-gray-700">
                      {new Date(offer.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Task Description */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Task Description
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {task.description || "No description provided."}
                </p>
              </div>

              {/* Task Details Grid */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Task Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Budget */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Task Budget</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${task.budget_min || 0}
                      {task.budget_max &&
                        task.budget_max !== task.budget_min &&
                        ` - $${task.budget_max}`}
                    </p>
                  </div>

                  {/* Date */}
                  {task.task_date && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {task.date_type === "on_date"
                          ? "Task Date"
                          : task.date_type === "before_date"
                          ? "Complete Before"
                          : "Date"}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(task.task_date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  )}

                  {/* Location */}
                  {task.location_address && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 mb-1">Location</p>
                      <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-[#1565C0]"
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
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {task.location_address}
                      </p>
                    </div>
                  )}

                  {/* Posted Date */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Posted</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(task.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {task.status === "in_progress" && (
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Task Actions
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Once you've completed the task, mark it as complete. If you
                    need to decline this task, you can do so below.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleCompleteTask}
                      disabled={actionLoading !== null}
                      className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {actionLoading === "complete" ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5"
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
                          Completing...
                        </>
                      ) : (
                        <>
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Complete Task
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleDeclineTask}
                      disabled={actionLoading !== null}
                      className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {actionLoading === "decline" ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5"
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
                          Declining...
                        </>
                      ) : (
                        <>
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Decline Task
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Task Already Completed */}
              {task.status === "completed" && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <h3 className="text-xl font-semibold text-green-800">
                        Task Completed
                      </h3>
                      <p className="text-green-700">
                        This task has been marked as completed.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

