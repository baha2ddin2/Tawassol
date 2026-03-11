"use client";

import React, { useState, useCallback } from "react";
import StyledUploader from "@/components/dropZone";
import { TextField, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "@/redux/Slices/postSlice";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const dispatch = useDispatch?.() || (() => {});
  const [content, setContent] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [images, setImages] = useState([]);

  const router = useRouter();
  const errors = useSelector((state) => state.post.error);

  const onFiles = useCallback((files) => {
    setImages(files);
  }, []);

  async function handleSubmit(e) {
    if (!content.trim() && images.length === 0 && !externalLink.trim()) {
      alert("Add content, images, or an external link.");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    formData.append("external_link", externalLink);
    images.forEach((img, index) => {
      console.log(img);
      return formData.append(`media[${index}]`, img);
    });
    const results = await dispatch(createPost(formData));

    if (createPost.fulfilled.match(results)) router.back();
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>

      <div className="space-y-4">
        <div>
          <TextField
            label="Content"
            multiline
            minRows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            placeholder="Write something..."
          />
          {errors?.errors?.content && (
            <p className=" text-red-500">{errors.errors.content[0]}</p>
          )}
        </div>

        <div>
          <TextField
            label="External link (optional)"
            value={externalLink}
            onChange={(e) => setExternalLink(e.target.value)}
            fullWidth
            placeholder="https://"
          />
          {errors?.errors?.external_link && (
            <p className=" text-red-500">{errors?.errors?.external_link[0]}</p>
          )}
        </div>

        <div>
          <StyledUploader onFiles={onFiles} maxFiles={5} />
          {errors?.errors?.media && (
            <p className=" text-red-500">{errors?.errors?.media / (0.0)[0]}</p>
          )}
        </div>

        {images.length > 0 && (
          <div className="text-sm text-gray-600">
            {images.length} image(s) selected
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleSubmit} variant="contained">
            Publish
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setContent("");
              setExternalLink("");
              setImages([]);
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
