import React,{useEffect, useCallback} from 'react';
import { ModalProps } from './../types/types';

const PhotoViewer: React.FC<{ isOpen: boolean, onClose: () => void, children: React.ReactNode }> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
        <div className="bg-transparent rounded-lg shadow-lg w-[600px] h-[600px]">
          <div className="flex justify-end p-2">
            
          </div>
          <div className="w-full h-full">{children}</div>
        </div>
      </div>
    );
  };
  
  
export default PhotoViewer;