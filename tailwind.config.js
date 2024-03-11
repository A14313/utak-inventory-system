/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		screens: {
			xsm: '320px',
			sm1: '375px',
			sm2: '576px',
			med: '768px',
			lrg: '992px',
			xl: '1200px',
			'2xl': '1400px',
		},
		extend: {
			container: {
				center: true,
				padding: {
					DEFAULT: '.5em',
					sm1: '1em',
				},
			},
		},
	},
	daisyui: {
		themes: [
			{
				light: {
					...require('daisyui/src/theming/themes')['light'],
					primary: '#92C7CF',
					secondary: '#FBF9F1',
					accent: '#AAD7D9',
					neutral: '#92C7CF',
					success: '#22c55e',
					error: '#f43f5e',
				},
			},
			{
				dark: {
					...require('daisyui/src/theming/themes')['dim'],
					primary: '#92C7CF',
					secondary: '#FBF9F1',
					accent: '#AAD7D9',
					// neutral: '#AAD7D9',
					success: '#22c55e',
					error: '#f43f5e',
				},
			},
		],
	},
	plugins: [require('daisyui')],
};
