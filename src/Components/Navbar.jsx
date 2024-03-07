import PropTypes from 'prop-types';
function Navbar({ title }) {
	return (
		<div className="navbar bg-base-100 z-10 sticky top-[1%] drop-shadow-lg rounded-lg">
			<div className="flex-1">
				<a className="btn btn-ghost text-xl">{title}</a>
			</div>
		</div>
	);
}

Navbar.propTypes = {
	title: PropTypes.string,
};

export default Navbar;
