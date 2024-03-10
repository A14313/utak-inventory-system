import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';
import { Link } from 'react-router-dom';
function Navbar({ title, className }) {
	return (
		<div
			className={twMerge(
				'navbar bg-base-100 z-10 sticky top-[1%] drop-shadow-lg rounded-lg',
				className,
			)}>
			<div className="flex-1">
				<Link className="btn btn-ghost text-xl" to="/">
					{title}
				</Link>
			</div>
		</div>
	);
}

Navbar.propTypes = {
	title: PropTypes.string,
	className: PropTypes.string,
};

export default Navbar;
