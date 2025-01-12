import React, {useState,useRef, useEffect} from "react";
import PhotoGallery from "../../components/PhotoGallery/PhotoGallery";
import { useSelector } from 'react-redux';
import { fetchPhotos } from './../../redux/apiSlice';
import { RootState } from './../../redux/store';
import { useAppDispatch } from "../../redux/hooks";

const LandingPage = ()=>{
    const dispatch = useAppDispatch();
    const { photos, loading, hasMore, currentPage } = useSelector((state: RootState) => state.photos);
    const observer = useRef<IntersectionObserver | null>(null);
    const lastPhotoRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Fetch the first page of photos when the component mounts
        dispatch(fetchPhotos(1));
      }, [dispatch]);


  useEffect(() => {
    // Create an IntersectionObserver to observe the last photo
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(fetchPhotos(currentPage)); // Fetch next page when the last photo is in view
        }
      },
      { threshold: 1.0 }
    );

    if (lastPhotoRef.current) observer.current.observe(lastPhotoRef.current);
  }, [loading, hasMore, currentPage, dispatch]);

    return(
        <PhotoGallery photos = {photos}/>
    )
}

export default LandingPage;