import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';

import toCamelCase from 'src/utils/toCamelCase';

const BadgeRadio = forwardRef(function BadgeRadio(
	{ isActive, label, labelStyles, inputStyles, ...rest },
	ref,
) {
	const id = toCamelCase({ phrase: label }) + uuid(); // Generate the id once
	return (
		<div className="form-control">
			<input
				ref={ref}
				type="radio"
				id={id}
				className={twMerge(
					'sr-only radio checked:bg-accent [&+label]:focus-visible:border-info [&+label]:focus-visible:border-dashed [&+label]:focus-visible:border-4',
					inputStyles,
				)}
				checked={isActive}
				{...rest}
			/>

			<label
				className={twMerge(
					'label cursor-pointer border border-solid dark:border-slate-800 rounded-full px-[.8em] py-[.2em] hover:bg-gray-500 dark:hover:bg-gray-300 hover:text-slate-50 dark:hover:text-slate-800 transition-colors duration-500',
					isActive ? 'bg-accent  ' : '',
					labelStyles,
				)}
				htmlFor={id}>
				<span
					className={twMerge(
						'label-text text-sm sm2:text-base text-center',
						isActive ? 'text-slate-50 dark:text-slate-800' : '',
					)}>
					{label}
				</span>
			</label>
		</div>
	);
});

BadgeRadio.propTypes = {
	isActive: PropTypes.bool,
	label: PropTypes.string,
	labelStyles: PropTypes.string,
	inputStyles: PropTypes.string,
};

export default BadgeRadio;
