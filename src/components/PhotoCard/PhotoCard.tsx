import React, { useEffect, useState } from "react";
import { GridPhoto } from "../../utils/types";
import { ReactionButton } from "../Buttons";
import { fetchLikedPhoto } from "../../redux/apiSlice";
import { useAppDispatch } from "../../redux/hooks";


interface PhotoCardProps {
  photos: GridPhoto[];
  lastPhotoRef: React.MutableRefObject<HTMLDivElement | null>;
  item: GridPhoto;
  index:number;
  setIsModalOpen:(e:boolean)=>void;
  setImgItem:(e:GridPhoto)=>void;
}

const PhotoCard:React.FC<PhotoCardProps> =({photos,lastPhotoRef, item, index, setIsModalOpen, setImgItem})=>{

    const dispatch = useAppDispatch();
    const [likedIdList, setLikedIdList] = useState<string[]>(() => {
            const storedLikes = localStorage.getItem("likedPhotoIds");
            return storedLikes ? JSON.parse(storedLikes) : [];
        });
    const [activePopover, setActivePopover] = useState<string | null>(null);
    
    const openModal = (item: GridPhoto) => {
        setIsModalOpen(true);
        setImgItem(item);
      };
    const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
    

    useEffect(() => {
        const initialCounts: Record<string, number> = {};
        photos.forEach(photo => {
          initialCounts[photo.id] = photo.likeCount;
        });
        setLikeCounts(initialCounts);
      }, [photos]);

       const likePhoto = async (receivedId: string) => {
          const isLiked = likedIdList.includes(receivedId);
          try {
            dispatch(fetchLikedPhoto({ id: parseInt(receivedId), hasLiked: !isLiked }));
      
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
    );
}

export default PhotoCard;