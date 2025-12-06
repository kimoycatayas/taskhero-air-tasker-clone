"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { MAPTILER_STYLE_URL, MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM } from "@/src/constants/map-config";
import { Task } from "@/src/data/mock-tasks";

interface TaskMapViewProps {
  tasks: Task[];
  selectedTaskId: string | null;
  onTaskSelect: (taskId: string) => void;
}

export default function TaskMapView({ tasks, selectedTaskId, onTaskSelect }: TaskMapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<{ [key: string]: maplibregl.Marker }>({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: MAPTILER_STYLE_URL,
        center: [MAP_DEFAULT_CENTER.lng, MAP_DEFAULT_CENTER.lat],
        zoom: MAP_DEFAULT_ZOOM,
      });

      // Add navigation controls
      map.current.addControl(new maplibregl.NavigationControl(), "top-right");

      // Add geolocate control
      map.current.addControl(
        new maplibregl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        }),
        "top-right"
      );

      map.current.on("load", () => {
        console.log("Map loaded successfully!");
        setMapLoaded(true);
      });

      map.current.on("error", (e) => {
        console.error("Map error:", e);
        setMapError("Failed to load map. Please check your connection.");
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError("Failed to initialize map.");
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add/update markers when tasks change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove old markers
    Object.values(markers.current).forEach((marker) => marker.remove());
    markers.current = {};

    // Add new markers
    tasks.forEach((task) => {
      if (!task.coordinates) return;

      // Create custom marker element
      const el = document.createElement("div");
      el.className = "task-marker";
      el.style.width = "40px";
      el.style.height = "40px";
      el.style.cursor = "pointer";
      
      // Create marker icon - blue pin with A letter (matching the image)
      el.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2C12.28 2 6 8.28 6 16C6 26 20 38 20 38C20 38 34 26 34 16C34 8.28 27.72 2 20 2Z" 
                fill="${selectedTaskId === task.id ? '#FDB913' : '#1565C0'}" 
                stroke="white" 
                stroke-width="2"/>
          <text x="20" y="20" 
                font-family="Arial, sans-serif" 
                font-size="16" 
                font-weight="bold" 
                fill="white" 
                text-anchor="middle" 
                dominant-baseline="middle">A</text>
        </svg>
      `;

      // Add hover effect
      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.1)";
        el.style.transition = "transform 0.2s";
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
      });

      // Create marker
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([task.coordinates.lng, task.coordinates.lat])
        .addTo(map.current!);

      // Create popup
      const popup = new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(`
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #1565C0;">
            ${task.title}
          </h3>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
            <span style="font-size: 12px; color: #666;">Budget:</span>
            <span style="font-size: 16px; font-weight: bold; color: #1565C0;">$${task.budget}</span>
          </div>
          <div style="margin-top: 8px; font-size: 12px; color: #666;">
            ${task.location}
          </div>
        </div>
      `);

      marker.setPopup(popup);

      // Click handler
      el.addEventListener("click", () => {
        onTaskSelect(task.id);
      });

      markers.current[task.id] = marker;
    });
  }, [tasks, mapLoaded, selectedTaskId, onTaskSelect]);

  // Fly to selected task
  useEffect(() => {
    if (!map.current || !selectedTaskId) return;

    const selectedTask = tasks.find((t) => t.id === selectedTaskId);
    if (selectedTask?.coordinates) {
      map.current.flyTo({
        center: [selectedTask.coordinates.lng, selectedTask.coordinates.lat],
        zoom: 14,
        duration: 1000,
      });

      // Show popup for selected marker
      if (markers.current[selectedTaskId]) {
        markers.current[selectedTaskId].togglePopup();
      }
    }
  }, [selectedTaskId, tasks]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Error message */}
      {mapError && (
        <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-50">
          <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md">
            <svg
              className="w-12 h-12 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Error</h3>
            <p className="text-gray-600 mb-4">{mapError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      )}
      
      {/* Loading overlay */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1565C0] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Task count badge */}
      {mapLoaded && !mapError && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-4 py-2 z-10">
          <span className="text-sm font-semibold text-gray-700">
            {tasks.filter(t => t.coordinates).length} tasks shown
          </span>
        </div>
      )}
    </div>
  );
}

