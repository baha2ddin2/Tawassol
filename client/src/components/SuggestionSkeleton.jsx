import { Card, Skeleton } from "@mui/material";

export default function SuggestionSkeleton() {
  return (
    <aside className="w-full lg:w-[320px] lg:sticky lg:top-25 lg:mt-25 h-fit mb-6 lg:mb-0 block">
      <Card className="rounded-xl shadow-sm border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
        <Skeleton variant="text" width={100} height={28} className="mb-4" sx={{ bgcolor: "var(--nav-pill-bg)" }} />
        <div className="flex overflow-x-auto gap-4 lg:flex-col lg:space-y-4 lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex flex-col lg:flex-row lg:justify-between items-center min-w-[120px] lg:min-w-0 bg-[var(--nav-pill-bg)] lg:bg-transparent p-3 lg:p-0 rounded-xl"
            >
              <div className="flex flex-col lg:flex-row gap-2 lg:gap-3 items-center w-full mb-2 lg:mb-0">
                <Skeleton variant="circular" width={48} height={48} sx={{ bgcolor: "var(--card-border)" }} className="lg:w-9 lg:h-9" />
                <div className="flex-1 w-full flex flex-col items-center lg:items-start">
                  <Skeleton variant="text" width={80} height={20} sx={{ bgcolor: "var(--card-border)" }} />
                  <Skeleton variant="text" width={100} height={16} sx={{ bgcolor: "var(--card-border)" }} />
                </div>
              </div>
              <Skeleton variant="rounded" width={80} height={28} className="lg:w-[60px] lg:h-[24px] rounded-full lg:rounded-none" sx={{ bgcolor: "var(--card-border)" }} />
            </div>
          ))}
        </div>
      </Card>
    </aside>
  );
}
