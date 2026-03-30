import { useState, useEffect } from 'react';
import type { Attachment } from '../../types/database.types';

interface AttachmentGalleryProps {
  attachments: Attachment[];
  initialIndex?: number;
  onClose: () => void;
}

export function AttachmentGallery({
  attachments,
  initialIndex = 0,
  onClose,
}: AttachmentGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  const imageAttachments = attachments.filter(att => att.type.startsWith('image/'));
  const currentImage = imageAttachments[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, imageAttachments.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : imageAttachments.length - 1));
    setIsZoomed(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < imageAttachments.length - 1 ? prev + 1 : 0));
    setIsZoomed(false);
  };

  if (!currentImage) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={() => !isZoomed && onClose()}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 px-6 py-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white text-sm font-medium">{currentImage.name}</span>
            <span className="text-white/60 text-xs">
              {currentIndex + 1} de {imageAttachments.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(!isZoomed);
              }}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title={isZoomed ? 'Reduzir zoom' : 'Ampliar'}
            >
              <i className={`text-lg ${isZoomed ? 'ri-zoom-out-line' : 'ri-zoom-in-line'}`}></i>
            </button>
            <a
              href={currentImage.url}
              download={currentImage.name}
              onClick={(e) => e.stopPropagation()}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Baixar imagem"
            >
              <i className="ri-download-2-line text-lg"></i>
            </a>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Fechar"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      {imageAttachments.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Anterior"
          >
            <i className="ri-arrow-left-s-line text-2xl"></i>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Próxima"
          >
            <i className="ri-arrow-right-s-line text-2xl"></i>
          </button>
        </>
      )}

      {/* Image */}
      <div
        className={`relative transition-all duration-300 ${
          isZoomed ? 'w-full h-full p-4 overflow-auto' : 'max-w-[90vw] max-h-[85vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImage.url}
          alt={currentImage.name}
          className={`${
            isZoomed ? 'w-auto h-auto cursor-move' : 'max-w-full max-h-full object-contain cursor-zoom-in'
          } rounded-lg`}
          onClick={() => !isZoomed && setIsZoomed(true)}
        />
      </div>

      {/* Thumbnails */}
      {imageAttachments.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex items-center justify-center gap-2 overflow-x-auto">
            {imageAttachments.map((img, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                  setIsZoomed(false);
                }}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  idx === currentIndex
                    ? 'border-teal-400 opacity-100'
                    : 'border-white/20 opacity-50 hover:opacity-75'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AttachmentGallery;
