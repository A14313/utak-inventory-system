import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { BiPencil, BiTrashAlt } from 'react-icons/bi';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';

// Firebase
import app from 'src/dbConnection/firebase';
import { getDatabase, ref, set, push, get } from 'firebase/database';

// Components
import { Modal, Table, AddProductForm, Badge } from 'src/Components';

// Utils
import toCapitalize from 'src/utils/toCapitalize';
import generateDateTime from 'src/utils/generateDateTime';
import toastConfigs from 'src/utils/toastConfigs';
import { CATEGORIES } from 'src/utils/constants';
import deleteProduct from 'src/utils/deleteProduct';

const tableHeadings = ['Name', 'Categories', 'Stock', 'Price', 'Cost', 'Actions'];
const tableDataCells = ['name', 'categories', 'stock', 'price', 'cost', 'actions'];

function DashboardPage() {
	const navigate = useNavigate();
	const [addProductModalIsOpen, setAddProductModalIsOpen] = useState(false);
	// Delete function states
	const [deleteProductDialogIsOpen, setDeleteProductDialogIsOpen] = useState(false);
	const [deleteId, setDeleteId] = useState('');

	// Fetch data
	const {
		data: productsData,
		isLoading: productsDataIsLoading,
		isError: productsDataIsError,
		refetch,
	} = useQuery({
		queryFn: async () => {
			const db = getDatabase(app);
			const dbRef = ref(db, 'Products');
			const snapshot = await get(dbRef);
			if (snapshot.exists()) {
				const temporaryData = snapshot.val();
				const data = Object.keys(temporaryData).map((firebaseId) => {
					return { ...temporaryData[firebaseId], id: firebaseId };
				});
				const sortedData = data.sort((a, b) => b.updatedAt - a.updatedAt); // Sort by date descending

				return sortedData;
			}

			return null;
		},
		queryKey: ['productsData'],
	});

	if (productsDataIsError) {
		return 'Error fetching data';
	}

	// Write data
	const addProduct = async ({ data }) => {
		const formattedData = {
			...data,
			cost: Number(data?.cost),
			price: Number(data?.price),
			stock: Number(data?.stock),
			createdAt: generateDateTime({ isUnix: true }),
			updatedAt: generateDateTime({ isUnix: true }),
		};

		try {
			const db = getDatabase(app);
			const dbRef = ref(db, 'Products');
			const newDocRef = push(dbRef);

			await toast.promise(
				new Promise((resolve, reject) => {
					const randomNum = Math.floor(Math.random() * 5000);
					console.log(randomNum);
					setTimeout(() => {
						if (randomNum <= 3000) {
							set(newDocRef, formattedData);
							resolve(formattedData);
						} else {
							reject();
						}
					}, randomNum);
				}),
				{
					pending: 'Creating product',
					success: 'Successfully added the product',
				},
				toastConfigs,
			);

			refetch();
			setAddProductModalIsOpen(false);
			// Reset the form
		} catch (err) {
			console.error('Something went wrong', err);
		}
	};

	// Functions

	const formattedTableData = productsData?.map((el) => {
		return {
			...el,
			name: <span className="font-medium sm2:font-bold">{el.name}</span>,
			categories: (
				<div className="flex flex-wrap gap-[.5em]">
					{el?.categories?.map((el, index) => {
						return (
							<Badge
								key={index}
								label={toCapitalize({ phrase: el })}
								labelStyles="border-gray-300 dark:border-gray-500 text-sm cursor-default"
							/>
						);
					})}
				</div>
			),
			actions: (
				<div className="flex">
					<button
						className="btn btn-circle btn-ghost"
						title="Edit"
						onClick={() => {
							navigate(`/edit/${el.id}`);
						}}>
						<BiPencil className="text-info" />
					</button>
					<button
						className="btn btn-circle btn-ghost"
						title="Delete"
						onClick={() => {
							setDeleteId(el.id);
							setDeleteProductDialogIsOpen(true);
						}}>
						<BiTrashAlt className="text-error" />
					</button>
				</div>
			),
		};
	});

	// Modals and Dialogs
	const openAddProductModal = () => {
		setAddProductModalIsOpen(true);
	};

	const closeAddProductModal = () => {
		setAddProductModalIsOpen(false);
	};

	// Delete
	const handleDelete = async ({ id }) => {
		await toast.promise(
			deleteProduct({ id }),
			{
				pending: 'Deleting product',
				success: 'Successfully deleted the product',
				error: 'Something went wrong while deleting the product',
			},
			toastConfigs,
		);
	};

	const closeDeleteProductDialog = () => {
		setDeleteProductDialogIsOpen(false);
		setDeleteId('');
		refetch();
	};

	return (
		<>
			{/* Buttons */}
			<div className="flex justify-end gap-[.5em]">
				{productsDataIsLoading ? (
					<>
						<div className="skeleton w-[7rem] h-[2rem] sm2:w-[10rem] sm2:h-[3rem]"></div>
						<div className="skeleton w-[7rem] h-[2rem] sm2:w-[10rem] sm2:h-[3rem]"></div>
					</>
				) : (
					<>
						<button
							className="btn btn-ghost text-sm"
							onClick={() => {
								toast.success('Successfully refreshed data', toastConfigs);
								refetch();
							}}>
							Refresh data
						</button>
						<button
							className="btn btn-primary text-sm text-slate-50 dark:text-slate-800"
							onClick={openAddProductModal}>
							Add new product
						</button>
					</>
				)}
			</div>

			<h1 className="font-bold text-4xl sm2:text-5xl mt-[1em] py-[.5em] text-center">
				Products
			</h1>

			{/* Table */}
			<div className="mt-[1em]">
				{productsDataIsLoading ? (
					<div className="skeleton w-full h-[20rem]"></div>
				) : (
					<Table
						data={formattedTableData && formattedTableData}
						tableDataCells={tableDataCells}
						tableHeadings={tableHeadings}
					/>
				)}
			</div>

			{/* Add Product Modal*/}
			<Modal
				modalTitle="Add new product"
				isOpen={addProductModalIsOpen}
				submitText="Add product"
				includeModalActions={false}>
				<AddProductForm
					categories={CATEGORIES}
					onSubmit={(data) => {
						addProduct({ data });
					}}
					handleCancel={closeAddProductModal}
				/>
			</Modal>

			{/* Delete Product Dialog */}
			<Modal
				modalTitle="Delete this product"
				isOpen={deleteProductDialogIsOpen}
				closeModal={closeDeleteProductDialog}
				handleSubmit={() => {
					handleDelete({ id: deleteId });
					closeDeleteProductDialog();
				}}
				submitText="Delete product"
				submitButtonStyles="btn-error text-white dark:text-white">
				<p className="py-[1.3em]">Are you sure you want to delete this product?</p>
			</Modal>
		</>
	);
}

export default DashboardPage;
