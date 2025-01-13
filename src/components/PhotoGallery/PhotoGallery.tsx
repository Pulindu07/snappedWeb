import React, { useEffect, useState } from "react";
import PhotoViewer from "./../PhotoViewer";
import { ReactionButton, CommentButton, ShareButton } from "../Buttons";
import { GridPhoto, Photo } from "../../utils/types";
import { fetchLikedPhoto } from "../../redux/apiSlice";
import { useAppDispatch } from "../../redux/hooks";

interface PhotoGalleryProps {
  photos: GridPhoto[]; // Array of GridPhoto objects
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
    <div className="grid grid-cols-3 gap-4">
      {photos.map((item, index) => (
        <div  
          className="cursor-pointer w-[400px] h-[370px]"
          key={index}
          ref={index === photos.length - 1 ? lastPhotoRef : null} // Set ref to the last photo
        >
          <img
            className="w-[400px] h-[350px] rounded-lg shadow-md object-cover"
            src={item.prevUrl}
            alt=""
            onClick={() => openModal(item)}
          />
          <div className="grid grid-cols-3 gap-4">
            <div className="col-end-4 text-right">
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
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md"
          src={imgItem?.url}
          alt=""
          style={{
            maxWidth: "calc(100vw - 100px)",
            maxHeight: "calc(100vh - 100px)",
          }}
        />
      </PhotoViewer>
    </div>
  );
};

export default PhotoGallery;
