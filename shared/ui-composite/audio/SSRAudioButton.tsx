'use client';
import dynamic from 'next/dynamic';
import { useAudioPreferences } from '@/features/Preferences';

// Speech and Audio APIs only exist in the browser, so skip server rendering.
const AudioButton = dynamic(() => import('./AudioButton'), { ssr: false });

interface SSRAudioButtonProps {
  text: string;
  clipSrcs?: string[] | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'icon-only';
  disabled?: boolean;
  onPlay?: () => void;
  onStop?: () => void;
  autoPlay?: boolean;
  autoPlayTrigger?: string | number;
}

const SSRAudioButton: React.FC<SSRAudioButtonProps> = props => {
  const { pronunciationEnabled } = useAudioPreferences();

  if (!pronunciationEnabled) {
    return null;
  }

  return <AudioButton {...props} />;
};

export default SSRAudioButton;
