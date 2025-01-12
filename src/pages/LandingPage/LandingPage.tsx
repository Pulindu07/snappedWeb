import React, { useState, useRef, useEffect, useCallback } from "react";
import PhotoGallery from "../../components/PhotoGallery/PhotoGallery";
import { useSelector } from "react-redux";
import { fetchPhotos } from "./../../redux/apiSlice";
import { RootState } from "./../../redux/store";
import { useAppDispatch } from "../../redux/hooks";

const LandingPage = () => {
  const dispatch = useAppDispatch();
  const { photos, loading, hasMore, currentPage } = useSelector(
    (state: RootState) => state.photos
  );
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPhotoRef = useRef<HTMLDivElement | null>(null);

  // Fetch the first page of photos when the component mounts
  useEffect(() => {
    if (!loading) {
      dispatch(fetchPhotos(1)); // Load first page only once
    }
  }, []);

  // Use IntersectionObserver to trigger loading next page when the last photo is in view
  useEffect(() => {
    // Ensure there's a valid last photo to observe
    if (loading || !hasMore || !lastPhotoRef.current) return;

    // Disconnect any previous observer
    if (observer.current) observer.current.disconnect();

    // Create a new IntersectionObserver
    observer.current = new IntersectionObserver(
      (entries) => {
        const lastEntry = entries[0];
        if (lastEntry.isIntersecting && hasMore) {
          dispatch(fetchPhotos(currentPage)); // Load next page when last photo is in view
        }
      },
      { threshold: 1.0 } // Trigger when the last photo is fully visible
    );

    // Observe the last photo element
    observer.current.observe(lastPhotoRef.current);

    // Cleanup the observer when the component unmounts
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loading, hasMore, currentPage, dispatch]);

  return <PhotoGallery photos={photos} lastPhotoRef={lastPhotoRef} />;
};

export default LandingPage;