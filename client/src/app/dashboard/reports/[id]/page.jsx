"use client";

import React, { useState } from 'react';
import Head from 'next/head';
import { 
  Typography, Paper, Chip, Button, IconButton, 
  Divider, Tooltip, Alert, Box 
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import HistoryIcon from '@mui/icons-material/History';
import GavelIcon from '@mui/icons-material/Gavel';


const pendingReport = {
  report_id: "REP-9921",
  reason: "This user is spreading misinformation and harassing others in the comments section.",
  status: "pending",
  created_at: "2026-03-07T21:00:00Z",
  report_type: "comment",
  target_id: 45,
  target_comment_id: 102,
  target_post_id: null,
  reporter_name: "Sami K.",
  target_name: "BadActor_01"
};

export default function HandleReportPage() {
  const [report, setReport] = useState(pendingReport);
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    setLoading(true);
    
    console.log(`Calling API: /api/reports/${report.report_id}/handle with action: ${action}`);
    
    setTimeout(() => {
      setReport({ 
        ...report, 
        status: action === 'ignore' ? 'rejected' : 'completed' 
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4 md:p-8 font-sans">
      <Head>
        <title>Tawassol Admin - Handle Report</title>
      </Head>

      <div className="max-w-[800px] mx-auto">
        
        {/* Breadcrumbs / Back */}
        <div className="flex items-center gap-2 text-[#64748b] mb-6">
          <HistoryIcon fontSize="small" />
          <span className="text-sm font-bold hover:underline cursor-pointer">Moderation Queue</span>
          <span className="text-xs">/</span>
          <span className="text-sm font-medium">Report #{report.report_id}</span>
        </div>

        <Paper elevation={0} className="rounded-[24px] border border-[#e2e8f0] overflow-hidden shadow-sm">
          
          {/* Header Section */}
          <div className="bg-white p-6 border-b border-[#f1f5f9] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                <GavelIcon />
              </div>
              <div>
                <Typography className="font-black text-xl text-[#0f172a]">Handle Report</Typography>
                <div className="flex items-center gap-2">
                  <Chip 
                    label={report.report_type.toUpperCase()} 
                    size="small" 
                    className="bg-slate-100 text-slate-600 font-black text-[10px]" 
                  />
                  <Typography className="text-[#64748b] text-xs font-bold uppercase tracking-widest">
                    ID: {report.report_id}
                  </Typography>
                </div>
              </div>
            </div>

            {report.status !== 'pending' && (
              <Alert severity={report.status === 'completed' ? "success" : "info"} className="rounded-xl font-bold py-0">
                Case {report.status === 'completed' ? 'Resolved' : 'Rejected/Ignored'}
              </Alert>
            )}
          </div>

          {/* Details Body */}
          <div className="p-8 bg-white space-y-8">
            
            {/* Report Context */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Typography className="text-xs font-black text-[#94a3b8] uppercase">Reporter</Typography>
                <Typography className="font-bold text-[#0f172a]">{report.reporter_name}</Typography>
              </div>
              <div className="space-y-1">
                <Typography className="text-xs font-black text-[#94a3b8] uppercase">Reported User</Typography>
                <Typography className="font-bold text-red-600">{report.target_name} (UID: {report.target_id})</Typography>
              </div>
            </div>

            <Divider />

            {/* Reason Section */}
            <div>
              <Typography className="text-xs font-black text-[#94a3b8] uppercase mb-2">Report Reason</Typography>
              <Paper variant="outlined" className="p-4 bg-slate-50 border-slate-200 rounded-xl">
                <Typography className="text-[#334155] leading-relaxed italic">
                  "{report.reason}"
                </Typography>
              </Paper>
            </div>

            {/* Evidence Preview (Conditional) */}
            <div>
              <Typography className="text-xs font-black text-[#94a3b8] uppercase mb-3">Evidence Preview</Typography>
              <div className="flex items-center justify-between p-4 border border-[#e2e8f0] rounded-xl bg-white hover:border-blue-300 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <VisibilityOutlinedIcon />
                  </div>
                  <Typography className="font-bold text-sm text-[#0f172a]">
                    View flagged {report.report_type} content
                  </Typography>
                </div>
                <Typography className="text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  OPEN LINK
                </Typography>
              </div>
            </div>

            <Divider />

            {/* Actions Footer - Matches Laravel Logic */}
            {report.status === 'pending' && (
              <div className="flex flex-col md:flex-row gap-3">
                <Button 
                  fullWidth 
                  variant="contained" 
                  disabled={loading}
                  onClick={() => handleAction('ignore')}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 rounded-xl shadow-none normal-case"
                >
                  Ignore Report
                </Button>

                {/* Specific Action for Content */}
                {(report.target_post_id || report.target_comment_id) && (
                  <Button 
                    fullWidth 
                    variant="contained" 
                    color="error"
                    disabled={loading}
                    startIcon={<DeleteOutlineIcon />}
                    onClick={() => handleAction('delete')}
                    className="bg-red-500 hover:bg-red-600 font-bold py-3 rounded-xl shadow-lg shadow-red-500/20 normal-case"
                  >
                    Delete {report.report_type}
                  </Button>
                )}

                {/* Specific Action for Account */}
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="error"
                  disabled={loading}
                  startIcon={<BlockIcon />}
                  onClick={() => handleAction('block')}
                  className="bg-black hover:bg-gray-800 font-bold py-3 rounded-xl shadow-lg shadow-gray-900/20 normal-case"
                >
                  Block User Account
                </Button>
              </div>
            )}

            {report.status !== 'pending' && (
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<CheckCircleOutlineIcon />}
                className="border-slate-200 text-slate-400 font-bold py-3 rounded-xl normal-case"
                disabled
              >
                Resolution Applied
              </Button>
            )}
          </div>

          <div className="bg-[#f8fafd] p-4 text-center">
            <Typography className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-tighter">
              All moderation actions are logged for auditing purposes.
            </Typography>
          </div>
        </Paper>
      </div>
    </div>
  );
}