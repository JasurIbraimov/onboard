import { useEffect, type ReactNode } from "react";
import Button from "../Button/Button";
import { LuX } from "react-icons/lu";

interface IProps {
    children?: ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
}

const Modal = ({ children, isOpen, onClose }: IProps) => {
    useEffect(() => {
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "Escape" && onClose) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);
    return (
        <dialog className="modal" open={isOpen}>
            <div className="h-3/4 fixed overflow-y-scroll">
                <div className="modal-action mb-1 absolute -top-5 right-5 z-50">
                    <Button type="button" onClick={onClose} variant="error">
                        <LuX/>
                    </Button>
                </div>
                {children}
            </div>
        </dialog>
    );
};

export default Modal;
