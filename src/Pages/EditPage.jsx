import { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DateTime } from 'luxon';

// Firebase
import app from 'src/dbConnection/firebase';
import { getDatabase, ref, set } from 'firebase/database';

// Components
import { EditProductForm, Modal } from 'src/Components';

// Utils
import toastConfigs from 'src/utils/toastConfigs';
import { CATEGORIES, SIZES } from 'src/utils/constants';

function EditPage() {
	const navigate = useNavigate();
	const product = useLoaderData();
	const formattedProduct = {
		...product,
		stock: product.stock.toString(),
		price: product.price.toString(),
		cost: product.cost.toString(),
	};

	const [isConfirmed, setIsConfirmed] = useState(false);
	const [modalIsOpen, setModalIsOpen] = useState(false);

	const updateProduct = async (data) => {
		setModalIsOpen(true);
		if (isConfirmed) {
			setModalIsOpen(false);
			const db = getDatabase(app);
			const dbRef = ref(db, `Products/${product.firebaseId}`);
			try {
				await toast.promise(
					set(dbRef, data),
					{
						pending: 'Updating product',
						success: 'Successfully updated product',
					},
					toastConfigs,
				);
				setIsConfirmed(false);
				navigate('/');
			} catch (err) {
				console.error(err);
				toast.error(
					'An error occurred while updating the product. Please try again later.',
					toastConfigs,
				);
				setIsConfirmed(false);
			}
		}
	};

	const handleSubmitModal = () => {
		setIsConfirmed(true);
	};

	const closeDialog = () => {
		setModalIsOpen(false);
	};

	return (
		<>
			<div className="container max-w-[600px]">
				<h1 className="font-bold text-xl sm1:text-3xl sm2:text-4xl mt-[1em] py-[.5em] text-start">
					Update product
				</h1>
				<h2 className="text-lg sm1:text-2xl sm2:text-3xl my-5 text-primary">
					{product.name}
				</h2>
				<small className="block text-gray-400 font-light">
					Created at: {DateTime.fromMillis(product.createdAt).toFormat('MMMM d, yyyy')}
				</small>
				<small className="block text-gray-400 font-light">
					Last modified:{' '}
					{DateTime.fromMillis(product.updatedAt).toFormat('MMMM d, yyyy HH:mm')}
				</small>
				{product ? (
					<EditProductForm
						preloadedValues={formattedProduct}
						onSubmit={updateProduct}
						categories={CATEGORIES}
						sizes={SIZES}
						formId="editForm"
					/>
				) : (
					// For loading
					<div className="space-y-[1em]">
						<div className="skeleton w-[90%] h-10"></div>
						<div className="skeleton w-[75%] h-10"></div>
						<div className="flex flex-wrap gap-[1em]">
							<div className="skeleton w-[100px] h-[30px]"></div>
							<div className="skeleton w-[100px] h-[30px]"></div>
							<div className="skeleton w-[100px] h-[30px]"></div>
						</div>
					</div>
				)}
			</div>

			{/* Update product Dialog */}
			<Modal
				modalTitle="Update product"
				isOpen={modalIsOpen}
				closeModal={closeDialog}
				submitText="Update product"
				handleSubmit={handleSubmitModal}
				formToSubmit="editForm">
				<p>Are you sure you want to update this product?</p>
			</Modal>
		</>
	);
}

export default EditPage;
