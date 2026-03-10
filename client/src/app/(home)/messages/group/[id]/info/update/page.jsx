"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, TextField, Button, Avatar, IconButton, 
  Typography, Paper, CircularProgress 
} from '@mui/material';
import { PhotoCamera, ArrowBack, Save } from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { updateGroupAction, getGroupDetails } from '@/redux/reducers/groupReducer';
import { useTranslations } from 'next-intl';

export default function UpdateGroupPage() {
  const { groupId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const t = useTranslations('Groups');
  const fileInputRef = useRef(null);

  const { currentGroup, loading } = useSelector((state) => state.groups);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    dispatch(getGroupDetails(groupId));
  }, [groupId, dispatch]);

  useEffect(() => {
    if (currentGroup) {
      setFormData({
        name: currentGroup.name || '',
        description: currentGroup.description || '',
      });
      setPreviewUrl(`http://127.0.0.1:8000/storage/${currentGroup.photo_url}`);
    }
  }, [currentGroup]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create local preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create FormData
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    
    if (selectedFile) {
      data.append('photo', selectedFile);
    }

    // CRITICAL: Laravel Method Spoofing
    // Since we are sending a file via POST but your route is likely PUT/PATCH
    data.append('_method', 'PUT');

    dispatch(updateGroupAction({ groupId, data }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Box className="flex items-center gap-4 mb-8">
          <IconButton onClick={() => router.back()} className="bg-white dark:bg-slate-800 shadow-sm">
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" className="font-black text-slate-900 dark:text-white">
            {t('editGroup')}
          </Typography>
        </Box>

        <Paper className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Photo Upload Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar 
                  src={previewUrl} 
                  sx={{ width: 120, height: 120 }} 
                  className="border-4 border-white dark:border-slate-800 shadow-lg"
                />
                <IconButton 
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 bg-[#1477ff] text-white hover:bg-blue-700 shadow-md"
                  size="small"
                >
                  <PhotoCamera fontSize="small" />
                </IconButton>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                hidden 
                accept="image/*" 
                onChange={handleFileChange} 
              />
              <Typography className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {t('groupAvatar')}
              </Typography>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <TextField
                fullWidth
                label={t('groupName')}
                variant="outlined"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                InputProps={{ className: "rounded-xl font-medium" }}
              />

              <TextField
                fullWidth
                label={t('description')}
                variant="outlined"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                InputProps={{ className: "rounded-xl font-medium" }}
              />
            </div>

            {/* Action Buttons */}
            <Box className="flex gap-4 pt-4">
              <Button
                fullWidth
                variant="outlined"
                onClick={() => router.back()}
                className="py-3 rounded-xl border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold normal-case"
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                className="py-3 rounded-xl bg-[#1477ff] hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none font-bold normal-case"
              >
                {loading ? t('saving') : t('saveChanges')}
              </Button>
            </Box>
          </form>
        </Paper>
      </div>
    </div>
  );
}
