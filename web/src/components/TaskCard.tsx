"use client";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    budget: number;
    location: string;
    deadline: string;
    status: "open" | "assigned" | "completed";
    isRemote: boolean;
    isFlexible: boolean;
    offers?: number;
    posterAvatar?: string;
  };
  isActive?: boolean;
  onClick: () => void;
}

export default function TaskCard({ task, isActive, onClick }: TaskCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-all duration-200 ${
        isActive ? "bg-blue-50 border-l-4 border-l-[#1565C0]" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-gray-900 flex-1 pr-2 leading-snug">
          {task.title}
        </h3>
        <span className="text-base font-bold text-gray-900 whitespace-nowrap">
          ${task.budget}
        </span>
      </div>

      <div className="flex flex-col gap-1 mb-3">
        {task.isRemote && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <svg
              className="w-3 h-3"
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
            <span>Remote</span>
          </div>
        )}
        {task.isFlexible && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <svg
              className="w-3 h-3"
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
            <span>{task.deadline}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              task.status === "open"
                ? "text-[#1565C0] bg-blue-100"
                : task.status === "assigned"
                ? "text-gray-600 bg-gray-100"
                : "text-green-600 bg-green-100"
            }`}
          >
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
          {task.offers !== undefined && task.offers > 0 && (
            <span className="text-xs text-gray-600">• {task.offers} offers</span>
          )}
        </div>
        {task.posterAvatar && (
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
            <img
              src={task.posterAvatar}
              alt="Poster"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}

