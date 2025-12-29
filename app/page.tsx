

import DashboardPage from "./components/DashboardPage";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-muted/40 flex">
      
      {/* Sidebar */}

      {/* Right Side (Navbar + Content) */}
      <div className="flex-1 flex flex-col">

      
        {/* Main Content */}
        <main className="flex-1 p-6 max-w-[1400px] mx-auto w-full">
          <DashboardPage />
        </main>

      </div>

    </div>
  );
}
