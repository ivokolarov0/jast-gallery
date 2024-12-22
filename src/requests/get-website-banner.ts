import { fetch } from '@tauri-apps/plugin-http';

type Slide = {
  href: string | null,
  img: string,
  srcset: string
}

// Hacky solution to get the top banner from the website
const getBannerSlides = async (): Promise<Slide[]> => {
  let response;

  try {
    response = await fetch('https://jastusa.com/', {
      headers: {
        'content-type': "text/html",
      }
    });
  } catch (error) {
    console.error(error);
    return [];    
  }

  const data = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/html');
  const items: Slide[] = [];
  const slides = doc.querySelectorAll('.site-banners a.swiper-slide');

  if(!slides.length) {
    return [];
  }

  slides.forEach(element => {
    const img = element.querySelector('img');
    items.push({
      href: element.getAttribute('href'),
      img: img?.getAttribute('src') || '',
      srcset: img?.getAttribute('data-src') || '',
    });
  });

  return items || [];
}

export default getBannerSlides;