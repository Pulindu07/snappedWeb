import React, { useState } from "react";
import PhotoViewer from "../PhotoViewer/PhotoViewer";
import { description } from "../../utils/samples";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <header className="flex items-center p-4 md:p-6 justify-end">
      <div
        className="cursor-pointer text-3xl md:text-4xl lg:text-5xl text-black font-kalam tracking-wide"
        onClick={openModal}
      >
        SnappedLK
      </div>

      <PhotoViewer isOpen={isModalOpen} onClose={closeModal}>
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] md:w-[70vw] lg:w-[600px] h-auto bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="text-xl md:text-2xl lg:text-3xl text-black font-kalam tracking-wide">
            <span className="block mb-2 md:mb-3">Hi, I'm Pulindu.</span>
            <div className="text-lg md:text-xl lg:text-2xl">
              {description}
            </div>
            <span className="block text-end mt-2 md:mt-3">Cheers!</span>
          </div>
        </div>
      </PhotoViewer>
    </header>
  );
};

export default Header;