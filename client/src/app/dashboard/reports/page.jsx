"use client";

import React, { useEffect, useState } from 'react';
import { 
  Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Pagination, Box, TextField, InputAdornment 
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
      setPage(1); // Reset page on new search
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
    <div className="min-h-screen bg-[var(--background)] p-6 md:p-8 font-sans transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Typography variant="h4" className="font-black text-[var(--text-primary)] dark:text-[#F9FCFF] tracking-tight mb-1">
              {t("dashboard.reportsManagement", "Reports Management")}
            </Typography>
            <Typography className="text-[var(--text-muted)] dark:text-[#D0E3FF] font-medium text-sm">
              {t("dashboard.reviewAndAct", "Review and act on flagged content across the platform.")}
            </Typography>
          </div>
        </div>

        {/* Table Card */}
        <TableContainer component={Paper} elevation={0} className="rounded-2xl border border-[var(--card-border)] overflow-hidden shadow-sm bg-[var(--card-bg)] transition-colors duration-300">
          
          {/* Filters Bar */}
          <Box className="p-4 bg-[var(--card-bg)] dark:bg-[#081F5C] border-b border-[var(--card-border)] dark:border-[#334EAC] flex flex-col md:flex-row items-center justify-between transition-colors duration-300">
            <TextField
              placeholder={t("dashboard.searchPlaceholder", "Search by ID or Username...")}
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "var(--text-muted)" }} fontSize="small" />
                  </InputAdornment>
                ),
                sx: { borderRadius: '10px', bgcolor: 'var(--input-bg)', '& fieldset': { borderColor: 'var(--input-border)' } }
              }}
              className="w-full max-w-sm"
            />
            {/* T9dr tzid hna des filtres akhrin (Status, Type...) */}
          </Box>

          {/* Data Table */}
          <Table>
            <TableHead className="bg-[#f8fafc] dark:bg-[#334EAC] transition-colors duration-300">
              <TableRow>
                <TableCell className="font-bold text-[#64748b] dark:text-[#F9FCFF] uppercase text-[11px] tracking-wider border-b-[#e2e8f0] dark:border-[#081F5C]">{t("dashboard.reportedTarget", "Reported Target")}</TableCell>
                <TableCell className="font-bold text-[#64748b] dark:text-[#F9FCFF] uppercase text-[11px] tracking-wider border-b-[#e2e8f0] dark:border-[#081F5C]">{t("dashboard.reporter", "Reporter")}</TableCell>
                <TableCell className="font-bold text-[#64748b] dark:text-[#F9FCFF] uppercase text-[11px] tracking-wider text-center border-b-[#e2e8f0] dark:border-[#081F5C]">{t("dashboard.type", "Type")}</TableCell>
                <TableCell className="font-bold text-[#64748b] dark:text-[#F9FCFF] uppercase text-[11px] tracking-wider text-center border-b-[#e2e8f0] dark:border-[#081F5C]">{t("dashboard.status", "Status")}</TableCell>
                <TableCell className="font-bold text-[#64748b] dark:text-[#F9FCFF] uppercase text-[11px] tracking-wider border-b-[#e2e8f0] dark:border-[#081F5C]">{t("dashboard.date", "Date")}</TableCell>
                <TableCell align="right" className="border-b-[#e2e8f0] dark:border-[#081F5C]"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="bg-white dark:bg-[#081F5C] transition-colors duration-300">
              {loading ? (
                <TableRow><TableCell colSpan={6} align="center" className="py-10 text-slate-500 dark:text-[#D0E3FF] border-b-[#e2e8f0] dark:border-[#334EAC]">{t("dashboard.loading", "Loading reports...")}</TableCell></TableRow>
              ) : reports?.data?.length > 0 ? (
                reports.data.map((item) => (
                  <ReportRow key={item.report_id} item={item} />
                ))
              ) : (
                <TableRow><TableCell colSpan={6} align="center" className="py-10 text-slate-500 dark:text-[#D0E3FF] border-b-[#e2e8f0] dark:border-[#334EAC]">{t("dashboard.noReports", "No reports found.")}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Footer */}
          {reports?.total > 0 && (
            <Box className="px-6 py-4 bg-white dark:bg-[#081F5C] border-t border-[#e2e8f0] dark:border-[#334EAC] flex flex-col md:flex-row items-center justify-between transition-colors duration-300 gap-4">
              <Typography className="text-xs text-[#64748b] dark:text-[#D0E3FF] font-medium">
                {t("dashboard.showing", "Showing")} <span className="font-bold text-slate-800 dark:text-[#F9FCFF]">{reports.from || 0}</span> {t("dashboard.to", "to")} <span className="font-bold text-slate-800 dark:text-[#F9FCFF]">{reports.to || 0}</span> {t("dashboard.of", "of")} <span className="font-bold text-slate-800 dark:text-[#F9FCFF]">{reports.total || 0}</span> {t("dashboard.results", "results")}
              </Typography>
              
              <Pagination 
                count={reports.last_page || 1} 
                page={page} 
                onChange={handlePageChange}
                shape="rounded"
                color="primary"
                size="medium"
                sx={{
                  '& .MuiPaginationItem-root': { 
                    fontWeight: '600', 
                    color: '#64748b',
                    borderRadius: '8px'
                  },
                  '& .Mui-selected': { 
                    bgcolor: '#2563eb !important', 
                    color: 'white', 
                    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
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
