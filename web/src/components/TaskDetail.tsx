"use client";

interface TaskDetailProps {
  task: {
    id: string;
    title: string;
    budget: number;
    location: string;
    deadline: string;
    status: "open" | "assigned" | "completed";
    isRemote: boolean;
    isFlexible: boolean;
    postedBy: string;
    postedTime: string;
    details: string;
    offers?: number;
  } | null;
}

export default function TaskDetail({ task }: TaskDetailProps) {
  if (!task) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-300"
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
          <p className="text-lg">Select a task to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <span
            className={`text-xs font-bold px-3 py-1.5 rounded uppercase ${
              task.status === "open"
                ? "text-white bg-green-500"
                : "text-gray-500 bg-gray-200"
            }`}
          >
            {task.status}
          </span>
          <span
            className={`text-xs font-bold px-3 py-1.5 rounded uppercase ${
              task.status === "assigned"
                ? "text-white bg-gray-500"
                : "text-gray-500 bg-gray-200"
            }`}
          >
            ASSIGNED
          </span>
          <span
            className={`text-xs font-bold px-3 py-1.5 rounded uppercase ${
              task.status === "completed"
                ? "text-white bg-gray-500"
                : "text-gray-500 bg-gray-200"
            }`}
          >
            COMPLETED
          </span>
          <button className="ml-auto text-blue-600 text-sm flex items-center gap-1 hover:text-blue-700">
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
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            Follow
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">{task.title}</h1>

        <button className="text-blue-600 text-sm flex items-center gap-1 mb-4">
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Return to map
        </button>

        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
          <div>
            <div className="text-xs text-gray-500 mb-1">POSTED BY</div>
            <div className="font-semibold text-gray-900">{task.postedBy}</div>
            <div className="text-xs text-gray-500">{task.postedTime}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-gray-600 mt-0.5"
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
            <div>
              <div className="text-xs text-gray-500 mb-1">LOCATION</div>
              <div className="text-gray-900">{task.location}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-gray-600 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div>
              <div className="text-xs text-gray-500 mb-1">TO BE DONE ON</div>
              <div className="text-gray-900">{task.deadline}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Details</h2>
        <p className="text-gray-700 leading-relaxed mb-6">{task.details}</p>

        <button className="text-blue-600 text-sm font-medium">Less ^</button>
      </div>

      {/* Tabs */}
      <div className="px-6">
        <div className="flex border-b border-gray-200">
          <button className="flex-1 py-3 text-center font-semibold text-white bg-[#0D1B3E] rounded-t-lg">
            Offers
          </button>
          <button className="flex-1 py-3 text-center font-semibold text-gray-600 bg-gray-100 rounded-t-lg">
            Questions
          </button>
        </div>
      </div>

      {/* Budget Card */}
      <div className="p-6">
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="text-sm text-gray-600 mb-2">TASK BUDGET</div>
          <div className="text-5xl font-bold text-gray-900 mb-6">
            ${task.budget}
          </div>
          <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition mb-3">
            Make an offer
          </button>
          <details className="text-left">
            <summary className="text-sm font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
              More Options
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="mt-3 space-y-2">
              <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
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
                    d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                  />
                </svg>
                Report this task
              </button>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

