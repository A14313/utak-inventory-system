import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';

import toCamelCase from 'src/utils/toCamelCase';

const BadgeRadio = forwardRef(function BadgeRadio(
	{ isActive, label, onChange, labelStyles, ...rest },
	ref,
) {
	const id = toCamelCase({ phrase: label }) + uuid(); // Generate the id once
	return (
		<div className="form-control">
			<input
				ref={ref}
				type="radio"
				id={id}
				value={el.DISPLAY_NAME}
				className="sr-only radio checked:bg-accent [&+label]:focus-visible:border-info [&+label]:focus-visible:border-dashed [&+label]:focus-visible:border-4"
				checked={el.DISPLAY_NAME === selectedSize}
			/>

			<label
				className={twMerge(
					'label cursor-pointer text-sm sm2:text-base text-center border border-solid dark:border-slate-800 rounded-full px-[.8em] py-[.2em] hover:bg-gray-500 dark:hover:bg-gray-300 hover:text-slate-50 dark:hover:text-slate-800 transition-colors duration-500',
					el.DISPLAY_NAME === selectedSize ? 'bg-accent  ' : '',
				)}
				htmlFor={id}>
				<span
					className={twMerge(
						'label-text',
						el.DISPLAY_NAME === selectedSize ? 'text-slate-50 dark:text-slate-800' : '',
					)}>
					{el.DISPLAY_NAME}
				</span>
			</label>
		</div>
	);
});

BadgeRadio.propTypes = {
	isActive: PropTypes.bool,
	label: PropTypes.string,
	labelStyles: PropTypes.string,
	onChange: PropTypes.func,
};

export default BadgeRadio;
