import { useState, useRef, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import type { Attachment } from '../../types/database.types';

interface FileUploadProps {
  onFilesChange: (files: Attachment[]) => void;
  files: Attachment[];
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  disabled?: boolean;
}

const DEFAULT_ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
  'video/mp4',
  'video/webm',
  'audio/mpeg',
  'audio/wav',
];

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

export function FileUpload({
  onFilesChange,
  files,
  maxFiles = 10,
  maxSizeMB = 10,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  disabled = false,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    setError(null);

    // Validate file count
    if (files.length + selectedFiles.length > maxFiles) {
      setError(`Máximo de ${maxFiles} arquivos permitidos`);
      return;
    }

    // Calculate total size
    const currentTotalSize = files.reduce((sum, f) => sum + f.size, 0);
    const newFilesSize = selectedFiles.reduce((sum, f) => sum + f.size, 0);
    const totalSize = currentTotalSize + newFilesSize;
    const maxTotalSize = 50 * 1024 * 1024; // 50MB total

    if (totalSize > maxTotalSize) {
      setError('Tamanho total dos arquivos excede 50MB');
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    for (const file of selectedFiles) {
      // Check size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Arquivo "${file.name}" excede o limite de ${maxSizeMB}MB`);
        continue;
      }

      // Check type
      if (!acceptedTypes.includes(file.type)) {
        setError(`Tipo de arquivo não permitido: ${file.name}`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      const uploadedFiles: Attachment[] = [];

      for (const file of validFiles) {
        const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const fileExt = file.name.split('.').pop();
        const filePath = `${fileId}.${fileExt}`;

        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from('ticket-attachments')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          setError(`Erro ao enviar "${file.name}": ${uploadError.message}`);
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[file.name];
            return newProgress;
          });
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('ticket-attachments')
          .getPublicUrl(data.path);

        uploadedFiles.push({
          name: file.name,
          url: urlData.publicUrl,
          size: file.size,
          type: file.type,
        });

        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
      }

      if (uploadedFiles.length > 0) {
        onFilesChange([...files, ...uploadedFiles]);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Erro ao fazer upload dos arquivos');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress({}), 1000);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [files, maxFiles, maxSizeMB, acceptedTypes, onFilesChange]);

  const removeFile = useCallback((index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  }, [files, onFilesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0 && fileInputRef.current) {
      const dt = new DataTransfer();
      droppedFiles.forEach(file => dt.items.add(file));
      fileInputRef.current.files = dt.files;
      fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, [disabled, isUploading]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  }, [disabled, isUploading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Calculate total size
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(1);

  return (
    <div className="space-y-3">
      {/* Upload area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-xl transition-all ${
          disabled || isUploading
            ? 'border-slate-200 bg-slate-50 cursor-not-allowed'
            : isDragging
            ? 'border-teal-500 bg-teal-50 scale-[1.02]'
            : 'border-slate-300 hover:border-teal-400 hover:bg-teal-50/30 cursor-pointer'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="flex flex-col items-center justify-center gap-2 px-6 py-6">
          {isUploading ? (
            <>
              <i className="ri-loader-4-line animate-spin text-teal-500 text-3xl"></i>
              <span className="text-sm font-medium text-teal-600">Enviando arquivos...</span>
            </>
          ) : isDragging ? (
            <>
              <i className="ri-upload-cloud-2-line text-teal-500 text-3xl"></i>
              <span className="text-sm font-medium text-teal-600">Solte os arquivos aqui</span>
            </>
          ) : (
            <>
              <i className="ri-upload-cloud-line text-slate-400 text-3xl"></i>
              <div className="text-center">
                <span className="text-sm font-medium text-slate-700">
                  Clique para selecionar ou arraste arquivos
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Máximo de {maxFiles} arquivos • Até {maxSizeMB}MB cada • Total máximo: 50MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg">
          <i className="ri-error-warning-line text-rose-500"></i>
          <span className="text-xs text-rose-600">{error}</span>
        </div>
      )}

      {/* Upload progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2 px-1">
          {Object.entries(uploadProgress).map(([name, progress]) => (
            <div key={name} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 truncate max-w-[200px]">{name}</span>
                <span className="text-xs text-slate-500">{progress}%</span>
              </div>
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium text-slate-600">
              {files.length} arquivo{files.length > 1 ? 's' : ''} anexado{files.length > 1 ? 's' : ''}
            </span>
            <span className="text-xs text-slate-500">
              Total: {totalSizeMB} MB / 50 MB
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {files.map((file, index) => {
              const isImage = file.type.startsWith('image/');
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors group"
                >
                  {isImage ? (
                    <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200">
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-slate-200">
                      <i className={`${getFileIcon(file.type)} text-slate-600 text-xl`}></i>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 font-medium truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    disabled={disabled || isUploading}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <i className="ri-close-line text-lg"></i>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
