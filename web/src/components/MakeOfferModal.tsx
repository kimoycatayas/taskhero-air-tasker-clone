"use client";

import { useState } from "react";
import { offersApi } from "@/src/api/offers";

interface MakeOfferModalProps {
  taskId: string;
  taskTitle: string;
  taskBudget?: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function MakeOfferModal({
  taskId,
  taskTitle,
  taskBudget,
  isOpen,
  onClose,
  onSuccess,
}: MakeOfferModalProps) {
  const [amount, setAmount] = useState(taskBudget?.toString() || "");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const offerAmount = parseFloat(amount);

    if (!offerAmount || offerAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!message.trim()) {
      setError("Please include a message with your offer");
      return;
    }

    setIsSubmitting(true);

    try {
      await offersApi.createOffer({
        task_id: taskId,
        amount: offerAmount,
        message: message.trim(),
        currency: "USD",
      });

      // Success!
      setAmount("");
      setMessage("");
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error creating offer:", err);
      setError(err instanceof Error ? err.message : "Failed to create offer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setAmount("");
      setMessage("");
      setError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Make an Offer</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
          >
            <svg
              className="w-6 h-6"
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
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Task Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Task</div>
            <div className="font-semibold text-gray-900">{taskTitle}</div>
            {taskBudget && (
              <div className="text-sm text-gray-600 mt-2">
                Budget: <span className="font-semibold">${taskBudget}</span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Offer Amount */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Your Offer Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                $
              </span>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isSubmitting}
                min="0"
                step="0.01"
                className="w-full border-2 border-gray-300 rounded-lg pl-8 pr-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your offer amount"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter the amount you're willing to complete this task for
            </p>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
              rows={4}
              maxLength={1000}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Introduce yourself and explain why you're the best person for this task..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {message.length}/1000 characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
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
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Offer</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

