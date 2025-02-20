import React, { useEffect, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import PhotoViewer from "./../PhotoViewer";
import { ReactionButton } from "../Buttons";
import { GridPhoto } from "../../utils/types";
import { fetchLikedPhoto } from "../../redux/apiSlice";
import { useAppDispatch } from "../../redux/hooks";
import ChatBot from "../ChatBot/index";
import PhotoCard from "../PhotoCard/index";
import GalleryView from "../GalleryView/index";

interface PhotoGalleryProps {
  photos: GridPhoto[];
  allPhotos: GridPhoto[];
  lastPhotoRef: React.MutableRefObject<HTMLDivElement | null>;
}

const PhotoGallery = ({ photos, allPhotos, lastPhotoRef }: PhotoGalleryProps) => {

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
          key={index}
        />
      ))}

      <PhotoViewer isOpen={isModalOpen} onClose={closeModal}>
        <TransformWrapper
          initialScale={1}
          minScale={1}
          maxScale={4}
          centerOnInit
        >
          {({ zoomIn, zoomOut, resetTransform  }) => (
            <>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-[9999] bg-black/20 p-2 rounded-lg backdrop-blur-sm">
                <button
                  onClick={() => zoomIn()}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => zoomOut()}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => resetTransform()}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                  title="Reset Zoom"
                >
                  <Maximize2 className="w-5 h-5 text-white" />
                </button>
              </div>
              <TransformComponent
                wrapperStyle={{
                  cursor:"move"
                }}
              >
                <img
                  className="rounded-lg shadow-md max-w-[90vw] max-h-[90vh] md:max-w-[85vw] md:max-h-[85vh] lg:max-w-[80vw] lg:max-h-[80vh]"
                  src={imgItem?.url}
                  alt={imgItem?.fileName || ""}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </PhotoViewer>

      {/* <ChatBot /> */}
      <GalleryView photos={allPhotos} />
    </div>
  );
};

export default PhotoGallery;