import { Station } from './types';

// A curated list of reliable public streams
export const STATIONS: Station[] = [
  {
    id: 'lofi-hiphop',
    name: 'Lofi Girl Radio',
    streamUrl: 'https://play.streamafrica.net/lofiradio', 
    genre: 'Lofi',
    location: 'Global',
    imageUrl: 'https://picsum.photos/400/400?random=1',
    tags: ['chill', 'study', 'beats', 'relax']
  },
  {
    id: 'bbc-world-service',
    name: 'BBC World Service',
    streamUrl: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service',
    genre: 'News',
    location: 'London, UK',
    imageUrl: 'https://picsum.photos/400/400?random=2',
    tags: ['news', 'talk', 'global', 'politics']
  },
  {
    id: 'kexp',
    name: 'KEXP 90.3 FM',
    streamUrl: 'https://kexp.streamguys1.com/kexp128.mp3',
    genre: 'Alternative',
    location: 'Seattle, USA',
    imageUrl: 'https://picsum.photos/400/400?random=3',
    tags: ['indie', 'rock', 'eclectic', 'live']
  },
  {
    id: 'somafm-groovesalad',
    name: 'SomaFM Groove Salad',
    streamUrl: 'https://ice1.somafm.com/groovesalad-128-mp3',
    genre: 'Downtempo',
    location: 'San Francisco, USA',
    imageUrl: 'https://picsum.photos/400/400?random=4',
    tags: ['ambient', 'chillout', 'electronic']
  },
  {
    id: 'ibiza-global',
    name: 'Ibiza Global Radio',
    streamUrl: 'https://list.ibizaglobalradio.com/igr',
    genre: 'Electronic',
    location: 'Ibiza, Spain',
    imageUrl: 'https://picsum.photos/400/400?random=5',
    tags: ['house', 'techno', 'club', 'dance']
  },
  {
    id: 'classic-fm',
    name: 'Classic FM',
    streamUrl: 'https://media-the.musicradio.com/ClassicFM',
    genre: 'Classical',
    location: 'UK',
    imageUrl: 'https://picsum.photos/400/400?random=6',
    tags: ['classical', 'orchestra', 'relaxing']
  },
  {
    id: 'jazz24',
    name: 'Jazz24',
    streamUrl: 'https://live.wostreaming.net/direct/ppm-jazz24aac-ibc1',
    genre: 'Jazz',
    location: 'Tacoma, USA',
    imageUrl: 'https://picsum.photos/400/400?random=7',
    tags: ['jazz', 'blues', 'smooth']
  },
  {
    id: 'wqxr',
    name: 'WQXR 105.9 FM',
    streamUrl: 'https://stream.wqxr.org/wqxr',
    genre: 'Classical',
    location: 'New York, USA',
    imageUrl: 'https://picsum.photos/400/400?random=8',
    tags: ['classical', 'culture', 'public']
  },
  {
    id: 'dublab',
    name: 'Dublab',
    streamUrl: 'https://dublab.out.airtime.pro/dublab_a',
    genre: 'Experimental',
    location: 'Los Angeles, USA',
    imageUrl: 'https://picsum.photos/400/400?random=9',
    tags: ['experimental', 'electronic', 'indie']
  },
  {
    id: 'fip',
    name: 'FIP Radio',
    streamUrl: 'https://stream.radiofrance.fr/fip/fip_hifi.m3u8?id=radiofrance', 
    // Fallback if m3u8 fails, standard mp3 often works for FIP:
    // https://icecast.radiofrance.fr/fip-midfi.mp3
    genre: 'Eclectic',
    location: 'Paris, France',
    imageUrl: 'https://picsum.photos/400/400?random=10',
    tags: ['jazz', 'world', 'french', 'eclectic']
  },
   {
    id: 'smooth-chill',
    name: 'Smooth Chill',
    streamUrl: 'https://media-ssl.musicradio.com/SmoothChill',
    genre: 'Chill',
    location: 'London, UK',
    imageUrl: 'https://picsum.photos/400/400?random=11',
    tags: ['chill', 'ambient', 'relax']
  },
  {
    id: 'tokyo-fm',
    name: 'Shonan Beach FM',
    streamUrl: 'https://beachfm.out.airtime.pro/beachfm_a',
    genre: 'Jazz/Lounge',
    location: 'Japan',
    imageUrl: 'https://picsum.photos/400/400?random=12',
    tags: ['japanese', 'jazz', 'beach', 'lounge']
  }
];