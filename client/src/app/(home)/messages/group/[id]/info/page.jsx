"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getGroupDetails } from "@/redux/reducers/messageReducer";
import { 
  Avatar, CircularProgress, Chip, Button, Box, Divider 
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import dayjs from "dayjs";
import AddMemberModal from "@/components/addMembersModel";

export default function GroupDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { groupInfo, loading } = useSelector((state) => state.message);

  useEffect(() => {
    dispatch(getGroupDetails(id));
  }, [id, dispatch]);

  if (loading || !groupInfo) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f8fafc]">
        <CircularProgress sx={{ color: '#1477ff' }} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen">
      {/* Group Header */}
      <div className="flex flex-col items-center text-center mb-8 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <Avatar
          src={`http://127.0.0.1:8000/storage/${groupInfo.photo_url}`}
          sx={{ width: 120, height: 120 }}
          className="border-4 border-slate-50 shadow-sm"
        />
        <h1 className="text-2xl font-black text-slate-900 mt-4 tracking-tight">
          {groupInfo.name}
        </h1>
        <p className="text-slate-500 mt-2 max-w-md">
          {groupInfo.description || "No description provided."}
        </p>
        <div className="flex items-center gap-3 mt-4">
          <Chip
            icon={<GroupIcon style={{ fontSize: 16 }} />}
            label={`${groupInfo?.members?.length || 0} Members`}
            className="bg-blue-50 text-blue-700 font-bold"
          />
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
            Created {dayjs(groupInfo.created_at).format("MMM D, YYYY")}
          </p>
        </div>
      </div>

      {/* Members Section Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-lg font-black text-slate-800">
          Members
        </h2>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1477ff] hover:bg-blue-700 shadow-lg shadow-blue-100 rounded-xl font-bold normal-case px-4 py-2"
        >
          Add Members
        </Button>
      </div>

      <div className="space-y-3">
        {groupInfo?.members?.map((member) => (
          <div
            key={member.user_id}
            className="flex items-center justify-between bg-white border border-slate-100 rounded-2xl p-4 transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <Avatar
                src={`http://127.0.0.1:8000/storage/${member.avatar_url}`}
                className="w-10 h-10"
              />
              <div>
                <p className="font-bold text-slate-900 text-sm">
                  {member.display_name}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Joined {dayjs(member.joined_at).format("MMM D")}
                </p>
              </div>
            </div>
            <Chip
              label={member.role}
              size="small"
              className={member.role === "admin" 
                ? "bg-orange-50 text-orange-600 font-black text-[10px]" 
                : "bg-slate-50 text-slate-500 font-bold text-[10px]"}
            />
          </div>
        ))}
      </div>

      {/* Add Member Modal */}
      <AddMemberModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        groupId={id}
        existingMembers={groupInfo?.members || []}
      />
    </div>
  );
}
