import Link from "next/link";
import Image from "next/image";
import { PAGE_ROUTES } from "@/src/constants/page-routes";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={PAGE_ROUTES.home} className="flex items-center">
              <Image
                src="/logo.png"
                alt="TaskHero Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </Link>

            {/* Center Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href={PAGE_ROUTES.tasks}
                className="px-6 py-2 bg-[#1565C0] text-white font-semibold rounded-full hover:bg-[#0D47A1] transition"
              >
                Post a task
              </Link>
              <Link
                href={PAGE_ROUTES.tasks}
                className="text-gray-700 hover:text-[#1565C0] transition"
              >
                Categories
              </Link>
              <Link
                href={PAGE_ROUTES.tasks}
                className="text-gray-700 hover:text-[#1565C0] transition"
              >
                Browse tasks
              </Link>
              <Link
                href={PAGE_ROUTES.howItWorks}
                className="text-gray-700 hover:text-[#1565C0] transition"
              >
                How it works
              </Link>
            </nav>

            {/* Right Side - Auth Buttons */}
            <div className="flex items-center gap-4">
              <Link
                href={PAGE_ROUTES.signup}
                className="text-gray-700 hover:text-[#1565C0] transition"
              >
                Sign up
              </Link>
              <Link
                href={PAGE_ROUTES.login}
                className="text-gray-700 hover:text-[#1565C0] transition"
              >
                Log in
              </Link>
              <Link
                href={PAGE_ROUTES.signup}
                className="px-6 py-2 text-[#1565C0] font-semibold hover:text-[#0D47A1] transition"
              >
                Become a Tasker
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-[#0D1B4D] text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-8">
            Post any task. Pick the best person. Get it done.
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href={PAGE_ROUTES.signup}
              className="px-8 py-4 bg-[#4A90E2] text-white font-semibold rounded-full hover:bg-[#357ABD] transition inline-flex items-center justify-center gap-2"
            >
              Post your task for free
              <span>→</span>
            </Link>
            <Link
              href={PAGE_ROUTES.signup}
              className="px-8 py-4 bg-white text-[#4A90E2] font-semibold rounded-full hover:bg-gray-100 transition"
            >
              Earn money as a Tasker
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">👥</span>
              <span>1M+ customers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🛡️</span>
              <span>2.5M+ tasks done</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">⭐</span>
              <span>4M+ user reviews</span>
            </div>
          </div>

          {/* Trustpilot */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-green-400">★</span>
            <span className="font-semibold">Trustpilot</span>
            <div className="flex gap-1">
              <span className="text-green-400">★</span>
              <span className="text-green-400">★</span>
              <span className="text-green-400">★</span>
              <span className="text-green-400">★</span>
              <span className="text-green-400">★</span>
            </div>
            <span>4.1 'Great' (12,111 reviews)</span>
          </div>
        </div>
      </div>

      {/* Announcement Section */}
      <div className="bg-gradient-to-r from-[#FDB913] to-[#FFCE54] py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 text-center">
            <span className="text-3xl">🏆</span>
            <p className="text-[#1565C0] font-semibold text-lg">
              We are excited to announce the Top Taskers of 2025
            </p>
            <Link
              href="#"
              className="text-[#1565C0] font-semibold hover:text-[#0D47A1] underline transition"
            >
              Learn more →
            </Link>
          </div>
        </div>
      </div>

      {/* Post Task Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Instructions */}
            <div>
              <h2 className="text-5xl font-bold text-[#0D1B4D] mb-6 leading-tight">
                Post your first task in seconds
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Save yourself hours and get your to-do list completed
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#1565C0] font-semibold flex-shrink-0">
                    1
                  </div>
                  <p className="text-lg text-gray-800">
                    Describe what you need done
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#1565C0] font-semibold flex-shrink-0">
                    2
                  </div>
                  <p className="text-lg text-gray-800">Set your budget</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#1565C0] font-semibold flex-shrink-0">
                    3
                  </div>
                  <p className="text-lg text-gray-800">
                    Receive quotes and pick the best Tasker
                  </p>
                </div>
              </div>

              <Link
                href={PAGE_ROUTES.tasks}
                className="inline-block px-8 py-4 bg-[#1565C0] text-white font-semibold rounded-full hover:bg-[#0D47A1] transition"
              >
                Post your task
              </Link>
            </div>

            {/* Right Side - Category Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Marketing & design */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer">
                <div className="w-16 h-16 rounded-lg overflow-hidden mb-3">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl">
                    💻
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Marketing & design
                </h3>
                <p className="text-sm text-gray-500">Help with website</p>
              </div>

              {/* Something else */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer">
                <div className="w-16 h-16 rounded-lg overflow-hidden mb-3">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl">
                    🎨
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Something else
                </h3>
                <p className="text-sm text-gray-500">
                  Wall mount art and paintings
                </p>
              </div>

              {/* Removalists */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer">
                <div className="w-16 h-16 rounded-lg overflow-hidden mb-3">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl">
                    📦
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Removalists
                </h3>
                <p className="text-sm text-gray-500">
                  Packing, wrapping, moving and more!
                </p>
              </div>

              {/* Home cleaning */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer">
                <div className="w-16 h-16 rounded-lg overflow-hidden mb-3">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl">
                    🧹
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Home cleaning
                </h3>
                <p className="text-sm text-gray-500">
                  Clean, mop and tidy your house
                </p>
              </div>

              {/* Furniture assembly */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer">
                <div className="w-16 h-16 rounded-lg overflow-hidden mb-3">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl">
                    🔧
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Furniture assembly
                </h3>
                <p className="text-sm text-gray-500">
                  Flatpack assembly and disassembly
                </p>
              </div>

              {/* Deliveries */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer">
                <div className="w-16 h-16 rounded-lg overflow-hidden mb-3">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl">
                    🚚
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Deliveries</h3>
                <p className="text-sm text-gray-500">
                  Urgent deliveries and courier services
                </p>
              </div>

              {/* Gardening & landscaping */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer">
                <div className="w-16 h-16 rounded-lg overflow-hidden mb-3">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl">
                    🌱
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Gardening & landscaping
                </h3>
                <p className="text-sm text-gray-500">
                  Mulching, weeding and tidying up
                </p>
              </div>

              {/* Painting */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer">
                <div className="w-16 h-16 rounded-lg overflow-hidden mb-3">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl">
                    🎨
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Painting</h3>
                <p className="text-sm text-gray-500">
                  Interior and exterior wall painting
                </p>
              </div>

              {/* Handyperson */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer">
                <div className="w-16 h-16 rounded-lg overflow-hidden mb-3">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl">
                    🔨
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Handyperson
                </h3>
                <p className="text-sm text-gray-500">
                  Help with home maintenance
                </p>
              </div>

              {/* Business & admin */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer">
                <div className="w-16 h-16 rounded-lg overflow-hidden mb-3">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl">
                    💼
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Business & admin
                </h3>
                <p className="text-sm text-gray-500">
                  Help with accounting and tax returns
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust and Safety Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Side - Visual */}
            <div className="relative">
              {/* Rating Card */}
              <div className="absolute top-8 left-0 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3 z-10">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-2xl">
                  👤
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      5.0
                    </span>
                    <span className="text-orange-500">⭐</span>
                  </div>
                  <p className="text-sm text-gray-600">Overall Rating</p>
                </div>
              </div>

              {/* Main Image */}
              <div className="relative ml-12 mt-16">
                <div className="rounded-3xl overflow-hidden aspect-[4/5]">
                  <Image
                    src="https://images.pexels.com/photos/3791664/pexels-photo-3791664.jpeg"
                    alt="Happy customer"
                    width={500}
                    height={625}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Status Cards */}
                <div className="absolute bottom-8 right-8 bg-white rounded-xl shadow-lg p-4 min-w-[200px]">
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
                    <div className="text-2xl">👍</div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Job completed
                      </p>
                      <p className="text-xs text-gray-500">2m ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">✓</div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Payment released
                      </p>
                      <p className="text-xs text-gray-500">2m ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Features */}
            <div>
              <h2 className="text-5xl font-bold text-[#0D1B4D] mb-12 leading-tight">
                Trust and safety features for your protection
              </h2>

              <div className="space-y-8">
                {/* Secure payments */}
                <div>
                  <div className="flex items-start gap-4 mb-3">
                    <div className="text-3xl text-[#1565C0]">💰</div>
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        Secure payments
                      </h3>
                      <p className="text-gray-600 mb-2">
                        Only release payment when the task is completed to your
                        satisfaction
                      </p>
                      <Link
                        href="#"
                        className="text-[#1565C0] font-semibold hover:underline"
                      >
                        read more
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Trusted ratings */}
                <div>
                  <div className="flex items-start gap-4 mb-3">
                    <div className="text-3xl text-[#1565C0]">⭐</div>
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        Trusted ratings and reviews
                      </h3>
                      <p className="text-gray-600 mb-2">
                        Pick the right person for the task based on real ratings
                        and reviews from other users
                      </p>
                      <Link
                        href="#"
                        className="text-[#1565C0] font-semibold hover:underline"
                      >
                        read more
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Insurance */}
                <div>
                  <div className="flex items-start gap-4 mb-3">
                    <div className="text-3xl text-[#1565C0]">🛡️</div>
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        Insurance for peace of mind
                      </h3>
                      <p className="text-gray-600 mb-2">
                        We provide liability insurance for Taskers performing
                        most task activities
                      </p>
                      <Link
                        href="#"
                        className="text-[#1565C0] font-semibold hover:underline"
                      >
                        read more
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href={PAGE_ROUTES.tasks}
                className="inline-block mt-8 px-8 py-4 bg-[#1565C0] text-white font-semibold rounded-full hover:bg-[#0D47A1] transition"
              >
                Post your task for free
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-5xl font-bold text-[#0D1B4D]">
              Articles, stories and more
            </h2>
            <Link
              href="#"
              className="px-8 py-3 bg-[#1565C0] text-white font-semibold rounded-full hover:bg-[#0D47A1] transition"
            >
              Visit our blog
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Article 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
              <div className="h-48 overflow-hidden">
                <Image
                  src="https://images.pexels.com/photos/5676744/pexels-photo-5676744.jpeg"
                  alt="Save more with our partners"
                  width={400}
                  height={300}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#0D1B4D] mb-3">
                  Save more with our partners
                </h3>
                <p className="text-gray-600 mb-4">
                  Check out these Black Friday deals!
                </p>
                <Link
                  href="#"
                  className="text-[#1565C0] font-semibold hover:underline"
                >
                  Read more
                </Link>
              </div>
            </div>

            {/* Article 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
              <div className="h-48 overflow-hidden">
                <Image
                  src="https://images.pexels.com/photos/4623517/pexels-photo-4623517.jpeg"
                  alt="TaskHero Mechanics Task"
                  width={400}
                  height={300}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#0D1B4D] mb-3">
                  TaskHero Limited ("TaskHero") Crazy and Creative Mechanics
                  Helmet Task – Terms and Conditions
                </h3>
                <p className="text-gray-600 mb-4">Learn more.</p>
                <Link
                  href="#"
                  className="text-[#1565C0] font-semibold hover:underline"
                >
                  Read more
                </Link>
              </div>
            </div>

            {/* Article 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
              <div className="h-48 overflow-hidden">
                <Image
                  src="https://images.pexels.com/photos/3783348/pexels-photo-3783348.jpeg"
                  alt="Offer ranking system"
                  width={400}
                  height={300}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#0D1B4D] mb-3">
                  How our offer ranking system works
                </h3>
                <p className="text-gray-600 mb-4">
                  Learn more about Top Offers
                </p>
                <Link
                  href="#"
                  className="text-[#1565C0] font-semibold hover:underline"
                >
                  Read more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0D1B4D] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            {/* Discover */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Discover</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link
                    href={PAGE_ROUTES.howItWorks}
                    className="hover:text-white"
                  >
                    How it works
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white">
                    About us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Careers
                  </Link>
                </li>

                <li>
                  <Link href="#" className="hover:text-white">
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Existing Members */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Existing Members</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link href={PAGE_ROUTES.tasks} className="hover:text-white">
                    Post a task
                  </Link>
                </li>
                <li>
                  <Link href={PAGE_ROUTES.tasks} className="hover:text-white">
                    Browse tasks
                  </Link>
                </li>
                <li>
                  <Link href={PAGE_ROUTES.login} className="hover:text-white">
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Popular Categories */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Popular Categories</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white">
                    Handyman Services
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Cleaning Services
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Delivery Services
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Removalists
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Gardening Services
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Auto Electricians
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Assembly Services
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    All Services
                  </Link>
                </li>
              </ul>
            </div>

            {/* Popular Locations */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Popular Locations</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white">
                    Manila
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Quezon City
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Makati
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Cebu
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Davao
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Pasig
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Taguig
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <Image
                  src="/logo.png"
                  alt="TaskHero"
                  width={120}
                  height={40}
                  className="object-contain"
                />
              </div>

              <p className="text-sm text-gray-400">
                TaskHero Limited 2025 ©. All rights reserved
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
