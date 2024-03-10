import { toast } from 'react-toastify';
import { redirect } from 'react-router-dom';

// Utils
import toastConfigs from '../toastConfigs';

// Firebase
import app from 'src/dbConnection/firebase';
import { getDatabase, ref, get } from 'firebase/database';

const editProductLoader = async ({ params }) => {
	const { id } = params;
	try {
		const fetchData = async () => {
			const db = getDatabase(app);
			const dbRef = ref(db, 'Products/' + id);
			const snapshot = await get(dbRef);

			if (snapshot.exists()) return { ...snapshot.val(), firebaseId: id };

			return null;
		};

		return await fetchData();
	} catch (err) {
		toast.error('Something went wrong while loading the product', toastConfigs);
		console.error(err);
		return redirect('/');
	}
};

export default editProductLoader;
