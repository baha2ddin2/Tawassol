"use client";

export function PostSkeleton() {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-5 mb-4 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="skeleton w-10 h-10 rounded-full" />
        <div className="flex-1">
          <div className="skeleton h-3.5 w-28 mb-2 rounded" />
          <div className="skeleton h-2.5 w-20 rounded" />
        </div>
      </div>
      <div className="skeleton h-3 w-full mb-2 rounded" />
      <div className="skeleton h-3 w-3/4 mb-4 rounded" />
      <div className="skeleton h-48 w-full rounded-xl mb-4" />
      <div className="flex gap-6">
        <div className="skeleton h-3 w-12 rounded" />
        <div className="skeleton h-3 w-14 rounded" />
        <div className="skeleton h-3 w-10 rounded" />
      </div>
    </div>
  );
}

export function ContactSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-[var(--card-border)]">
      <div className="skeleton w-12 h-12 rounded-full" />
      <div className="flex-1">
        <div className="skeleton h-3.5 w-28 mb-2 rounded" />
        <div className="skeleton h-2.5 w-40 rounded" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col items-center p-6">
      <div className="skeleton w-24 h-24 rounded-full mb-4" />
      <div className="skeleton h-5 w-32 mb-2 rounded" />
      <div className="skeleton h-3 w-48 mb-6 rounded" />
      <div className="flex gap-8">
        <div className="skeleton h-10 w-16 rounded-lg" />
        <div className="skeleton h-10 w-16 rounded-lg" />
        <div className="skeleton h-10 w-16 rounded-lg" />
      </div>
    </div>
  );
}

export function MessageSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
          <div className={`flex items-end gap-2 max-w-[60%] ${i % 2 === 0 ? "" : "flex-row-reverse"}`}>
            {i % 2 === 0 && <div className="skeleton w-8 h-8 rounded-full" />}
            <div className={`skeleton rounded-2xl ${i % 3 === 0 ? "h-10 w-40" : i % 3 === 1 ? "h-10 w-56" : "h-10 w-32"}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function NotificationSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)]">
          <div className="skeleton w-10 h-10 rounded-full" />
          <div className="flex-1">
            <div className="skeleton h-3 w-3/4 mb-2 rounded" />
            <div className="skeleton h-2.5 w-1/2 rounded" />
          </div>
          <div className="skeleton h-2 w-10 rounded" />
        </div>
      ))}
    </div>
  );
}

export function GroupInfoSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex flex-col items-center p-6 bg-[var(--card-bg)] rounded-3xl border border-[var(--card-border)]">
        <div className="skeleton w-28 h-28 rounded-full mb-4" />
        <div className="skeleton h-6 w-40 mb-2 rounded" />
        <div className="skeleton h-3 w-56 mb-4 rounded" />
        <div className="flex gap-3">
          <div className="skeleton h-8 w-24 rounded-full" />
          <div className="skeleton h-8 w-28 rounded-full" />
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)]">
            <div className="skeleton w-10 h-10 rounded-full" />
            <div className="flex-1">
              <div className="skeleton h-3.5 w-28 mb-1 rounded" />
              <div className="skeleton h-2.5 w-20 rounded" />
            </div>
            <div className="skeleton h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Default export for backward compatibility (used in home page)
export default function SkeletonChildren() {
  return (
    <div className="w-full max-w-[600px] space-y-4">
      {[...Array(3)].map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}