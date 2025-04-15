Link to Live demo: https://sidproject-41.wl.r.appspot.com/
Vercel: https://client-six-blond.vercel.app/

Run Locally:

Backend: node server.js
Frontend:
npm install
npm uninstall react react-dom
npm install react@18.2.0 react-dom@18.2.0
npm uninstall @testing-library/react
npm install @testing-library/react@latest
npm install react-router-dom@6
npm start



  const context = canvas.getContext('2d');
  const blank = document.createElement('canvas');
  blank.width = canvas.width;
  blank.height = canvas.height;

  return canvas.toDataURL() === blank.toDataURL();
