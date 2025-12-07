"use client";

import Link from "next/link";
import { PAGE_ROUTES } from "@/src/constants/page-routes";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/src/components/Header";
import MakeOfferModal from "@/src/components/MakeOfferModal";
import { tasksApi, type Task } from "@/src/api/tasks";
import { offersApi, type Offer } from "@/src/api/offers";
import { useAuth } from "@/src/contexts/AuthContext";

export default function TaskDetailsPage() {
  const params = useParams();
  const taskId = params.id as string;
  const { user } = useAuth();

  // State
  const [task, setTask] = useState<Task | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [acceptingOfferId, setAcceptingOfferId] = useState<string | null>(null);
  const [rejectingOfferId, setRejectingOfferId] = useState<string | null>(null);

  // Check if current user is the task owner
  const isTaskOwner = user && task && task.user_id === user.id;

  // Fetch task and offers
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        const taskData = await tasksApi.getTaskById(taskId);
        setTask(taskData);

        // Fetch offers for everyone (public visibility)
        try {
          const offersData = await offersApi.getOffersByTask(taskId);
          setOffers(offersData);
        } catch (offerErr) {
          // If error fetching offers (e.g., not authenticated), just show empty
          console.log("Could not fetch offers:", offerErr);
          setOffers([]);
        }
      } catch (err) {
        console.error("Error fetching task:", err);
        setError(err instanceof Error ? err.message : "Failed to load task");
      } finally {
        setIsLoading(false);
      }
    }

    if (taskId) {
      fetchData();
    }
  }, [taskId, user]);

  const handleAcceptOffer = async (offerId: string) => {
    try {
      setAcceptingOfferId(offerId);
      await offersApi.updateOffer(offerId, { status: "accepted" });
      
      // Refresh offers list
      const offersData = await offersApi.getOffersByTask(taskId);
      setOffers(offersData);
      
      alert("Offer accepted successfully!");
    } catch (err) {
      console.error("Error accepting offer:", err);
      alert(err instanceof Error ? err.message : "Failed to accept offer");
    } finally {
      setAcceptingOfferId(null);
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    try {
      setRejectingOfferId(offerId);
      await offersApi.updateOffer(offerId, { status: "rejected" });
      
      // Refresh offers list
      const offersData = await offersApi.getOffersByTask(taskId);
      setOffers(offersData);
      
      alert("Offer rejected successfully!");
    } catch (err) {
      console.error("Error rejecting offer:", err);
      alert(err instanceof Error ? err.message : "Failed to reject offer");
    } finally {
      setRejectingOfferId(null);
    }
  };

  const handleOfferSuccess = async () => {
    // Refresh the page data after successful offer
    if (task && user && task.user_id === user.id) {
      const offersData = await offersApi.getOffersByTask(taskId);
      setOffers(offersData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Link
          href={PAGE_ROUTES.tasks}
          className="text-[#1565C0] font-semibold hover:text-[#FDB913] mb-4 inline-block transition"
        >
          ← Back to Tasks
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
            <h3 className="text-red-800 font-semibold mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
            <Link
              href={PAGE_ROUTES.tasks}
              className="mt-4 inline-block text-red-600 hover:text-red-700 font-medium underline"
            >
              Back to tasks list
            </Link>
          </div>
        )}

        {/* Task Details */}
        {!isLoading && !error && task && (
          <>
            {/* Make Offer Modal */}
            <MakeOfferModal
              taskId={task.id}
              taskTitle={task.title}
              taskBudget={task.budget_min || undefined}
              isOpen={isOfferModalOpen}
              onClose={() => setIsOfferModalOpen(false)}
              onSuccess={handleOfferSuccess}
            />

            <div className="bg-white border-2 border-gray-200 p-6 rounded-lg mb-8">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-[#1565C0] flex-1">
                  {task.title}
                </h1>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ml-4 ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : task.status === "in_progress"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {task.status === "in_progress"
                    ? "In Progress"
                    : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {task.description || "No description provided"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Budget</p>
                    <p className="text-[#FDB913] font-bold text-2xl">
                      ${task.budget_min || 0}
                      {task.budget_max &&
                        task.budget_max !== task.budget_min &&
                        ` - $${task.budget_max}`}
                    </p>
                  </div>

                  {task.location_address && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Location</p>
                      <p className="text-gray-800 flex items-center gap-1">
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
                    </div>
                  )}

                  {task.task_date && task.date_type !== "flexible" && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        {task.date_type === "before_date" ? "Deadline" : "Date"}
                      </p>
                      <p className="text-gray-800">
                        {new Date(task.task_date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Posted</p>
                    <p className="text-gray-800">
                      {new Date(task.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Make an Offer Button - Only show if NOT task owner */}
              {!isTaskOwner && user && task.status === "pending" && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setIsOfferModalOpen(true)}
                    className="w-full px-8 py-4 bg-[#1565C0] text-white font-bold text-lg rounded-lg hover:bg-[#0D47A1] transition"
                  >
                    Make an Offer
                  </button>
                </div>
              )}
            </div>

            {/* Offers Section - Public (everyone can see) */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-[#1565C0]">
                {isTaskOwner ? "Offers Received" : "Current Bids"} ({offers.length})
              </h2>

              {offers.length === 0 ? (
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
                    No offers yet
                  </h3>
                  <p className="text-gray-600">
                    {isTaskOwner
                      ? "Taskers will start making offers on your task soon!"
                      : "Be the first to make an offer on this task!"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {offers.map((offer) => (
                    <div
                      key={offer.id}
                      className={`bg-white border-2 p-6 rounded-lg transition ${
                        offer.status === "accepted"
                          ? "border-green-500 bg-green-50"
                          : offer.status === "rejected"
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-[#FDB913]"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                              {offer.user_id.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-gray-800">
                                Tasker
                              </h3>
                              <p className="text-xs text-gray-500">
                                Submitted{" "}
                                {new Date(offer.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="mb-3">
                            <p className="text-3xl font-bold text-[#FDB913] mb-1">
                              ${offer.amount}
                            </p>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                offer.status === "accepted"
                                  ? "bg-green-100 text-green-700"
                                  : offer.status === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {offer.status.charAt(0).toUpperCase() +
                                offer.status.slice(1)}
                            </span>
                          </div>

                          {offer.message && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm font-semibold text-gray-700 mb-1">
                                Message:
                              </p>
                              <p className="text-gray-700">{offer.message}</p>
                            </div>
                          )}
                        </div>

                        {/* Accept/Reject Buttons - Only for task owner and pending offers */}
                        {isTaskOwner && offer.status === "pending" && (
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleAcceptOffer(offer.id)}
                              disabled={acceptingOfferId === offer.id}
                              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {acceptingOfferId === offer.id
                                ? "Accepting..."
                                : "Accept"}
                            </button>
                            <button
                              onClick={() => handleRejectOffer(offer.id)}
                              disabled={rejectingOfferId === offer.id}
                              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {rejectingOfferId === offer.id
                                ? "Rejecting..."
                                : "Reject"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message for non-owner, non-logged-in users */}
            {!isTaskOwner && !user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <p className="text-blue-800 font-semibold mb-2">
                  Want to make an offer on this task?
                </p>
                <p className="text-blue-700 mb-4">
                  Please login or signup to submit your offer.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link
                    href={PAGE_ROUTES.login}
                    className="px-6 py-2 bg-[#1565C0] text-white font-semibold rounded-md hover:bg-[#0D47A1] transition"
                  >
                    Login
                  </Link>
                  <Link
                    href={PAGE_ROUTES.signup}
                    className="px-6 py-2 border-2 border-[#1565C0] text-[#1565C0] font-semibold rounded-md hover:bg-[#1565C0] hover:text-white transition"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

