import React, { useState } from "react";
import PhotoViewer from "./../PhotoViewer";
import { ReactionButton, CommentButton, ShareButton } from "../Buttons";
import { sampleImgList } from "../../utils/samples";
import { GridPhoto } from "../../utils/types";

interface PhotoGalleryProps {
  photos: GridPhoto[]; // Array of GridPhoto objects
  lastPhotoRef: React.MutableRefObject<HTMLDivElement | null>;
}

const PhotoGallery = ({ photos, lastPhotoRef }: PhotoGalleryProps) => {
  // TODO:: get img details from an api

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgItem, setImgItem] = useState<GridPhoto | null>(null);

  const [likedIndexList, setLikedIndexList] = useState<string[]>([]); // Track the index of the liked button

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
  
  const likePhoto = (index: string) => {
    if (likedIndexList.includes(index)) {
      const tempList = likedIndexList.filter((ele) => ele != index);
      setLikedIndexList(tempList);
    } else {
      const tempList = likedIndexList.concat(index);
      setLikedIndexList(tempList);
    }
  };

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
                isLiked={likedIndexList.includes(item.id)}
                onToggle={() => likePhoto(item.id)}
                key={index}
              />
              {item.likeCount > 0 ? item.likeCount : null}
            </div>
            {/* <div className="...">
                            <CommentButton onClick={() => console.log("Hi")} key={index}/>
                        </div>
                        <div className="...">
                            <ShareButton onClick={() => console.log("Hi")} key={index}/>
                        </div> */}
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
