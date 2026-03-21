import React from 'react';
import { TableRow, TableCell, Typography, Avatar, Chip, Button, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';
import CommentIcon from '@mui/icons-material/Comment';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function ReportRow({ item }) {
    const router = useRouter() 
    const { t } = useTranslation()
  const getTargetInfo = () => {
    switch (item.report_type) {
      case 'user':
        return { name: item.target_user_name, avatar: item.target_user_avatar, type: 'User' };
      case 'post':
        return { name: item.post_owner_name, avatar: item.post_owner_avatar, type: 'Post', preview: item.post_content };
      case 'comment':
        return { name: item.comment_owner_name, avatar: item.comment_owner_avatar, type: 'Comment', preview: item.comment_content };
      default:
        return { name: 'Unknown', type: 'Unknown' };
    }
  };

  const target = getTargetInfo();
  const avatarUrl = target.avatar ? `http://127.0.0.1:8000/storage/${target.avatar}` : null;
  const reporterUrl = item.reporter_avatar ? `http://127.0.0.1:8000/storage/${item.reporter_avatar}` : null;

  const typeColors = {
    user: { bg: 'bg-purple-50', text: 'text-purple-600', icon: <PersonIcon sx={{fontSize: 14}}/> },
    post: { bg: 'bg-blue-50', text: 'text-blue-600', icon: <ArticleIcon sx={{fontSize: 14}}/> },
    comment: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: <CommentIcon sx={{fontSize: 14}}/> }
  };

  const statusColors = {
    'in progress': 'bg-amber-100 text-amber-700',
    'pending': 'bg-slate-100 text-slate-700',
    'resolved': 'bg-green-100 text-green-700'
  };

  const tColor = typeColors[item.report_type] || typeColors.user;
  const sColor = statusColors[item.status?.toLowerCase()] || statusColors.pending;

  return (
    <TableRow className="hover:bg-[#f8fafc] dark:hover:bg-[#334EAC] transition-colors duration-300 group border-b border-[#e2e8f0] dark:border-[#334EAC]">
      {/* Target Info */}
      <TableCell className="border-none">
        <div className="flex items-center gap-3">
          <Avatar src={avatarUrl} variant="rounded" className="w-10 h-10 shadow-sm" />
          <div>
            <Typography className="font-bold text-sm text-slate-800 dark:text-[#F9FCFF] transition-colors">
              {target.type}: {target.name}
            </Typography>
            <Typography className="text-xs text-slate-500 dark:text-[#D0E3FF] max-w-[200px] truncate" title={item.reason}>
              {t("dashboard.reason", "Reason")}: <span className="font-medium text-slate-700 dark:text-[#F9FCFF] transition-colors">{item.reason}</span>
            </Typography>
          </div>
        </div>
      </TableCell>
      
      {/* Reporter */}
      <TableCell className="border-none">
        <div className="flex items-center gap-2">
          <Avatar src={reporterUrl} sx={{ width: 28, height: 28 }} className="border border-slate-200 dark:border-[#334EAC]" />
          <Typography className="font-medium text-sm text-slate-700 dark:text-[#F9FCFF] transition-colors">{item.reporter_name}</Typography>
        </div>
      </TableCell>

      {/* Type */}
      <TableCell align="center" className="border-none">
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md ${tColor.bg} ${tColor.text}`}>
          {tColor.icon}
          <span className="text-[11px] font-bold uppercase tracking-wider">{item.report_type}</span>
        </div>
      </TableCell>

      {/* Status */}
      <TableCell align="center" className="border-none">
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${sColor}`}>
          {item.status}
        </span>
      </TableCell>

      {/* Date */}
      <TableCell className="border-none">
        <Typography className="text-xs font-medium text-slate-500 dark:text-[#D0E3FF] transition-colors">
          {item.created_at ? item.created_at.split(' ')[0] : 'N/A'}
        </Typography>
      </TableCell>

      {/* Actions */}
      <TableCell align="right" className="border-none">
        <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">
          <Button 
          onClick={()=>router.push(`/dashboard/reports/${item.report_id}`)}
            variant="outlined" 
            size="small"
            startIcon={<VisibilityIcon sx={{ fontSize: '16px !important' }} />}
            className="border-slate-300 dark:border-[#334EAC] text-slate-700 dark:text-[#F9FCFF] hover:bg-slate-50 dark:hover:bg-[#081F5C] font-bold rounded-lg normal-case shadow-none text-xs py-1 transition-colors"
          >
            {t("dashboard.review", "Review")}
          </Button>
          <IconButton size="small" className="text-slate-400 dark:text-[#D0E3FF] hover:text-slate-700 dark:hover:text-[#F9FCFF]">
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </div>
      </TableCell>
    </TableRow>
  );
}
