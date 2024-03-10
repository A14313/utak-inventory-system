import { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Firebase
import app from 'src/dbConnection/firebase';
import { getDatabase, ref, set } from 'firebase/database';

// Components
import { EditProductForm, Modal } from 'src/Components';

// Utils
import toastConfigs from 'src/utils/toastConfigs';
import { CATEGORIES } from 'src/utils/constants';

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
					new Promise((resolve, reject) => {
						const randomNum = Math.floor(Math.random() * 5000);
						console.log(randomNum);
						setTimeout(() => {
							if (randomNum <= 3000) {
								set(dbRef, data);
								resolve(data);
							} else {
								reject();
							}
						}, randomNum);
					}),
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
			{product ? (
				<EditProductForm
					preloadedValues={formattedProduct}
					onSubmit={updateProduct}
					categories={CATEGORIES}
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

			{/* Update product Dialog */}
			<Modal
				modalTitle="Update product"
				isOpen={modalIsOpen}
				closeModal={closeDialog}
				submitText="Update product"
				handleSubmit={handleSubmitModal}
				formToSubmit="editForm">
				<p className="py-[1.3em]">Are you sure you want to update this product?</p>
			</Modal>
		</>
	);
}

export default EditPage;
