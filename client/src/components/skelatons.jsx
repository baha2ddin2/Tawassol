"use client"

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';

function SkeletonChildrenDemo() {
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Box sx={{ m: 1 }}>
          <Skeleton variant="circular" width={40} height={40}>
            <Avatar />
          </Skeleton>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Skeleton width="60%">
            <Typography>.</Typography>
          </Skeleton>
        </Box>
      </Box>

      <Skeleton
        variant="rectangular"
        sx={{
          width: "100%",
          height: "100%",
          mt: 1
        }}
      />

    </Box>
  );
}

export default function SkeletonChildren() {
  return <SkeletonChildrenDemo />;
}