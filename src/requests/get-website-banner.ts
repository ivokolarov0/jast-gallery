import { fetch } from '@tauri-apps/plugin-http';
import { getLocalToken } from '@utils/index';

// Hacky solution to get the top banner from the website
const getBannerSlides = async (): Promise<any> => {
  const token = await getLocalToken();

  let headers = new Headers({
    'content-type': "text/html",
  });

  if(token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  let response;

  try {
    response = await fetch('https://jastusa.com/', {
      headers
    });
  } catch (error) {
    console.error(error);
    return [];    
  }

  const data = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/html');
  const items: { href: string | null; img: string; srcset: string }[] = [];
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