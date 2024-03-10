import { twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';

function Badge({ isActive, label, onChange, labelStyles }) {
	return (
		<div className="form-control">
			<label
				className={twMerge(
					'label cursor-pointer border border-solid dark:border-slate-800 rounded-full px-[.8em] py-[.2em] text-center transition-colors duration-500',
					isActive ? 'bg-primary text-slate-50 dark:text-slate-800' : '',
					labelStyles,
				)}>
				<span>{label}</span>
				<input
					type="checkbox"
					className="toggle sr-only"
					checked={isActive}
					onChange={onChange}
				/>
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