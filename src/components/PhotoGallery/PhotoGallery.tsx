import React, { useState } from "react";
import PhotoViewer from './../PhotoViewer'
import { ReactionButton,CommentButton,ShareButton } from "../Buttons";

const PhotoGallery: React.FC = () => {
    
    // get img details from an api
    
    const colorList = ['red', 'blue', 'yellow', 'red', 'blue', 'yellow', 'red', 'blue', 'yellow', 'red', 'blue', 'yellow', 'red', 'blue', 'yellow', 'red', 'blue', 'yellow'];
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalColor, setModalColor] = useState(colorList[0]);
    const [likedIndexList, setLikedIndexList] = useState<number[]>([]); // Track the index of the liked button

  
    const openModal = (color: string) => {
        setIsModalOpen(true);
        setModalColor(color);
    };
    const closeModal = () => setIsModalOpen(false);
    const likePhoto = (index: number) => {
            if(likedIndexList.includes(index)){
                const tempList = likedIndexList.filter((ele)=> ele != index)
                setLikedIndexList(tempList)
            }else{
                const tempList = likedIndexList.concat(index);
                setLikedIndexList(tempList)

            }
        };

    // Helper function to get the correct background color class
    const getBackgroundColorClass = (color: string) => {
        switch (color) {
            case 'red':
                return 'bg-red-500';
            case 'blue':
                return 'bg-blue-500';
            case 'yellow':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };
  
    return (
        <div className="grid grid-cols-3 gap-4">
            {colorList.map((color, index) => (
                <div
                    key={index}
                    className="cursor-pointer w-[400px] h-[400px]"
                >
                    <div
                        className={`w-[400px] h-[350px] ${getBackgroundColorClass(color)} rounded-lg shadow-md`}
                        onClick={() => openModal(color)}
                    />
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-end-4 text-right">
                            <ReactionButton isLiked={likedIndexList.includes(index)} onToggle={() => likePhoto(index)} key={index}/>
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
                <div 
                    className={`w-full h-full ${getBackgroundColorClass(modalColor)} rounded-lg shadow-md`}
                />
            </PhotoViewer>
        </div>
    );
};

export default PhotoGallery;