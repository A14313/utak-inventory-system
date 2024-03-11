import { twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';

import toCamelCase from 'src/utils/toCamelCase';

function Badge({ isActive, label, onChange, labelStyles }) {
	const id = toCamelCase({ phrase: label }) + uuid(); // Generate the id once

	return (
		<div className="form-control">
			<input
				id={id}
				type="checkbox"
				className="toggle sr-only [&+label]:focus-visible:border-info [&+label]:focus-visible:border-dashed [&+label]:focus-visible:border-4"
				checked={isActive}
				onChange={onChange}
			/>
			<label
				className={twMerge(
					'text-sm sm2:text-base text-center label cursor-pointer border border-solid dark:border-slate-800 rounded-full px-[.8em] py-[.2em] hover:bg-gray-500 dark:hover:bg-gray-300 hover:text-slate-50 dark:hover:text-slate-800 transition-colors duration-500',
					isActive ? 'bg-accent text-slate-50 dark:text-slate-800' : '',
					labelStyles,
				)}
				htmlFor={id}>
				<span>{label}</span>
			</label>
		</div>
	);
}

Badge.propTypes = {
	isActive: PropTypes.bool,
	label: PropTypes.string,
	labelStyles: PropTypes.string,
	onChange: PropTypes.func,
};

export default Badge;
