import { useState } from 'react';
import type { Attachment } from '../../types/database.types';
import { AttachmentGallery } from './AttachmentGallery';

interface FilePreviewProps {
  attachment: Attachment;
  allAttachments?: Attachment[];
  isOwn?: boolean;
  showInline?: boolean;
}

const FILE_ICONS: Record<string, string> = {
  'image': 'ri-image-line',
  'application/pdf': 'ri-file-pdf-line',
  'application/msword': 'ri-file-word-line',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'ri-file-word-line',
  'application/vnd.ms-excel': 'ri-file-excel-line',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'ri-file-excel-line',
  'text': 'ri-file-text-line',
  'video': 'ri-video-line',
  'audio': 'ri-music-line',
  'default': 'ri-attachment-2',
};

function getFileIcon(type: string): string {
  if (type.startsWith('image/')) return FILE_ICONS['image'];
  if (type.startsWith('text/')) return FILE_ICONS['text'];
  if (type.startsWith('video/')) return FILE_ICONS['video'];
  if (type.startsWith('audio/')) return FILE_ICONS['audio'];
  return FILE_ICONS[type] || FILE_ICONS['default'];
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function FilePreview({
  attachment,
  allAttachments = [],
  isOwn = false,
  showInline = true,
}: FilePreviewProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  const isImage = attachment.type.startsWith('image/');
  const isPdf = attachment.type === 'application/pdf';
  const isVideo = attachment.type.startsWith('video/');
  const isAudio = attachment.type.startsWith('audio/');

  // Image preview with gallery
  if (isImage && showInline) {
    const imageAttachments = allAttachments.filter(att => att.type.startsWith('image/'));
    const currentIndex = imageAttachments.findIndex(att => att.url === attachment.url);

    return (
      <>
        <div className="cursor-pointer group" onClick={() => setShowGallery(true)}>
          <div className="relative rounded-lg overflow-hidden border border-white/20">
            <img
              src={attachment.url}
              alt={attachment.name}
              className="max-w-[280px] max-h-[200px] object-cover group-hover:opacity-90 transition-opacity"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="ri-zoom-in-line text-white text-lg"></i>
              </div>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 mt-1.5 text-[10px] ${isOwn ? 'text-white/70' : 'text-slate-500'}`}>
            <i className="ri-image-line"></i>
            <span className="truncate max-w-[200px]">{attachment.name}</span>
            <span>({formatFileSize(attachment.size)})</span>
          </div>
        </div>
        {showGallery && (
          <AttachmentGallery
            attachments={imageAttachments}
            initialIndex={currentIndex >= 0 ? currentIndex : 0}
            onClose={() => setShowGallery(false)}
          />
        )}
      </>
    );
  }

  // PDF preview with embed viewer
  if (isPdf && showInline) {
    return (
      <>
        <div className="space-y-2">
          <div
            className={`rounded-lg overflow-hidden border ${
              isOwn ? 'border-white/20' : 'border-slate-200'
            }`}
          >
            {showPdfViewer ? (
              <div className="relative w-full h-[400px]">
                <iframe
                  src={`${attachment.url}#toolbar=0`}
                  className="w-full h-full"
                  title={attachment.name}
                />
                <button
                  onClick={() => setShowPdfViewer(false)}
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-lg bg-black/50 hover:bg-black/70 text-white transition-colors cursor-pointer"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowPdfViewer(true)}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer ${
                  isOwn
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                  isOwn ? 'bg-white/10' : 'bg-slate-200'
                }`}>
                  <i className="ri-file-pdf-line text-xl text-rose-500"></i>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium truncate">{attachment.name}</p>
                  <p className={`text-xs ${isOwn ? 'text-white/60' : 'text-slate-500'}`}>
                    {formatFileSize(attachment.size)} • Clique para visualizar
                  </p>
                </div>
                <i className={`ri-eye-line ${isOwn ? 'text-white/60' : 'text-slate-400'}`}></i>
              </button>
            )}
          </div>
        </div>
      </>
    );
  }

  // Video player
  if (isVideo && showInline) {
    return (
      <div className="space-y-2">
        <div className={`rounded-lg overflow-hidden border ${
          isOwn ? 'border-white/20' : 'border-slate-200'
        }`}>
          <video
            controls
            className="w-full max-w-[400px] max-h-[300px]"
            preload="metadata"
          >
            <source src={attachment.url} type={attachment.type} />
            Seu navegador não suporta reprodução de vídeo.
          </video>
        </div>
        <div className={`flex items-center gap-1.5 text-[10px] ${isOwn ? 'text-white/70' : 'text-slate-500'}`}>
          <i className="ri-video-line"></i>
          <span className="truncate max-w-[200px]">{attachment.name}</span>
          <span>({formatFileSize(attachment.size)})</span>
        </div>
      </div>
    );
  }

  // Audio player
  if (isAudio && showInline) {
    return (
      <div className="space-y-2">
        <div className={`rounded-lg overflow-hidden border p-3 ${
          isOwn ? 'border-white/20 bg-white/5' : 'border-slate-200 bg-slate-50'
        }`}>
          <audio controls className="w-full max-w-[300px]">
            <source src={attachment.url} type={attachment.type} />
            Seu navegador não suporta reprodução de áudio.
          </audio>
        </div>
        <div className={`flex items-center gap-1.5 text-[10px] ${isOwn ? 'text-white/70' : 'text-slate-500'}`}>
          <i className="ri-music-line"></i>
          <span className="truncate max-w-[200px]">{attachment.name}</span>
          <span>({formatFileSize(attachment.size)})</span>
        </div>
      </div>
    );
  }

  // Default file display with download
  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      download={attachment.name}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
        isOwn
          ? 'bg-white/10 hover:bg-white/20 text-white'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
      }`}
    >
      <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${
        isOwn ? 'bg-white/10' : 'bg-slate-200'
      }`}>
        <i className={`${getFileIcon(attachment.type)} text-xl`}></i>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{attachment.name}</p>
        <p className={`text-xs ${isOwn ? 'text-white/60' : 'text-slate-500'}`}>
          {formatFileSize(attachment.size)}
        </p>
      </div>
      <i className={`ri-download-2-line ${isOwn ? 'text-white/60' : 'text-slate-400'}`}></i>
    </a>
  );
}

export default FilePreview;
