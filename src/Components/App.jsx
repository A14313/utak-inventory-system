import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { DashboardPage, EditPage } from 'src/Pages';
import { DashboardLayout } from 'src/Layouts';

// Loaders
import editProductLoader from 'src/utils/loaders/editLoader';

const router = createBrowserRouter([
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
