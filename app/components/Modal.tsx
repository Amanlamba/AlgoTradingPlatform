// components/Modal.tsx
"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface ModalProps {
    isOpen: boolean;
    heading: string;
    onClose: () => void;
    children: ReactNode;
}

const Modal = ({ isOpen, onClose, heading, children }: ModalProps) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-lg mx-4 md:mx-auto p-6 rounded-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                <h2 className="text-2xl font-semibold mb-4">{heading}</h2>
                {children}
            </div>
        </div>
    );
};

export default Modal;
