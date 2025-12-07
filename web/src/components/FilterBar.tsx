"use client";

import { useState } from "react";

interface FilterBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: {
    category: string;
    location: string;
    priceRange: string;
    sort: string;
  }) => void;
}

export default function FilterBar({
  onSearch,
  onFilterChange,
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("Category");
  const [location, setLocation] = useState("Within 10km");
  const [priceRange, setPriceRange] = useState("Any price");
  const [otherFilters, setOtherFilters] = useState("Other filters");
  const [sort, setSort] = useState("Sort");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterChange = () => {
    onFilterChange({
      category,
      location,
      priceRange,
      sort,
    });
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 md:max-w-xs">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search for a task"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black placeholder:text-gray-400"
          />
        </div>

        {/* Filters - Scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              handleFilterChange();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white cursor-pointer whitespace-nowrap flex-shrink-0 text-black"
          >
            <option value="Category">Category</option>
            <option value="Home & Garden">Home & Garden</option>
            <option value="Handyman">Handyman</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Delivery">Delivery</option>
            <option value="Moving">Moving</option>
            <option value="Other">Other</option>
          </select>

          {/* Location Dropdown */}
          <select
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              handleFilterChange();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white cursor-pointer whitespace-nowrap flex-shrink-0 text-black"
          >
            <option value="10km">Within 10km</option>
            <option value="25km">Within 25km</option>
            <option value="50km">Within 50km</option>
            <option value="remote">Remote only</option>
          </select>

          {/* Price Range Dropdown */}
          <select
            value={priceRange}
            onChange={(e) => {
              setPriceRange(e.target.value);
              handleFilterChange();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white cursor-pointer whitespace-nowrap flex-shrink-0 text-black"
          >
            <option value="Any price">Any price</option>
            <option value="Under ₱500">Under ₱500</option>
            <option value="₱500 - ₱1,000">₱500 - ₱1,000</option>
            <option value="₱1,000 - ₱5,000">₱1,000 - ₱5,000</option>
            <option value="Over ₱5,000">Over ₱5,000</option>
          </select>

          {/* Other Filters Dropdown */}
          <select
            value={otherFilters}
            onChange={(e) => {
              setOtherFilters(e.target.value);
              handleFilterChange();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white cursor-pointer whitespace-nowrap flex-shrink-0 text-black"
          >
            <option value="Other filters">Other filters</option>
            <option value="Remote only">Remote only</option>
            <option value="Flexible timing">Flexible timing</option>
            <option value="Urgent">Urgent</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              handleFilterChange();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white cursor-pointer whitespace-nowrap flex-shrink-0 text-black"
          >
            <option value="Sort">Sort</option>
            <option value="Newest first">Newest first</option>
            <option value="Highest budget">Highest budget</option>
            <option value="Lowest budget">Lowest budget</option>
            <option value="Most offers">Most offers</option>
          </select>
        </div>
      </div>
    </div>
  );
}
