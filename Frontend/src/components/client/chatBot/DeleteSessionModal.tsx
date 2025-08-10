import React from "react";
import { Button } from "@/components/ui/button";

interface DeleteSessionModalProps {
  isOpen: boolean;
  x: number;
  y: number;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteSessionModal: React.FC<DeleteSessionModalProps> = ({
  isOpen,
  x,
  y,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="absolute bg-slate-900 border border-slate-800 rounded-lg shadow-lg w-64 p-4"
        style={{
          top: y,
          left: x,
        }}
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        <h2 className="text-base font-semibold text-white mb-2">
          Delete Chat Session
        </h2>
        <p className="text-slate-400 text-sm mb-4">
          Are you sure you want to delete this chat session?
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="border-slate-700 text-black hover:bg-slate-800"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSessionModal;
