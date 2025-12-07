import Link from "next/link";
import { PAGE_ROUTES } from "@/src/constants/page-routes";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#0D1B4D] text-white py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-6xl font-bold mb-8 leading-tight">
            Post a task. Get Offers. Get it done!
          </h1>
          <p className="text-2xl mb-12 text-gray-200">
            The best place for people and businesses to outsource tasks
          </p>
          <Link
            href={PAGE_ROUTES.tasks}
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#4A90E2] text-white font-semibold rounded-full hover:bg-[#357ABD] transition text-lg"
          >
            Post a task for free
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Step 1: Describe what you need done */}
      <div className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-[#0D1B4D] mb-6">
            Describe what you need done
          </h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Describe what you need done in a few sentences. Keep it simple and clear to attract the best Taskers.
          </p>
          <Link
            href={PAGE_ROUTES.tasks}
            className="inline-block px-8 py-3 bg-blue-50 text-[#1565C0] font-semibold rounded-lg hover:bg-blue-100 transition"
          >
            Post your task for free
          </Link>
        </div>
      </div>

      {/* Step 2: Set your budget */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-[#0D1B4D] mb-6">
            Set your budget
          </h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Don't worry, you can adjust your budget later and discuss it with potential Taskers if needed.
          </p>
          <Link
            href={PAGE_ROUTES.tasks}
            className="inline-block px-8 py-3 bg-blue-50 text-[#1565C0] font-semibold rounded-lg hover:bg-blue-100 transition"
          >
            Post your task for free
          </Link>
        </div>
      </div>

      {/* Step 3: Receive quotes */}
      <div className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-[#0D1B4D] mb-6">
            Receive quotes. Pick the most suitable Tasker.
          </h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Take a look at profiles, ratings, completion rate and reviews to pick the Tasker you'd like to work with. When the task is done, say thanks by releasing payment and writing a review so everyone can know what a great job they've done.
          </p>
          <Link
            href={PAGE_ROUTES.tasks}
            className="inline-block px-8 py-3 bg-blue-50 text-[#1565C0] font-semibold rounded-lg hover:bg-blue-100 transition"
          >
            Post your task for free
          </Link>
        </div>
      </div>

      {/* We've got you covered */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-5xl font-bold text-[#0D1B4D] mb-6">
                We've got you covered
              </h2>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Whether you're a posting a task or completing a task, you can do both with the peace of mind that TaskHero is there to support.
              </p>
              <Link
                href="#"
                className="inline-block px-8 py-3 bg-blue-50 text-[#1565C0] font-semibold rounded-lg hover:bg-blue-100 transition"
              >
                TaskHero's insurance cover
              </Link>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-start gap-4 mb-3">
                  <div className="text-3xl">🛡️</div>
                  <div>
                    <h3 className="text-2xl font-semibold text-[#0D1B4D] mb-2">
                      Public liability insurance
                    </h3>
                    <p className="text-gray-700">
                      TaskHero Insurance covers you for any accidental injury to the customer or property damage whilst performing certain task activities
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start gap-4 mb-3">
                  <div className="text-3xl">⭐</div>
                  <div>
                    <h3 className="text-2xl font-semibold text-[#0D1B4D] mb-2">
                      Top rated insurance
                    </h3>
                    <p className="text-gray-700">
                      TaskHero Insurance is provided by Chubb Insurance Australia Limited, one of the world's most reputable, stable and innovative insurance brands.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings & reviews */}
      <div className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-[#0D1B4D] mb-6">
            Ratings & reviews
          </h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Review Tasker's portfolios, skills, badges on their profile, and see their transaction verified ratings, reviews & completion rating (to see their reliability) on tasks they've previously completed on TaskHero. This empowers you to make sure you're choosing the right person for your task.
          </p>
          <Link
            href={PAGE_ROUTES.signup}
            className="inline-block px-8 py-3 bg-blue-50 text-[#1565C0] font-semibold rounded-lg hover:bg-blue-100 transition"
          >
            Get started for free
          </Link>
        </div>
      </div>

      {/* Communication */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-[#0D1B4D] mb-6">
            Communication
          </h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Use TaskHero to stay in contact from the moment your task is posted until it's completed. Accept an offer and you can privately message the Tasker to discuss final details, and get your task completed.
          </p>
          <Link
            href={PAGE_ROUTES.signup}
            className="inline-block px-8 py-3 bg-blue-50 text-[#1565C0] font-semibold rounded-lg hover:bg-blue-100 transition"
          >
            Get started for free
          </Link>
        </div>
      </div>

      {/* Payments on lock */}
      <div className="py-24 bg-[#0D1B4D] text-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-bold mb-8">
            Payments on lock
          </h2>
          <p className="text-xl mb-6 leading-relaxed text-gray-200">
            TaskHero Pay is the seamless and secure way to get your tasks completed. Once you accept an offer on a task, the agreed upon amount is held secure with TaskHero Pay until the task is complete.
          </p>
          <p className="text-xl mb-10 leading-relaxed text-gray-200">
            Once complete, you'll simply need to release the payment. We'll then transfer the task payment to the Tasker's verified bank account.
          </p>

          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <p className="text-lg">Fast and hassle free payment</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <p className="text-lg">Cashless payments, no cash in hand</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <p className="text-lg">You are always in control</p>
            </div>
          </div>

          <Link
            href="#"
            className="inline-block px-8 py-3 bg-white text-[#1565C0] font-semibold rounded-full hover:bg-gray-100 transition"
          >
            Learn more
          </Link>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-24 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-[#0D1B4D] mb-8">
            Ready to get started?
          </h2>
          <Link
            href={PAGE_ROUTES.tasks}
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#1565C0] text-white font-semibold rounded-full hover:bg-[#0D47A1] transition text-lg"
          >
            Post your task for free
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}




