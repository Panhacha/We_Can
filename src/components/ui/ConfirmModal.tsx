import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-[#16161a] border border-white/10 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm mb-6">{message}</p>
          
          <div className="flex w-full gap-3">
            <button 
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-xl font-medium text-sm text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onCancel();
              }}
              className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 border border-red-500/50"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
