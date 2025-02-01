import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { HomeButton } from "../Buttons";

const WallArtSection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const imgSrc = location.state?.imgSrc;
  const [selectedTemplate, setSelectedTemplate] = useState("single");
  const [imageOrientation, setImageOrientation] = useState("portrait");

  useEffect(() => {
    if (imgSrc) {
      const img = new Image();
      img.src = imgSrc.photoUrl;
      img.onload = () => {
        setImageOrientation(img.width > img.height ? "landscape" : "portrait");
      };
    }
  }, [imgSrc]);

  const pageTurnVariants = {
    hidden: {
      rotateY: -90,
      scale: 1,
      opacity: 0,
      transformOrigin: "right center",
    },
    visible: {
      rotateY: 0,
      scale: 1,
      opacity: 1,
      transformOrigin: "right center",
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      rotateY: 90,
      scale: 1,
      opacity: 0,
      transformOrigin: "right center",
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const handleClose = () => {
    navigate("/");
  };

  const renderSinglePiece = () => (
    <div className="relative bg-white p-8">
      <img
        className="shadow-lg max-w-full max-h-[70vh] object-contain"
        src={imgSrc.photoUrl}
        alt="Photo"
      />
    </div>
  );

  const renderThreePiece = () => (
    <div className="w-full max-w-5xl flex gap-[2%] p-8">
      <div
        className="relative bg-white p-8 w-full h-[70vh] max-w-5xl"
        style={{
          backgroundImage: `url(${imgSrc.photoUrl})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "0% 100%",
        }}
      >
        {[32, 66].map((position, index) => (
          <div
            key={index}
            className="w-[2%] h-[70vh] absolute bg-white"
            style={{
              left: `${position}%`,
              top: 0,
            }}
          ></div>
        ))}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        className="flex-grow bg-gray-100 z-50 flex text-xl"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageTurnVariants}
      >
        <div className="flex w-full h-full">
          {/* Main Preview Area with Templates */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
            {imgSrc &&
              (selectedTemplate === "single"
                ? renderSinglePiece()
                : renderThreePiece())}
            {/* Template Selection moved below the image */}
            <div className="flex gap-8">
              {/* Single Piece Template Preview */}
              <div
                onClick={() => setSelectedTemplate("single")}
                className={`w-40 h-24 cursor-pointer rounded-lg ${
                  selectedTemplate === "single"
                    ? "ring-2 ring-blue-500 p-1"
                    : ""
                }`}
              >
                <div className="w-full h-full border-2 border-gray-400 rounded-lg"></div>
              </div>
              {imageOrientation === "landscape" && (
                <div
                  onClick={() => setSelectedTemplate("three-piece")}
                  className={`w-40 h-24 cursor-pointer flex gap-[2%] ${
                    selectedTemplate === "three-piece"
                      ? "ring-2 ring-blue-500 p-1"
                      : ""
                  }`}
                >
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      className="w-[32%] border-2 border-gray-400 rounded"
                    ></div>
                  ))}
                </div>
              )}
              <HomeButton handleGoHome={handleClose} />
            </div>
          </div>
          <div className="absolute bottom-4 right-4">
            
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WallArtSection;
