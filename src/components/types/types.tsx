export interface ReactionButtonProps{
    isLiked: boolean;
    onToggle: () => void;
}

export interface SendButtonProps{
  handleSendMessage: () => void;
  loading: boolean;
}
export interface CloseButtonProps{
  handleCloseChat: () => void;
}

export interface CommentButtonProps extends ButtonProps {
    
}
export interface ShareButtonProps extends ButtonProps {
    
}

export interface ButtonProps{
    onClick: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}