"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PAGE_ROUTES } from "@/src/constants/page-routes";
import { tasksApi } from "@/src/api/tasks";

type Step = 1 | 2 | 3 | 4;

export default function CreateTaskPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);

  // Form state
  const [title, setTitle] = useState("");
  const [dateType, setDateType] = useState<"on" | "before" | "flexible">("on");
  const [selectedDate, setSelectedDate] = useState("");
  const [isRemovals, setIsRemovals] = useState<boolean | null>(null);
  const [pickupSuburb, setPickupSuburb] = useState("");
  const [dropoffSuburb, setDropoffSuburb] = useState("");
  const [details, setDetails] = useState("");
  const [budget, setBudget] = useState("");

  // API state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Validation
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const validateStep = (): boolean => {
    const newErrors: Record<string, boolean> = {};

    switch (currentStep) {
      case 1:
        if (!title.trim()) newErrors.title = true;
        break;
      case 2:
        if (isRemovals === null) newErrors.removals = true;
        if (!pickupSuburb.trim()) newErrors.pickupSuburb = true;
        break;
      case 3:
        // Details is optional
        break;
      case 4:
        // Budget is optional
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validateStep()) {
      if (currentStep < 4) {
        setCurrentStep((currentStep + 1) as Step);
        setErrors({});
      } else {
        // Submit form
        setIsSubmitting(true);
        setSubmitError("");

        try {
          // Map date type to backend format
          const dateTypeMap = {
            on: "on_date",
            before: "before_date",
            flexible: "flexible",
          } as const;

          // Build location address
          const locationParts = [pickupSuburb];
          if (dropoffSuburb) {
            locationParts.push(dropoffSuburb);
          }
          const locationAddress = locationParts.join(" → ");

          // Parse budget
          const budgetValue = budget ? parseFloat(budget) : null;

          // Create task payload
          const taskData = {
            title,
            description: details || "",
            date_type: dateTypeMap[dateType],
            task_date:
              selectedDate && dateType !== "flexible"
                ? new Date(selectedDate).toISOString()
                : null,
            location_address: pickupSuburb ? locationAddress : null,
            budget_min: budgetValue,
            budget_max: budgetValue, // Using same value for min/max for now
            budget_currency: "USD",
          };

          const createdTask = await tasksApi.createTask(taskData);

          // Redirect to task detail page
          router.push(`/tasks/${createdTask.id}`);
        } catch (error) {
          console.error("Error creating task:", error);
          setSubmitError(
            error instanceof Error ? error.message : "Failed to create task"
          );
          setIsSubmitting(false);
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
      setErrors({});
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="TaskHero" width={40} height={40} />
            <span className="text-2xl font-bold text-[#1565C0]">TaskHero</span>
          </div>
          <button
            onClick={() => router.push(PAGE_ROUTES.dashboard)}
            className="text-gray-600 hover:text-gray-900"
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
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar - Steps Navigation */}
          <div className="col-span-3">
            <div className="sticky top-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Post a task
              </h2>
              <nav className="space-y-2">
                <StepItem
                  step={1}
                  currentStep={currentStep}
                  label="Title & Date"
                />
                <StepItem step={2} currentStep={currentStep} label="Location" />
                <StepItem step={3} currentStep={currentStep} label="Details" />
                <StepItem step={4} currentStep={currentStep} label="Budget" />
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {/* Step 1: Title & Date */}
              {currentStep === 1 && (
                <div>
                  <h1 className="text-4xl font-bold text-[#0D1F3C] mb-8">
                    Let's start with the basics
                  </h1>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-base font-semibold text-[#0D1F3C] mb-3">
                        In a few words, what do you need done?
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`w-full border-2 ${
                          errors.title ? "border-red-500" : "border-gray-300"
                        } rounded-lg px-4 py-3 text-gray-900 focus:border-[#1565C0] focus:outline-none`}
                        placeholder="e.g. Help move my sofa"
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          This field is required
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-[#0D1F3C] mb-3">
                        When do you need this done?
                      </label>
                      <div className="flex gap-3 mb-4">
                        <button
                          type="button"
                          onClick={() => setDateType("on")}
                          className={`px-6 py-3 rounded-full border-2 font-medium transition ${
                            dateType === "on"
                              ? "bg-[#0D1F3C] text-white border-[#0D1F3C]"
                              : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          On date ▼
                        </button>
                        <button
                          type="button"
                          onClick={() => setDateType("before")}
                          className={`px-6 py-3 rounded-full border-2 font-medium transition ${
                            dateType === "before"
                              ? "bg-[#0D1F3C] text-white border-[#0D1F3C]"
                              : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          Before date ▼
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDateType("flexible");
                            setSelectedDate(""); // Clear date when flexible
                          }}
                          className={`px-6 py-3 rounded-full border-2 font-medium transition ${
                            dateType === "flexible"
                              ? "bg-[#0D1F3C] text-white border-[#0D1F3C]"
                              : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          I'm flexible
                        </button>
                      </div>

                      {/* Date Picker - Show only for "on" or "before" */}
                      {(dateType === "on" || dateType === "before") && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {dateType === "on"
                              ? "Select date"
                              : "Select before date"}
                          </label>
                          <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]} // Minimum date is today
                            className="w-full max-w-xs border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-[#1565C0] focus:outline-none"
                          />
                        </div>
                      )}

                      {dateType === "flexible" && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-gray-700">
                            Great! You'll get more offers with flexible timing.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Location */}
              {currentStep === 2 && (
                <div>
                  <h1 className="text-4xl font-bold text-[#0D1F3C] mb-8">
                    Tell us where
                  </h1>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-base font-semibold text-[#0D1F3C] mb-3">
                        Is this a removals task?
                      </label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setIsRemovals(true)}
                          className={`px-12 py-4 rounded-lg font-semibold transition ${
                            isRemovals === true
                              ? "bg-[#0D1F3C] text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setIsRemovals(false)}
                          className={`px-12 py-4 rounded-lg font-semibold transition ${
                            isRemovals === false
                              ? "bg-[#0D1F3C] text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          No
                        </button>
                      </div>
                      {errors.removals && (
                        <p className="text-red-500 text-sm mt-2">
                          Please select an option
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-[#0D1F3C] mb-3">
                        Pickup suburb
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
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
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </span>
                        <input
                          type="text"
                          value={pickupSuburb}
                          onChange={(e) => setPickupSuburb(e.target.value)}
                          className={`w-full border-2 ${
                            errors.pickupSuburb
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg pl-12 pr-4 py-3 text-gray-900 focus:border-[#1565C0] focus:outline-none`}
                          placeholder="Enter a suburb"
                        />
                      </div>
                      {errors.pickupSuburb && (
                        <p className="text-red-500 text-sm mt-1">
                          This field is required
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-[#0D1F3C] mb-3">
                        Drop-off suburb{" "}
                        <span className="text-gray-500 font-normal">
                          (optional)
                        </span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
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
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </span>
                        <input
                          type="text"
                          value={dropoffSuburb}
                          onChange={(e) => setDropoffSuburb(e.target.value)}
                          className="w-full border-2 border-gray-300 rounded-lg pl-12 pr-4 py-3 text-gray-900 bg-gray-50 focus:border-[#1565C0] focus:outline-none focus:bg-white"
                          placeholder="Enter a suburb"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Details */}
              {currentStep === 3 && (
                <div>
                  <h1 className="text-4xl font-bold text-[#0D1F3C] mb-8">
                    Provide more details
                  </h1>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-base font-semibold text-[#0D1F3C] mb-3">
                        What are the details?
                      </label>
                      <textarea
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        rows={8}
                        className="w-full border-2 border-[#1565C0] rounded-lg px-4 py-3 text-gray-900 focus:border-[#1565C0] focus:outline-none resize-none"
                        placeholder="Write a summary of the key details"
                      />
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-[#0D1F3C] mb-3">
                        Add images{" "}
                        <span className="text-gray-500 font-normal">
                          (optional)
                        </span>
                      </label>
                      <div className="border-2 border-gray-200 border-dashed rounded-lg p-12 flex items-center justify-center bg-gray-50">
                        <button className="flex flex-col items-center gap-3 text-[#1565C0] hover:text-[#0D47A1]">
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg
                              className="w-8 h-8"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </div>
                          <span className="font-medium">Add images</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Budget */}
              {currentStep === 4 && (
                <div>
                  <h1 className="text-4xl font-bold text-[#0D1F3C] mb-8">
                    Suggest your budget
                  </h1>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-base font-semibold text-[#0D1F3C] mb-2">
                        What is your budget?
                      </label>
                      <p className="text-gray-600 mb-4">
                        You can always negotiate the final price.
                      </p>
                      <div className="relative max-w-md">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-medium">
                          $
                        </span>
                        <input
                          type="number"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="w-full border-2 border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 focus:border-[#1565C0] focus:outline-none bg-gray-50"
                          placeholder="Enter budget"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="space-y-4 mt-12">
                {/* Error Message */}
                {submitError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{submitError}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  {currentStep > 1 && (
                    <button
                      onClick={handleBack}
                      disabled={isSubmitting}
                      className="px-8 py-3 rounded-lg font-semibold text-[#1565C0] bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="flex-1 px-8 py-3 rounded-lg font-semibold text-white bg-[#1565C0] hover:bg-[#0D47A1] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                        <span>Creating Task...</span>
                      </>
                    ) : (
                      <span>{currentStep === 4 ? "Post Task" : "Next"}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepItem({
  step,
  currentStep,
  label,
}: {
  step: number;
  currentStep: number;
  label: string;
}) {
  const isActive = step === currentStep;
  const isCompleted = step < currentStep;

  return (
    <div
      className={`px-4 py-3 rounded-lg border-l-4 transition ${
        isActive
          ? "border-[#1565C0] bg-blue-50 text-[#1565C0] font-semibold"
          : isCompleted
          ? "border-green-500 text-gray-700"
          : "border-transparent text-gray-500"
      }`}
    >
      {label}
    </div>
  );
}
