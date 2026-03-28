"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, TextField, Button, Avatar, IconButton, 
  Typography, Paper, CircularProgress 
} from '@mui/material';
import { PhotoCamera, ArrowBack, Save } from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { updateGroup, getGroupDetails } from '@/redux/Slices/messageSlice';

export default function UpdateGroupPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { groupInfo, conversationLoading } = useSelector((state) => state.message);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    dispatch(getGroupDetails(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (groupInfo) {
      setFormData({
        name: groupInfo.name || '',
        description: groupInfo.description || '',
      });
      setPreviewUrl(`http://127.0.0.1:8000/storage/${groupInfo.photo_url}`);
    }
  }, [groupInfo]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    const groupId = id
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    
    if (selectedFile) {
      data.append('photo', selectedFile);
    }

    dispatch(updateGroup({ groupId, data }));
    router.back()
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-2xl mx-auto flex flex-col gap-1.5">
        <Paper className="p-8 rounded-3xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8 flex flex-col justify-center gap-2">
            <div className="flex flex-col items-center  gap-2">
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
                {'groupAvatar'}
              </Typography>
            </div>

            <div className="space-y-6 flex flex-col gap-2">
              <TextField
                fullWidth
                label='groupName'
                variant="outlined"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                InputProps={{ className: "rounded-xl font-medium" }}
              />

              <TextField
                fullWidth
                label={'description'}
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
                {'cancel'}
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={conversationLoading}
                startIcon={conversationLoading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                className="py-3 rounded-xl bg-[#1477ff] hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none font-bold normal-case"
              >
                {conversationLoading ? 'saving' : 'saveChanges'}
              </Button>
            </Box>
          </form>
        </Paper>
      </div>
    </div>
  );
}
