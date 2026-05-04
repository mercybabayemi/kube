'use client'

import { X, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  onConfirm: () => void
  confirmLabel?: string
  cancelLabel?: string
  isDestructive?: boolean
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-all"
          >
            <X size={20} />
          </button>

          {/* Icon */}
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center mb-6",
            isDestructive ? "bg-red-50 text-red-500" : "bg-kube-primary/10 text-kube-primary"
          )}>
            <AlertCircle size={24} />
          </div>

          {/* Text */}
          <h3 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">
            {title}
          </h3>
          <p className="text-gray-500 font-medium leading-relaxed mb-8">
            {description}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-3.5 rounded-2xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all active:scale-95"
            >
              {cancelLabel}
            </button>
            <button 
              onClick={onConfirm}
              className={cn(
                "flex-1 px-6 py-3.5 rounded-2xl text-white font-bold transition-all active:scale-95 shadow-lg",
                isDestructive 
                  ? "bg-red-500 hover:bg-red-600 shadow-red-200" 
                  : "bg-kube-primary hover:bg-kube-primary-mid shadow-kube-primary/20"
              )}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
