"use client";

import React, { useEffect, useState } from 'react';
import { 
  Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, 
  TableContainer, Pagination, Box, TextField, InputAdornment 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { getReports } from '@/redux/Slices/dashboardSlice';
import ReportRow from '@/components/ReportRow';
import { useTranslation } from 'react-i18next';

export default function AllReportsPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { reports, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); 
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(getReports({ page, search: debouncedSearch }));
  }, [dispatch, page, debouncedSearch]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    // Base Background: Light (#F9FCFF) | Dark (#081F5C)
    <div className="min-h-screen bg-[#F9FCFF] dark:bg-[#081F5C] p-6 md:p-8 font-sans transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Typography variant="h4" className="font-black text-[#081F5C] dark:text-[#F9FCFF] tracking-tight mb-1">
              {t("dashboard.reportsManagement", "Reports Management")}
            </Typography>
            <Typography className="text-[#334EAC] dark:text-[#D0E3FF] font-medium text-sm">
              {t("dashboard.reviewAndAct", "Review and act on flagged content across the platform.")}
            </Typography>
          </div>
        </div>

        {/* Table Card: Dark Container (#334EAC) */}
        <TableContainer 
          component={Paper} 
          elevation={0} 
          className="rounded-2xl border border-[#D0E3FF] dark:border-[#334EAC] overflow-hidden shadow-sm bg-white dark:bg-[#334EAC] transition-colors duration-300"
        >
          
          {/* Filters Bar */}
          <Box className="p-4 bg-white dark:bg-[#081F5C] border-b border-[#D0E3FF] dark:border-[#334EAC] flex flex-col md:flex-row items-center justify-between transition-colors duration-300">
            <TextField
              placeholder={t("dashboard.searchPlaceholder", "Search by ID or Username...")}
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-[#334EAC] dark:text-[#D0E3FF]" fontSize="small" />
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: '10px', 
                  color: 'inherit',
                  '& .MuiOutlinedInput-notchedOutline': { 
                    borderColor: '#D0E3FF' 
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': { 
                    borderColor: '#334EAC' 
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                    borderColor: '#709601' 
                  },
                  // Dark Mode Input Styles
                  '.dark &': {
                    bgcolor: '#081F5C',
                    color: '#F9FCFF',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334EAC' },
                  }
                }
              }}
              className="w-full max-w-sm"
            />
          </Box>

          {/* Data Table */}
          <Table>
            <TableHead className="bg-[#E7F1FF] dark:bg-[#081F5C] transition-colors duration-300">
              <TableRow>
                {["reportedTarget", "reporter", "type", "status", "date"].map((header) => (
                  <TableCell 
                    key={header}
                    className="font-bold text-[#334EAC] dark:text-[#D0E3FF] uppercase text-[11px] tracking-wider border-b border-[#D0E3FF] dark:border-[#334EAC]"
                  >
                    {t(`dashboard.${header}`)}
                  </TableCell>
                ))}
                <TableCell align="right" className="border-b border-[#D0E3FF] dark:border-[#334EAC]"></TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody className="bg-white dark:bg-[#334EAC] transition-colors duration-300">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" className="py-10 text-[#334EAC] dark:text-[#F9FCFF] border-b border-[#D0E3FF] dark:border-[#081F5C]">
                    {t("dashboard.loading", "Loading reports...")}
                  </TableCell>
                </TableRow>
              ) : reports?.data?.length > 0 ? (
                reports.data.map((item) => (
                  <ReportRow key={item.report_id} item={item} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" className="py-10 text-[#334EAC] dark:text-[#F9FCFF] border-b border-[#D0E3FF] dark:border-[#081F5C]">
                    {t("dashboard.noReports", "No reports found.")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {reports?.total > 0 && (
            <Box className="px-6 py-4 bg-white dark:bg-[#081F5C] border-t border-[#D0E3FF] dark:border-[#334EAC] flex flex-col md:flex-row items-center justify-between transition-colors duration-300 gap-4">
              <Typography className="text-xs text-[#334EAC] dark:text-[#D0E3FF] font-medium">
                {t("dashboard.showing")} <span className="font-bold text-[#081F5C] dark:text-[#F9FCFF]">{reports.from || 0}</span> 
                {" " + t("dashboard.to") + " "} 
                <span className="font-bold text-[#081F5C] dark:text-[#F9FCFF]">{reports.to || 0}</span> 
                {" " + t("dashboard.of") + " "} 
                <span className="font-bold text-[#081F5C] dark:text-[#F9FCFF]">{reports.total || 0}</span> 
                {" " + t("dashboard.results")}
              </Typography>
              
              <Pagination 
                count={reports.last_page || 1} 
                page={page} 
                onChange={handlePageChange}
                shape="rounded"
                size="medium"
                sx={{
                  '& .MuiPaginationItem-root': { 
                    fontWeight: '600', 
                    color: '#334EAC',
                    borderRadius: '8px',
                    '.dark &': { color: '#D0E3FF' }
                  },
                  '& .Mui-selected': { 
                    bgcolor: '#709601 !important',
                    color: 'white !important', 
                    boxShadow: '0 2px 4px rgba(112, 150, 1, 0.3)'
                  }
                }}
              />
            </Box>
          )}
        </TableContainer>
      </div>
    </div>
  );
}
