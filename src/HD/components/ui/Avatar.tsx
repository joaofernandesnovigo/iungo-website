
import { cn, getInitials } from '../../lib/utils';

// ============================================
// TYPES
// ============================================

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: AvatarSize;
  className?: string;
  showStatus?: boolean;
  isOnline?: boolean;
}

// ============================================
// STYLES
// ============================================

const sizeStyles: Record<AvatarSize, { container: string; text: string; status: string }> = {
  xs: { container: 'w-6 h-6', text: 'text-[10px]', status: 'w-2 h-2' },
  sm: { container: 'w-8 h-8', text: 'text-xs', status: 'w-2.5 h-2.5' },
  md: { container: 'w-10 h-10', text: 'text-sm', status: 'w-3 h-3' },
  lg: { container: 'w-12 h-12', text: 'text-base', status: 'w-3.5 h-3.5' },
  xl: { container: 'w-16 h-16', text: 'text-lg', status: 'w-4 h-4' },
};

const colorPalette = [
  'bg-rose-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-sky-500',
  'bg-violet-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-indigo-500',
];

// ============================================
// COMPONENT
// ============================================

export function Avatar({
  src,
  name,
  size = 'md',
  className,
  showStatus = false,
  isOnline = false,
}: AvatarProps) {
  const styles = sizeStyles[size];
  
  // Validação: garantir que name não seja undefined ou vazio
  const safeName = name || 'User';
  const initials = getInitials(safeName);

  // Generate a consistent background colour based on the name
  const colorIndex =
    safeName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colorPalette.length;
  const bgColor = colorPalette[colorIndex];

  // Basic error handling for image loading failures
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    // Fallback to initials if the image cannot be loaded
    target.style.display = 'none';
  };

  return (
    <div className={cn('relative inline-flex', className)}>
      {src ? (
        <img
          src={src}
          alt={safeName}
          onError={handleImgError}
          className={cn('rounded-full object-cover', styles.container)}
        />
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center text-white font-medium',
            styles.container,
            styles.text,
            bgColor,
          )}
        >
          {initials}
        </div>
      )}
      {showStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white',
            styles.status,
            isOnline ? 'bg-emerald-500' : 'bg-slate-400',
          )}
        />
      )}
    </div>
  );
}

export default Avatar;
