import React, { useEffect, useState } from "react";
import PhotoViewer from "./../PhotoViewer";
import { ReactionButton, CommentButton, ShareButton } from "../Buttons";
import { GridPhoto, Photo } from "../../utils/types";
import { fetchLikedPhoto } from "../../redux/apiSlice";
import { useAppDispatch } from "../../redux/hooks";

interface PhotoGalleryProps {
  photos: GridPhoto[];
  lastPhotoRef: React.MutableRefObject<HTMLDivElement | null>;
}

const PhotoGallery = ({ photos, lastPhotoRef }: PhotoGalleryProps) => {
  const dispatch = useAppDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgItem, setImgItem] = useState<GridPhoto | null>(null);
  const [likeCount, setLikeCount] = useState<number | null>(null);

  const [likedIdList, setLikedIdList] = useState<string[]>(() => {
    const storedLikes = localStorage.getItem("likedPhotoIds");
    return storedLikes ? JSON.parse(storedLikes) : [];
  });

  const openModal = (item: GridPhoto) => {
    setIsModalOpen(true);
    setImgItem({
      id: item.id,
      fileName: item.fileName,
      url: item.url,
      prevUrl: item.prevUrl,
      likeCount: item.likeCount,
      description: item.description,
    });
  };
  const closeModal = () => setIsModalOpen(false);
  
  const likePhoto = (receivedId: string) => {
    let tempList: string[];
    if (likedIdList.includes(receivedId)) {
      tempList = likedIdList.filter((id) => id !== receivedId);
      dispatch(fetchLikedPhoto({id: parseInt(receivedId) , hasLiked: false}));
    } else {
      tempList = [...likedIdList, receivedId];
      dispatch(fetchLikedPhoto({id: parseInt(receivedId) , hasLiked: true}));
    }
    setLikedIdList(tempList);
    localStorage.setItem("likedPhotoIds", JSON.stringify(tempList));
  };

  useEffect(() => {
    localStorage.setItem("likedPhotoIds", JSON.stringify(likedIdList));
  }, [likedIdList]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-6 lg:px-8">
      {photos.map((item, index) => (
        <div  
          className="cursor-pointer w-full"
          key={index}
          ref={index === photos.length - 1 ? lastPhotoRef : null}
        >
          <div data-popover-target="popover-default" className="aspect-square w-full relative">
            <img
              className="w-full h-full rounded-lg shadow-md object-cover"
              src={item.prevUrl}
              alt=""
              onClick={() => openModal(item)}
            />
            <div className="absolute bottom-4 right-4">
              <ReactionButton
                isLiked={likedIdList.includes(item.id)}
                onToggle={() => likePhoto(item.id)}
                key={index}
              />
            </div>
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

      <div data-popover id="popover-default" role="tooltip" className="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
        <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Popover title</h3>
        </div>
        <div className="px-3 py-2">
            <p>And here's some amazing content. It's very engaging. Right?</p>
        </div>
        <div data-popper-arrow></div>
      </div>
    </div>
  );
};

export default PhotoGallery;