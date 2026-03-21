"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Drawer,
  IconButton
} from '@mui/material';

import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import MenuIcon from '@mui/icons-material/Menu';
import { Home } from '@mui/icons-material';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation();

  const menuGroups = [
    {
      title: t("dashboard.dataInsights", "Data & Insights"),
      items: [
        { text: t("dashboard.analytics", "Analytics"), icon: <BarChartIcon />, path: "/dashboard/analytics" },
      ]
    },
    {
      title: t("dashboard.userManagement", "User Management"),
      items: [
        { text: t("dashboard.users", "All Users"), icon: <PeopleAltIcon />, path: "/dashboard/users" }
      ]
    },
    {
      title: t("dashboard.moderation", "Moderation"),
      items: [
        { text: t("dashboard.reports", "Pending Reports"), icon: <ReportProblemIcon />, path: "/dashboard/reports" },
      ]
    }
  ];

  const drawerContent = (
    <Box className="w-64 h-full bg-white dark:bg-[#081F5C] border-r border-[#e2e8f0] dark:border-[#334EAC] flex flex-col transition-colors duration-300">
      <div className="p-6">
        <Typography className="text-2xl font-black text-[#1477ff] dark:text-[#E7F1FF] tracking-tighter">
          TAWASSOL <span className="text-slate-400 dark:text-[#D0E3FF] font-medium">dashboard</span>
        </Typography>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto">
        {menuGroups.map((group, index) => (
          <div key={index} className="mb-6">
            <Typography className="px-4 mb-2 text-[10px] font-black uppercase text-[#94a3b8] dark:text-[#D0E3FF] tracking-[2px]">
              {group.title}
            </Typography>
            <List className="p-0">
              {group.items.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <ListItem key={item.path} disablePadding className="mb-1">
                    <Link href={item.path} passHref className="w-full no-underline">
                      <ListItemButton 
                        selected={isActive}
                        className={`rounded-xl transition-all ${
                          isActive 
                          ? 'bg-blue-50 dark:bg-[#334EAC] text-[#1477ff] dark:text-[#F9FCFF]' 
                          : 'text-[#64748b] dark:text-[#D0E3FF] hover:bg-slate-50 dark:hover:bg-[#334EAC]'
                        }`}
                        sx={{
                          '&.Mui-selected': { 
                            backgroundColor: 'transparent', 
                          },
                          py: 1.5
                        }}
                        onClick={() => setMobileOpen(false)}
                      >
                        <ListItemIcon className={`min-w-[40px] ${isActive ? 'text-[#1477ff] dark:text-[#F9FCFF]' : 'text-[#94a3b8] dark:text-[#D0E3FF]'}`}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={item.text} 
                          primaryTypographyProps={{ 
                            className: `text-sm font-bold ${isActive ? 'text-[#1477ff] dark:text-[#F9FCFF]' : ''}` 
                          }} 
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                );
              })}
            </List>
            {index !== menuGroups.length - 1 && <Divider className="mt-4 border-[#f1f5f9] dark:border-[#334EAC]" />}
          </div>
        ))}
      </nav>

      {/* Footer Profile Mini-card */}
      <div className="p-4 border-t border-[#f1f5f9] dark:border-[#334EAC]">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-[#334EAC] border border-[#e2e8f0] dark:border-[#081F5C]">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-black">
            <Home/>
          </div>
          <div className="overflow-hidden">
            <Link href={'/home'}>
              <Typography className="text-xs font-black truncate text-[#0f172a] dark:text-[#F9FCFF]">
                {t("dashboard.backToHome", "Back to home")}
              </Typography>
            </Link>
          </div>
        </div>
      </div>
    </Box>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-[#081F5C] border-b border-[#e2e8f0] dark:border-[#334EAC] w-full transition-colors duration-300">
        <Typography className="text-xl font-black text-[#1477ff] dark:text-[#E7F1FF] tracking-tighter">
          TAWASSOL
        </Typography>
        <IconButton onClick={() => setMobileOpen(!mobileOpen)} sx={{ color: "var(--text-primary)" }}>
          <MenuIcon className="dark:text-[#F9FCFF]" />
        </IconButton>
      </div>

      {/* Mobile Drawer Navigation */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 256, bgcolor: 'transparent', border: 'none' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Persistent Sidebar */}
      <Box className="hidden md:flex w-64 h-screen sticky top-0 flex-shrink-0 z-10 transition-colors duration-300">
        {drawerContent}
      </Box>
    </>
  );
}
