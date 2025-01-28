import React, { useEffect, useState } from "react";
import PhotoViewer from "./../PhotoViewer";
import { ReactionButton } from "../Buttons";
import { GridPhoto } from "../../utils/types";
import { fetchLikedPhoto } from "../../redux/apiSlice";
import { useAppDispatch } from "../../redux/hooks";
import ChatBot from "../ChatBot/index";
import PhotoCard from "../PhotoCard/index";

interface PhotoGalleryProps {
  photos: GridPhoto[];
  lastPhotoRef: React.MutableRefObject<HTMLDivElement | null>;
}

const PhotoGallery = ({ photos, lastPhotoRef }: PhotoGalleryProps) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgItem, setImgItem] = useState<GridPhoto | null>(null);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-6 lg:px-8">
      {photos.map((item, index) => (
        <PhotoCard 
          photos={photos} 
          lastPhotoRef={lastPhotoRef} 
          item={item} 
          index={index} 
          setIsModalOpen={setIsModalOpen}
          setImgItem={setImgItem} 
        />
      ))}

      <PhotoViewer isOpen={isModalOpen} onClose={closeModal}>
        <img
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md max-w-[90vw] max-h-[90vh] md:max-w-[85vw] md:max-h-[85vh] lg:max-w-[80vw] lg:max-h-[80vh]"
          src={imgItem?.url}
          alt=""
        />
      </PhotoViewer>

      {/* <ChatBot /> */}
    </div>
  );
};

export default PhotoGallery;