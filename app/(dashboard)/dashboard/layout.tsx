import { FloatingNavbar } from "@/components/sections/dashboard/floating-navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background text-foreground relative min-h-screen">
      {/* Subtle background glow shared across all dashboard pages */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="bg-brand/10 absolute top-[-20%] left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full blur-[120px]" />
      </div>

      {/* Main page content (rendered on top of glow) */}
      <div className="relative z-10 pb-32">
        {children}
      </div>

      {/* Floating Navbar */}
      <FloatingNavbar />
    </div>
  );
}
