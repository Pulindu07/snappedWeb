import React from 'react';
import { ModalProps } from './../types/types';

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
          <div className="flex justify-end p-2">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              ✕
            </button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    );
  };
  
  export default Modal;