import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';

// Utils
import toCapitalize from 'src/utils/toCapitalize';

const Input = forwardRef(function Input(
	{ label, type, placeholder, labelStyles, inputStyles, ...rest },
	ref,
) {
	return (
		<label
			className={twMerge(
				'text-sm sm2:text-base input input-bordered flex items-center gap-[1em] cursor-pointer overflow-hidden',
				labelStyles,
			)}>
			{toCapitalize({ phrase: label })}
			<input
				ref={ref}
				className={twMerge('grow input-xs sm1:input-sm sm2:input-md', inputStyles)}
				type={type}
				placeholder={placeholder}
				{...rest}
			/>
		</label>
	);
});

Input.propTypes = {
	label: PropTypes.string,
	type: PropTypes.string,
	placeholder: PropTypes.string,
	labelStyles: PropTypes.string,
	inputStyles: PropTypes.string,
};

export default Input;
