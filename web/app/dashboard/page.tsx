"use client";

import Link from "next/link";
import { PAGE_ROUTES } from "@/src/constants/page-routes";
import { useState } from "react";
import Header from "@/src/components/Header";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";

export default function DashboardPage() {
  const [userType, setUserType] = useState<"user" | "tasker">("user");

  // Mock data
  const userTasks = [
    { id: "1", title: "Fix my leaking faucet", status: "open", bids: 5 },
    { id: "2", title: "Paint my bedroom", status: "in-progress", bids: 3 },
    { id: "3", title: "Deliver groceries", status: "completed", bids: 8 },
  ];

  const taskerBids = [
    { id: "1", taskTitle: "Fix my leaking faucet", bidAmount: 500, status: "pending" },
    { id: "2", taskTitle: "Clean garage", bidAmount: 1200, status: "accepted" },
    { id: "3", taskTitle: "Deliver groceries", bidAmount: 300, status: "rejected" },
  ];

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

          {/* User View */}
          {userType === "user" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Posted Tasks</h2>
              <div className="space-y-4">
                {userTasks.map((task) => (
                  <div key={task.id} className="bg-white border-2 border-gray-200 p-6 rounded-lg hover:border-[#1565C0] transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-xl text-[#1565C0] mb-2">{task.title}</h3>
                        <div className="space-y-1">
                          <p className="text-gray-600">
                            <span className="font-semibold">Status:</span>{" "}
                            <span className={`${
                              task.status === "completed" ? "text-green-600" :
                              task.status === "in-progress" ? "text-blue-600" :
                              "text-orange-600"
                            }`}>
                              {task.status}
                            </span>
                          </p>
                          <p className="text-gray-600">
                            <span className="font-semibold">Bids:</span> {task.bids}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={PAGE_ROUTES.taskDetails(task.id)}
                        className="px-4 py-2 border-2 border-[#1565C0] text-[#1565C0] font-semibold rounded-md hover:bg-[#1565C0] hover:text-white transition"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasker View */}
          {userType === "tasker" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Bids</h2>
              <div className="space-y-4">
                {taskerBids.map((bid) => (
                  <div key={bid.id} className="bg-white border-2 border-gray-200 p-6 rounded-lg">
                    <h3 className="font-semibold text-xl text-[#1565C0] mb-2">{bid.taskTitle}</h3>
                    <div className="space-y-1">
                      <p className="text-gray-700">
                        <span className="font-semibold">Bid Amount:</span>{" "}
                        <span className="text-[#FDB913] font-bold">₱{bid.bidAmount}</span>
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Status:</span>{" "}
                        <span className={`${
                          bid.status === "accepted" ? "text-green-600" :
                          bid.status === "rejected" ? "text-red-600" :
                          "text-orange-600"
                        }`}>
                          {bid.status}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
