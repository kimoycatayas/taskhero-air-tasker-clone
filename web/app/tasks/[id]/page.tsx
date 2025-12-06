"use client";
import Link from "next/link";
import { PAGE_ROUTES } from "@/src/constants/page-routes";
import { useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/src/components/Header";

export default function TaskDetailsPage() {
  const params = useParams();
  const taskId = params.id as string;

  const [bidAmount, setBidAmount] = useState("");
  const [bidMessage, setBidMessage] = useState("");

  // Mock task data
  const task = {
    id: taskId,
    title: "Fix my leaking faucet",
    description:
      "I have a leaking faucet in my kitchen that needs urgent repair. It's been dripping for a week now and I'm worried about the water bill. Looking for someone with plumbing experience.",
    budget: 500,
    location: "Makati City",
    postedBy: "John Doe",
    postedDate: "2025-12-05",
    status: "open",
  };

  // Mock existing bids
  const existingBids = [
    {
      id: "1",
      taskerName: "Maria Santos",
      amount: 450,
      message: "I have 5 years of plumbing experience. Can start immediately.",
      rating: 4.8,
    },
    {
      id: "2",
      taskerName: "Pedro Cruz",
      amount: 500,
      message: "Licensed plumber. Free warranty for 30 days.",
      rating: 4.5,
    },
    {
      id: "3",
      taskerName: "Ana Reyes",
      amount: 550,
      message: "Professional plumber with tools. Same day service.",
      rating: 4.9,
    },
  ];

  const handleSubmitBid = () => {
    console.log("Submitting bid:", { taskId, bidAmount, bidMessage });
    alert("Bid submitted successfully!");
    setBidAmount("");
    setBidMessage("");
  };

  const handleAcceptBid = (bidId: string) => {
    console.log("Accepting bid:", bidId);
    alert("Bid accepted!");
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

        {/* Task Details */}
        <div className="bg-white border-2 border-gray-200 p-6 rounded-lg mb-8">
          <h1 className="text-3xl font-bold mb-4 text-[#1565C0]">{task.title}</h1>
          <div className="space-y-3 mb-4">
            <p className="text-gray-700 leading-relaxed">{task.description}</p>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <p>
                <span className="font-semibold text-gray-800">Budget:</span>{" "}
                <span className="text-[#FDB913] font-bold text-xl">₱{task.budget}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-800">Location:</span>{" "}
                <span className="text-gray-700">{task.location}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-800">Posted by:</span>{" "}
                <span className="text-gray-700">{task.postedBy}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-800">Posted on:</span>{" "}
                <span className="text-gray-700">{task.postedDate}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-800">Status:</span>{" "}
                <span className="text-green-600 font-semibold">{task.status}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Place a Bid Form */}
        <div className="bg-white border-2 border-[#1565C0] p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#1565C0]">Place Your Bid</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-semibold text-gray-800">Bid Amount (₱)</label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Enter your bid amount"
                className="w-full border-2 border-gray-300 rounded-md p-3 focus:border-[#1565C0] focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-800">Message</label>
              <textarea
                value={bidMessage}
                onChange={(e) => setBidMessage(e.target.value)}
                placeholder="Tell the poster why you're the best for this task"
                rows={4}
                className="w-full border-2 border-gray-300 rounded-md p-3 focus:border-[#1565C0] focus:outline-none"
              />
            </div>
            <button
              onClick={handleSubmitBid}
              className="px-8 py-3 bg-[#1565C0] text-white font-semibold rounded-md hover:bg-[#0D47A1] transition"
            >
              Submit Bid
            </button>
          </div>
        </div>

        {/* Existing Bids */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-[#1565C0]">
            Existing Bids ({existingBids.length})
          </h2>
          <div className="space-y-4">
            {existingBids.map((bid) => (
              <div key={bid.id} className="bg-white border-2 border-gray-200 p-6 rounded-lg hover:border-[#FDB913] transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">{bid.taskerName}</h3>
                    <p className="text-gray-600 mb-2">Rating: ⭐ {bid.rating}</p>
                    <p className="text-2xl font-bold mb-2 text-[#FDB913]">₱{bid.amount}</p>
                    <p className="text-gray-700">{bid.message}</p>
                  </div>
                  <button
                    onClick={() => handleAcceptBid(bid.id)}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition ml-4"
                  >
                    Accept Bid
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

