if(!self.define){let e,s={};const a=(a,c)=>(a=new URL(a+".js",c).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(c,n)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let i={};const r=e=>a(e,t),d={module:{uri:t},exports:i,require:r};s[t]=Promise.all(c.map((e=>d[e]||r(e)))).then((e=>(n(...e),i)))}}define(["./workbox-6a1bf588"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/Skq4Dz1gVKgZ0HiI8-uSt/_buildManifest.js",revision:"25b15c107117d8408279fbda6c1735a0"},{url:"/_next/static/Skq4Dz1gVKgZ0HiI8-uSt/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/100-a0348a3cb55cbf5f.js",revision:"a0348a3cb55cbf5f"},{url:"/_next/static/chunks/218-542af2f1c3d6510b.js",revision:"542af2f1c3d6510b"},{url:"/_next/static/chunks/254-e6bcb457339c7635.js",revision:"e6bcb457339c7635"},{url:"/_next/static/chunks/291-9d6495a2d92a9a2d.js",revision:"9d6495a2d92a9a2d"},{url:"/_next/static/chunks/327-c40f984818ca079c.js",revision:"c40f984818ca079c"},{url:"/_next/static/chunks/357-84edf6097dc913b7.js",revision:"84edf6097dc913b7"},{url:"/_next/static/chunks/455-b1d483f906af7a9a.js",revision:"b1d483f906af7a9a"},{url:"/_next/static/chunks/484-9090f4672e9fab2a.js",revision:"9090f4672e9fab2a"},{url:"/_next/static/chunks/579-598464240663991d.js",revision:"598464240663991d"},{url:"/_next/static/chunks/618-5359f65149f976d1.js",revision:"5359f65149f976d1"},{url:"/_next/static/chunks/674a26a7-42d6ee42ed25d988.js",revision:"42d6ee42ed25d988"},{url:"/_next/static/chunks/69-7186ee1e67d62f70.js",revision:"7186ee1e67d62f70"},{url:"/_next/static/chunks/758-47b8d71f536fd1fb.js",revision:"47b8d71f536fd1fb"},{url:"/_next/static/chunks/75fc9c18-c7bf0df5a4fee36b.js",revision:"c7bf0df5a4fee36b"},{url:"/_next/static/chunks/8-487dbf4761c2eae5.js",revision:"487dbf4761c2eae5"},{url:"/_next/static/chunks/906a09f8-70c160a54f18851f.js",revision:"70c160a54f18851f"},{url:"/_next/static/chunks/942-b46f0991232be44d.js",revision:"b46f0991232be44d"},{url:"/_next/static/chunks/framework-0ba0ddd33199226d.js",revision:"0ba0ddd33199226d"},{url:"/_next/static/chunks/main-f65d58bc1ecd3aa1.js",revision:"f65d58bc1ecd3aa1"},{url:"/_next/static/chunks/pages/_app-57c2571865763346.js",revision:"57c2571865763346"},{url:"/_next/static/chunks/pages/_error-effe22be6ff34abe.js",revision:"effe22be6ff34abe"},{url:"/_next/static/chunks/pages/attendance-4b2542409502e9a0.js",revision:"4b2542409502e9a0"},{url:"/_next/static/chunks/pages/categories-59dbe3c9e0715de8.js",revision:"59dbe3c9e0715de8"},{url:"/_next/static/chunks/pages/employees-8cfbf0eada7cae43.js",revision:"8cfbf0eada7cae43"},{url:"/_next/static/chunks/pages/index-f9fa760164d92243.js",revision:"f9fa760164d92243"},{url:"/_next/static/chunks/pages/mark-attendance-76f9aca1cd676c12.js",revision:"76f9aca1cd676c12"},{url:"/_next/static/chunks/pages/product-update-0de2b1a674a2cde2.js",revision:"0de2b1a674a2cde2"},{url:"/_next/static/chunks/pages/products-e197ea3379b0f0c9.js",revision:"e197ea3379b0f0c9"},{url:"/_next/static/chunks/pages/products/abc-8e8748acbc17e825.js",revision:"8e8748acbc17e825"},{url:"/_next/static/chunks/pages/search-77bb90bff3f68958.js",revision:"77bb90bff3f68958"},{url:"/_next/static/chunks/pages/tasks-16697e6df9eeb693.js",revision:"16697e6df9eeb693"},{url:"/_next/static/chunks/pages/tasks/%5Btid%5D-ae03ddbf0103550a.js",revision:"ae03ddbf0103550a"},{url:"/_next/static/chunks/pages/tasks/abc-b3fe2c68b805b768.js",revision:"b3fe2c68b805b768"},{url:"/_next/static/chunks/pages/tasks/update/%5Btid%5D-20b73f43ecabbfe9.js",revision:"20b73f43ecabbfe9"},{url:"/_next/static/chunks/pages/worksheet-1394e5e67a06ae80.js",revision:"1394e5e67a06ae80"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-42cdea76c8170223.js",revision:"42cdea76c8170223"},{url:"/_next/static/css/1b1b7cd8d1a6f6a7.css",revision:"1b1b7cd8d1a6f6a7"},{url:"/_next/static/css/27d177a30947857b.css",revision:"27d177a30947857b"},{url:"/_next/static/css/f37c6fa9d5f868db.css",revision:"f37c6fa9d5f868db"},{url:"/_next/static/media/header-logo.9fd05b9a.png",revision:"3d92a76ec8bf655cd50214dc3777f8c4"},{url:"/favicon.ico",revision:"26dae3fa28aed5c5ac60428d20f3429b"},{url:"/icon-192x192.png",revision:"8a4a5cd0427090cafd03ce2be215fc2d"},{url:"/icon-256x256.png",revision:"015526ff9d0aad9750291502dc4952e0"},{url:"/icon-384x384.png",revision:"8a29c275858b4db4a5ea69b59149fbda"},{url:"/icon-512x512.png",revision:"08574b2bfec61948790a90af58902204"},{url:"/manifest.json",revision:"2344b555bb03c821f5125835aadd43f4"},{url:"/uploaded-tasks/1663844722509-plextone.pdf",revision:"ced40a41fd5c43c14ebd9c315707a45c"},{url:"/uploaded-tasks/1663916762211-Image-1.jpeg",revision:"e8be3e189c8d779a8b36ef64c4bbdbc3"},{url:"/vercel.svg",revision:"26bf2d0adaf1028a4d4c6ee77005e819"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:c})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
