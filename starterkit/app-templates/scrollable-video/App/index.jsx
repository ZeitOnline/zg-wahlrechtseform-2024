import useIsSSR from 'core/hooks/useIsSSR';

import ScrollableStart from './ScrollableStart';
import VideoProgressor from './VideoProgressor';
import VideoTextStart from './VideoTextStart';

function App({display, ...props}) {
  const isSSR = useIsSSR();
  if (isSSR) return null;

  if (
    display === 'scrollable-video-start' ||
    display === 'scrollable-lottie-start'
  )
    return <ScrollableStart {...props} />;

  if (display === 'video-text-start') return <VideoTextStart {...props} />;

  if (display === 'video-progressor-setup')
    return <VideoProgressor {...props} />;

  return null;
}

export default App;
