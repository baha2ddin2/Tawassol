import { Card, Avatar } from "@mui/material";
import Link from "next/link";
export default function RightSidebar({ suggestions, handelFollow }) {
  return (
    <aside className="w-[320px] hidden lg:block sticky top-25 mt-25 h-fit space-y-6">
      <Card className="rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="font-bold text-lg mb-4">Suggestions</h3>
        <div className="space-y-4">
          {suggestions.map((user) => (
            <div
              key={user.user_id}
              className="flex justify-between items-center"
            >
              <Link href={`/profile/${user.user_id}`} >
                <div className="flex gap-3 items-center">
                  <Avatar
                    className="w-9 h-9"
                    src={`http://127.0.0.1:8000/storage/${user.avatar_url}`}
                  />
                  <div className="text-sm">
                    <p className="font-bold leading-none">
                      {user.display_name}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Suggested for you
                    </p>
                  </div>
                </div>
              </Link>
              <button
                onClick={() => handelFollow(user)}
                className="text-blue-500 text-xs font-bold hover:text-blue-700"
              >
                {user.has_followed ? "followed" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      </Card>
    </aside>
  );
}
