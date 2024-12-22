import DOMPurify from 'dompurify';

import { Product } from '@requests/get-game';

const GameVideo = ({ data }: { data: Product }) => {
  const video: any = data?.attributes?.find(
    (attr: any) => attr.code === 'video_html',
  );
  const videoSanitize = DOMPurify.sanitize(video?.value, {ALLOWED_TAGS: ['iframe']});

  if(!video) {
    return null
  }

  return <div className="video-target" dangerouslySetInnerHTML={{__html: videoSanitize}}></div>
}

export default GameVideo