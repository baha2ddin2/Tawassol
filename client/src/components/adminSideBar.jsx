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
  Divider
} from '@mui/material';


import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { Home } from '@mui/icons-material';
import Image from 'next/image';


const menuGroups = [
  {
    title: "Data & Insights",
    items: [

      { text: "Analytics", icon: <BarChartIcon />, path: "/dashboard/analytics" },
    ]
  },
  {
    title: "User Management",
    items: [
      { text: "All Users", icon: <PeopleAltIcon />, path: "/dashboard/users" }
    ]
  },
  {
    title: "Moderation",
    items: [
      { text: "Pending Reports", icon: <ReportProblemIcon />, path: "/dashboard/reports" },
    ]
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Box className="w-64 h-screen bg-white border-r border-[#e2e8f0] flex flex-col sticky top-0">
      
      <div className="p-6">
        <Image src={'/logo.jpeg'} alt='tawassol' width={40} height={40} />
        <Typography className="text-2xl font-black text-[#1477ff] tracking-tighter">
          TAWASSOL <span className="text-slate-400 font-medium">dashboard</span>
        </Typography>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto">
        {menuGroups.map((group, index) => (
          <div key={group.title} className="mb-6">
            <Typography className="px-4 mb-2 text-[10px] font-black uppercase text-[#94a3b8] tracking-[2px]">
              {group.title}
            </Typography>
            
            <List className="p-0">
              {group.items.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <ListItem key={item.text} disablePadding className="mb-1">
                    <Link href={item.path} passHref className="w-full no-underline">
                      <ListItemButton 
                        selected={isActive}
                        className={`rounded-xl transition-all ${
                          isActive 
                          ? 'bg-blue-50 text-[#1477ff] hover:bg-blue-100' 
                          : 'text-[#64748b] hover:bg-slate-50'
                        }`}
                        sx={{
                          '&.Mui-selected': { 
                            backgroundColor: '#eff6ff', 
                          },
                          py: 1.5
                        }}
                      >
                        <ListItemIcon className={`min-w-[40px] ${isActive ? 'text-[#1477ff]' : 'text-[#94a3b8]'}`}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={item.text} 
                          primaryTypographyProps={{ 
                            className: `text-sm font-bold ${isActive ? 'text-[#1477ff]' : ''}` 
                          }} 
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                );
              })}
            </List>
            {index !== menuGroups.length - 1 && <Divider className="mt-4 border-[#f1f5f9]" />}
          </div>
        ))}
      </nav>

      {/* Footer Profile Mini-card */}
      <div className="p-4 border-t border-[#f1f5f9]">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-[#e2e8f0]">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-black">
            <Home/>
          </div>
          <div className="overflow-hidden">
            <Link href={'/home'} >
              <Typography className="text-xs font-black truncate text-[#0f172a]">Back to home</Typography>
            </Link>
            
          </div>
        </div>
      </div>
    </Box>
  );
}
