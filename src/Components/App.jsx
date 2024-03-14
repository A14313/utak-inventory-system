import { createBrowserRouter, RouterProvider, createHashRouter } from 'react-router-dom';

import { DashboardPage, EditPage } from 'src/Pages';
import { DashboardLayout } from 'src/Layouts';

// Loaders
import editProductLoader from 'src/utils/loaders/editLoader';

// Please see the note below
const router = createHashRouter([
	{
		path: '/',
		element: <DashboardLayout />,
		children: [
			{
				index: true,
				element: <DashboardPage />,
			},
			{
				path: 'edit/:id',
				element: <EditPage />,
				loader: editProductLoader,
			},
		],
	},
]);
function App() {
	return <RouterProvider router={router} />;
}

export default App;

// Notes:
// I only used the hashrouter so that it has no error on production when refreshing the page.
