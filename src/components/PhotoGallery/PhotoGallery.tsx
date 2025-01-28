import React, { useEffect, useState } from "react";
import PhotoViewer from "./../PhotoViewer";
import { ReactionButton } from "../Buttons";
import { GridPhoto } from "../../utils/types";
import { fetchLikedPhoto } from "../../redux/apiSlice";
import { useAppDispatch } from "../../redux/hooks";
import ChatBot from "../ChatBot/index";

interface PhotoGalleryProps {
  photos: GridPhoto[];
  lastPhotoRef: React.MutableRefObject<HTMLDivElement | null>;
}

const PhotoGallery = ({ photos, lastPhotoRef }: PhotoGalleryProps) => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgItem, setImgItem] = useState<GridPhoto | null>(null);
  const [likedIdList, setLikedIdList] = useState<string[]>(() => {
    const storedLikes = localStorage.getItem("likedPhotoIds");
    return storedLikes ? JSON.parse(storedLikes) : [];
  });

  const [activePopover, setActivePopover] = useState<string | null>(null);

  // Add state for tracking like counts
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  // Initialize like counts from props
  useEffect(() => {
    const initialCounts: Record<string, number> = {};
    photos.forEach(photo => {
      initialCounts[photo.id] = photo.likeCount;
    });
    setLikeCounts(initialCounts);
  }, [photos]);

  const openModal = (item: GridPhoto) => {
    setIsModalOpen(true);
    setImgItem(item);
  };

  const closeModal = () => setIsModalOpen(false);

  const likePhoto = async (receivedId: string) => {
    const isLiked = likedIdList.includes(receivedId);
    try {
      await dispatch(fetchLikedPhoto({ id: parseInt(receivedId), hasLiked: !isLiked }));

      // Update liked IDs list
      const updatedLikedIdList = isLiked
        ? likedIdList.filter((id) => id !== receivedId)
        : [...likedIdList, receivedId];
      setLikedIdList(updatedLikedIdList);

      // Update like count immediately
      setLikeCounts(prev => ({
        ...prev,
        [receivedId]: prev[receivedId] + (isLiked ? -1 : 1)
      }));

      localStorage.setItem("likedPhotoIds", JSON.stringify(updatedLikedIdList));
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("likedPhotoIds", JSON.stringify(likedIdList));
  }, [likedIdList]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-6 lg:px-8">
      {photos.map((item, index) => (
        <div
          className="cursor-pointer w-full"
          key={item.id}
          ref={index === photos.length - 1 ? lastPhotoRef : null}
          onMouseEnter={() => setActivePopover(item.id)}
          onMouseLeave={() => setActivePopover(null)}
        >
          <div className="aspect-square w-full relative">
            <img
              className="w-full h-full rounded-lg shadow-md object-cover"
              src={item.prevUrl}
              alt=""
              onClick={() => openModal(item)}
            />
            <div className="absolute bottom-4 right-4 flex items-center space-x-2">
              <ReactionButton
                isLiked={likedIdList.includes(item.id)}
                onToggle={() => likePhoto(item.id)}
              />
              {likeCounts[item.id] || null}
            </div>

            {activePopover === item.id && (
              <div
                id={`popover-${item.id}`}
                role="tooltip"
                className="absolute z-10 bottom-[-1] w-full text-sm text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
                  <h3 className="font-semibold text-gray-900">{item.fileName}</h3>
                </div>
                <div className="px-3 py-2">
                  <p>{item.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      <PhotoViewer isOpen={isModalOpen} onClose={closeModal}>
        <img
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md max-w-[90vw] max-h-[90vh] md:max-w-[85vw] md:max-h-[85vh] lg:max-w-[80vw] lg:max-h-[80vh]"
          src={imgItem?.url}
          alt=""
        />
      </PhotoViewer>

      <ChatBot />
    </div>
  );
};

export default PhotoGallery;