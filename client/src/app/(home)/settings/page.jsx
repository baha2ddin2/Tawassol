"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { myReport } from "@/redux/Slices/reportSlice";

import Sidebar from "./Sidebar";
import PasswordTab from "./PasswordTab";
import DeleteDialog from "./DeleteDialog";
import ReportsTab from "./ReportsTab";
import AccountTab from "./AccountTab";
import EmailTab from "./EmailTab";
import AppearanceTab from "./AppearanceTab";
import LanguageTab from "./LanguageTab";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account");
  const [openDelete, setOpenDelete] = useState(false);
  
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(myReport());
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] font-sans text-[var(--text-primary)] transition-colors duration-300">
      <main className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isAdmin={userInfo?.user?.is_admin} 
          onDeleteClick={() => setOpenDelete(true)} 
        />

        <div className="flex-grow max-w-[800px]">
          {activeTab === "password" && <PasswordTab />}
          {activeTab === "reports" && <ReportsTab/> }
          {activeTab === "account" && <AccountTab/>}
          {activeTab === "email" && <EmailTab/>}
          {activeTab === "appearance" && <AppearanceTab/>}
          {activeTab === "language" && <LanguageTab/>}
        </div>
      </main>

      <DeleteDialog 
        open={openDelete} 
        onClose={() => setOpenDelete(false)} 
        onConfirm={() => {
            console.log("Deleted!");
            setOpenDelete(false);
        }} 
      />
    </div>
  );
}
