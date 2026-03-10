"use client";

import React, { useState } from 'react';
import { 
  Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, Avatar, IconButton, Button, 
  Pagination, Box, TextField, InputAdornment 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';


export default function AllReportsPage() {
  // Logic to handle state from your ->paginate(10) response
  const [page, setPage] = useState(1);

  return (
    <div className="min-h-screen bg-[#f6f8fc] p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Typography variant="h4" className="font-black text-[#0f172a] tracking-tight">
              Reports Management
            </Typography>
            <Typography className="text-[#64748b] font-medium">
              Review and act on flagged content across the platform.
            </Typography>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outlined" 
              startIcon={<FilterListIcon />}
              className="border-[#e2e8f0] text-[#0f172a] font-bold rounded-xl normal-case bg-white"
            >
              Filters
            </Button>
          </div>
        </div>

        {/* Stats Row (Optional but helpful for Admins) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Pending Reviews', count: '24', color: 'bg-orange-50 text-orange-600' },
            { label: 'Resolved Today', count: '142', color: 'bg-green-50 text-green-600' },
            { label: 'Total Reports', count: '1.2k', color: 'bg-blue-50 text-blue-600' },
          ].map((stat, i) => (
            <Paper key={i} elevation={0} className={`p-6 rounded-3xl border border-[#e2e8f0] ${stat.color}`}>
              <Typography className="text-xs font-black uppercase tracking-wider opacity-70">{stat.label}</Typography>
              <Typography variant="h4" className="font-black mt-1">{stat.count}</Typography>
            </Paper>
          ))}
        </div>

        {/* Search and Table Container */}
        <TableContainer component={Paper} elevation={0} className="rounded-3xl border border-[#e2e8f0] overflow-hidden">
          <Box className="p-4 bg-white border-b border-[#f1f5f9] flex items-center">
            <TextField
              placeholder="Search by Report ID or User..."
              size="small"
              fullWidth
              variant="outlined"
              className="max-w-md"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-[#94a3b8]" />
                  </InputAdornment>
                ),
                sx: { borderRadius: '12px', bgcolor: '#f8fafc' }
              }}
            />
          </Box>

          <Table>
            <TableHead className="bg-[#f8fafc]">
              <TableRow>
                <TableCell className="font-black text-[#94a3b8] uppercase text-xs">Reported Content</TableCell>
                <TableCell className="font-black text-[#94a3b8] uppercase text-xs">Reporter</TableCell>
                <TableCell className="font-black text-[#94a3b8] uppercase text-xs text-center">Type</TableCell>
                <TableCell className="font-black text-[#94a3b8] uppercase text-xs text-center">Status</TableCell>
                <TableCell className="font-black text-[#94a3b8] uppercase text-xs">Date</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* This is where you would map over your Laravel data: reports.data.map(...) */}
              {[1, 2, 3, 4, 5].map((item) => (
                <TableRow key={item} className="hover:bg-[#fcfdfe] transition-colors cursor-pointer">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                        {item}
                      </div>
                      <div>
                        <Typography className="font-bold text-sm text-[#0f172a]">Case #{1042 + item}</Typography>
                        <Typography className="text-xs text-[#64748b]">Target: Zaid Kamil</Typography>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar sx={{ width: 24, height: 24 }} />
                      <Typography className="font-bold text-sm text-[#0f172a]">Sami K.</Typography>
                    </div>
                  </TableCell>

                  <TableCell align="center">
                    <Chip 
                      label="POST" 
                      size="small" 
                      className="bg-blue-50 text-blue-600 font-black text-[10px] rounded-md"
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Chip 
                      label="PENDING" 
                      size="small" 
                      className="bg-orange-100 text-orange-700 font-bold text-[11px]"
                    />
                  </TableCell>

                  <TableCell>
                    <Typography className="text-xs font-medium text-[#64748b]">Mar 7, 2026</Typography>
                  </TableCell>

                  <TableCell align="right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="contained" 
                        size="small"
                        startIcon={<VisibilityIcon sx={{ fontSize: '14px !important' }} />}
                        className="bg-[#1477ff] hover:bg-blue-700 font-bold rounded-lg normal-case shadow-none"
                      >
                        Review
                      </Button>
                      <IconButton size="small"><MoreVertIcon /></IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box className="p-6 bg-white border-t border-[#f1f5f9] flex items-center justify-between">
            <Typography className="text-sm text-[#64748b] font-medium">
              Showing 1 to 10 of 240 results
            </Typography>
            <Pagination 
              count={24} 
              page={page} 
              onChange={(e, v) => setPage(v)}
              shape="rounded"
              sx={{
                '& .Mui-selected': { bgcolor: '#1477ff !important', color: 'white', fontWeight: 'bold' },
                '& .MuiPaginationItem-root': { borderRadius: '10px', fontWeight: 'bold' }
              }}
            />
          </Box>
        </TableContainer>
      </div>
    </div>
  );
}