import React, { useState, useRef, useEffect, useCallback } from "react";
import PhotoGallery from "../../components/PhotoGallery/PhotoGallery";
import { useSelector } from "react-redux";
import { fetchPhotos } from "./../../redux/apiSlice";
import { RootState } from "./../../redux/store";
import { useAppDispatch } from "../../redux/hooks";
import { MINIMUM_PAGES } from "../../utils/conts";
import { fetchAllThePhotos } from "./../../redux/allPhotoSlice";

const LandingPage = () => {
  const dispatch = useAppDispatch();
  const { photos, loading, hasMore, currentPage, totalPages } = useSelector(
    (state: RootState) => state.photos
  );
  const { allPhotos, allLoading, allHasMore, allCurrentPage, allTotalPages } = useSelector(
    (state: RootState) => state.allPhotos
  );
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPhotoRef = useRef<HTMLDivElement | null>(null);

  const [pageOrder, setPageOrder] = useState<number[]>([Math.floor(Math.random() * MINIMUM_PAGES) + 1]);
  const [pageShuffled, setPageShuffled]= useState(false);

  function updateListWithRandomOrder(pageOrder: number[], totalPages: number) {
    // If already shuffled, return existing order
    if (pageShuffled) {
        return pageOrder;
    }
    
    // Get the first number if pageOrder is not empty
    const currentNumber = pageOrder.length > 0 ? pageOrder[0] : 1;
    const lastElement = totalPages;

    // Create array from 1 to totalPages
    const numbersToAdd = Array.from({ length: totalPages }, (_, index) => index + 1)
        .filter(num => num !== currentNumber && num !== lastElement);

    // Fisher-Yates Shuffle
    for (let i = numbersToAdd.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [numbersToAdd[i], numbersToAdd[randomIndex]] = [numbersToAdd[randomIndex], numbersToAdd[i]];
    }

    // Create the final order: shuffled numbers, last element
    const newOrder = [...numbersToAdd, lastElement];
    
    // Update state
    setPageShuffled(true);
    setPageOrder(newOrder);
    return newOrder;
} 

  // Fetch the first page of photos when the component mounts
  useEffect(() => {
    if (!loading) {
      dispatch(fetchPhotos(pageOrder[0])); // Load first page only once
      dispatch(fetchAllThePhotos(1)); // Load first page only once
    }
  }, []);
  useEffect(()=>{
    if(totalPages > 1){
      updateListWithRandomOrder(pageOrder, totalPages);
    }
  },[totalPages]);

  // Use IntersectionObserver to trigger loading next page when the last photo is in view
  useEffect(() => {
    // Ensure there's a valid last photo to observe
    if (loading || pageOrder.length===0 || !lastPhotoRef.current) return;

    // Disconnect any previous observer
    if (observer.current) observer.current.disconnect();

    // Create a new IntersectionObserver
    observer.current = new IntersectionObserver(
      (entries) => {
        const lastEntry = entries[0];
        if (lastEntry.isIntersecting && pageOrder[0] && totalPages>1) {
          dispatch(fetchPhotos(pageOrder[0])); // Load next page when last photo is in view
          pageOrder.shift();
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
  }, [loading, pageOrder, currentPage, dispatch]);

  return <PhotoGallery photos={photos} allPhotos={allPhotos} lastPhotoRef={lastPhotoRef} />;
};

export default LandingPage;