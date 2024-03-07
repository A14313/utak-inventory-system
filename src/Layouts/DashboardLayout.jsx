import PropTypes from 'prop-types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
function DashboardLayout({ children }) {
	// bg-base-200
	return (
		<QueryClientProvider client={queryClient}>
			<div className="min-h-[100dvh]">
				<div className="container mx-auto min-w-[95%] sm2:min-w-[unset]">{children}</div>
			</div>
			;
		</QueryClientProvider>
	);
}

DashboardLayout.propTypes = {
	children: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType, PropTypes.node]),
};

export default DashboardLayout;
