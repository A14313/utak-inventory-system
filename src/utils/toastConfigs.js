import { Zoom } from 'react-toastify';

// If you need to add parameters to this config, convert this to function :) -Anton Autor
const toastConfigs = {
	theme: window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark',
	transition: Zoom,
	newestOnTop: true,
	autoClose: 5000,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
};

export default toastConfigs;
