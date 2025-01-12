import React, { useState, useEffect, useCallback } from "react";
import PhotoViewer from "../PhotoViewer/PhotoViewer";
import { description } from "../../utils/samples";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <header className="flex items-center p-6 justify-end">
      <div
        className="cursor-pointer text-5xl text-black font-kalam racking-wide"
        onClick={openModal}
      >
        SnappedLK
      </div>

      <PhotoViewer isOpen={isModalOpen} onClose={closeModal}>
        <div
          className="w-[600px] h-[600px] bg-white rounded-lg shadow-md text-3xl text-black font-kalam racking-wide flex items-center p-4"
          style={{
            maxWidth: "calc(100vw - 100px)",
            maxHeight: "calc(100vh - 100px)",
          }}
        >
            <div>
                <span className="block mb-1">Hi, I' Pulindu.</span>
                {description}
                <span className="block text-end mt-1">Cheers!</span>
            </div>
        </div>
      </PhotoViewer>
    </header>
  );
};

export default Header;
