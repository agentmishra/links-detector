/// <reference lib="webworker" />

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim, skipWaiting } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

import { CACHE_PREFIX, CACHE_VERSION } from './configs/pwa';
import { daysToSeconds } from './utils/numbers';

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
// eslint-disable-next-line no-undef
declare const self: ServiceWorkerGlobalScope;

// @ts-ignore
// eslint-disable-next-line max-len
// eslint-disable-next-line no-restricted-globals, no-underscore-dangle, @typescript-eslint/no-unused-vars
const ignored = self.__WB_MANIFEST;

const getCacheName = (name: string): string => {
  return `${CACHE_PREFIX}--v${CACHE_VERSION}--${name}`;
};

skipWaiting();
clientsClaim();

// @see: https://developer.mozilla.org/en-US/docs/Web/API/Request
// @see: https://developer.mozilla.org/en-US/docs/Web/API/RequestDestination

registerRoute(
  (route) => {
    console.log('++++ YO', route);

    // Assets by type.
    // eslint-disable-next-line no-undef
    const assetTypes: RequestDestination[] = [
      'image',
      'style',
      'script',
      'worker',
    ];
    if (assetTypes.includes(route.request.destination)) {
      return true;
    }

    // Assets by extension.
    const assetExtensions: string[] = [
      '.json', // i.e. TensorFlow model summary.
      '.bin', // i.e. TensorFlow model data.
      '.gz', // i.e. Tesseract training data.
    ];
    for (let extIndex = 0; extIndex < assetExtensions.length; extIndex += 1) {
      const extension: string = assetExtensions[extIndex];
      if (route.url.href.endsWith(extension)) {
        return true;
      }
    }

    // Assets by origin.
    const assetOrigins: string[] = [
      'https://fonts.googleapis.com', // i.e. Google Fonts stylesheets.
      'https://fonts.gstatic.com', // i.e. Google Font font files.
    ];
    for (let originIndex = 0; originIndex < assetOrigins.length; originIndex += 1) {
      const origin: string = originIndex[originIndex];
      if (route.url.origin === origin) {
        return true;
      }
    }

    return false;
  },
  new StaleWhileRevalidate({
    cacheName: getCacheName('assets'),
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: daysToSeconds(30),
      }),
      new CacheableResponsePlugin({ statuses: [200] }),
    ],
  }),
);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
// const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
// registerRoute(
//   // Return false to exempt requests from being fulfilled by index.html.
//   ({ request, url }: { request: Request; url: URL }) => {
//     // If this isn't a navigation, skip.
//     if (request.mode !== 'navigate') {
//       return false;
//     }
//
//     // If this is a URL that starts with /_, skip.
//     if (url.pathname.startsWith('/_')) {
//       return false;
//     }
//
//     // If this looks like a URL for a resource, because it contains
//     // a file extension, skip.
//     if (url.pathname.match(fileExtensionRegexp)) {
//       return false;
//     }
//
//     // Return true to signal that we want to use the handler.
//     return true;
//   },
//   createHandlerBoundToURL(`${process.env.PUBLIC_URL}/index.html`),
// );
