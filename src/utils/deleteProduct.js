// Firebase
import app from 'src/dbConnection/firebase';
import { getDatabase, ref, remove } from 'firebase/database';

const deleteProduct = async ({ id }) => {
	const db = getDatabase(app);
	const dbRef = ref(db, `Products/${id}`);
	await remove(dbRef);
};

export default deleteProduct;
