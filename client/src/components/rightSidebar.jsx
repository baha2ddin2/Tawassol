import { Card, Avatar } from "@mui/material";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function RightSidebar({ suggestions, handelFollow }) {
  const { t } = useTranslation();
  return (
    <aside className="w-full lg:w-[320px] lg:sticky lg:top-25 lg:mt-25 h-fit mb-6 lg:mb-0 block">
      <Card className="rounded-xl shadow-sm border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
        <h3 className="font-bold text-lg text-[var(--text-primary)] mb-4">{t("suggestions.title", "Suggestions")}</h3>
        <div className="flex overflow-x-auto gap-4 lg:flex-col lg:space-y-4 lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
          {suggestions.map((user) => (
            <div
              key={user.user_id}
              className="flex flex-col lg:flex-row lg:justify-between items-center min-w-[120px] lg:min-w-0 bg-[var(--nav-pill-bg)] lg:bg-transparent p-3 lg:p-0 rounded-xl"
            >
              <Link href={`/profile/${user.user_id}`} className="flex flex-col lg:flex-row gap-2 lg:gap-3 items-center text-center lg:text-left mb-2 lg:mb-0">
                <Avatar
                  className="w-12 h-12 lg:w-9 lg:h-9"
                  src={user.avatar_url ? `http://127.0.0.1:8000/storage/${user.avatar_url}` : undefined}
                />
                <div className="text-sm">
                  <p className="font-bold leading-tight text-[var(--text-primary)] line-clamp-1">
                    {user.display_name}
                  </p>
                  <p className="text-[var(--text-muted)] text-[10px] lg:text-xs mt-0.5">
                    {t("suggestions.suggested", "Suggested for you")}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => handelFollow(user)}
                className="text-white lg:text-blue-500 bg-blue-500 lg:bg-transparent px-4 py-1.5 lg:px-0 lg:py-0 rounded-full lg:rounded-none text-xs font-bold hover:bg-blue-600 lg:hover:bg-transparent lg:hover:text-blue-700 transition w-full lg:w-auto mt-2 lg:mt-0"
              >
                {user.has_followed ? t("suggestions.followed", "followed") : t("suggestions.follow", "Follow")}
              </button>
            </div>
          ))}
        </div>
      </Card>
    </aside>
  );
}
