import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';

import { Navbar } from 'src/Components';
import toCapitalize from 'src/utils/toCapitalize';

const queryClient = new QueryClient();
function DashboardLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="min-h-[100dvh]">
				<div className="container min-w-[95%] sm2:min-w-[unset]">
					<Navbar
						className="mb-[2em]"
						title={toCapitalize({ phrase: 'utak inventory system', eachWord: true })}
					/>
					<Outlet />
				</div>
			</div>
		</QueryClientProvider>
	);
}

export default DashboardLayout;
