import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { BiPencil, BiTrashAlt } from 'react-icons/bi';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';

// Firebase
import app from 'src/dbConnection/firebase';
import { getDatabase, ref, set, push, get, remove } from 'firebase/database';

// Components
import { Navbar, Modal, Table } from 'src/Components';

// Utils
import toCamelCase from 'src/utils/toCamelCase';
import toCapitalize from 'src/utils/toCapitalize';
import generateDateTime from 'src/utils/generateDateTime';
import toastConfigs from 'src/utils/toastConfigs';

// Schema
import productsSchema from 'src/formSchemas/productsSchema';

const tableHeadings = ['Name', 'Categories', 'Stock', 'Price', 'Cost', 'Actions'];
const tableDataCells = ['name', 'categories', 'stock', 'price', 'cost', 'actions'];

const formInputs = [
	{
		id: uuid(),
		name: 'Name',
		placeholder: 'Product name',
		type: 'text',
	},
	{
		id: uuid(),
		name: 'Stock',
		placeholder: 'How many in stocks?',
		type: 'number',
		step: 'any',
	},
	{
		id: uuid(),
		name: 'Price',
		placeholder: 'How much per piece',
		type: 'number',
		step: 'any',
	},
	{
		id: uuid(),
		name: 'Cost',
		placeholder: 'How much is the cost',
		type: 'number',
		step: 'any',
	},
];

const categories = [
	{ displayName: 'Beverages' },
	{ displayName: 'Appetizers' },
	{ displayName: 'Main Courses' },
	{ displayName: 'Side Dishes' },
	{ displayName: 'Desserts' },
	{ displayName: 'Condiments' },
	{ displayName: 'Ingredients' },
	{ displayName: 'Supplies' },
	{ displayName: 'Cleaning Supplies' },
	{ displayName: 'Miscellaneous' },
];

function DashboardPage() {
	const [selectedCategories, setSelectedCategories] = useState(['mainCourses']);
	const [addProductModalIsOpen, setAddProductModalIsOpen] = useState(false);
	const [deleteProductDialogIsOpen, setDeleteProductDialogIsOpen] = useState(false);
	const [deleteId, setDeleteId] = useState('');

	// Hook form
	const {
		register: addProductRegister,
		handleSubmit: addProductHandleSubmit,
		formState: { errors: addProductErrors, isSubmitting: addProductIsSubmitting },
		reset: addProductResetForm,
	} = useForm({
		resolver: zodResolver(productsSchema),
	});

	// Fetch data
	const fetchProductsData = async () => {
		const db = getDatabase(app);
		const dbRef = ref(db, 'Inventory');
		const snapshot = await get(dbRef);
		if (snapshot.exists()) {
			const temporaryData = snapshot.val();
			const data = Object.keys(temporaryData).map((el) => {
				return { ...temporaryData[el], firebaseId: el };
			});

			return data;
		}

		return null;
	};

	const {
		data: productsData,
		isLoading: productsDataIsLoading,
		isError: productsDataIsError,
		refetch,
	} = useQuery({
		queryFn: fetchProductsData,
		queryKey: ['productsData'],
	});

	if (productsDataIsError) {
		return 'Error fetching data';
	}

	// Write data
	const addProductOnSubmit = async (data) => {
		const formattedData = {
			...data,
			cost: Number(data.cost),
			price: Number(data.price),
			stock: Number(data.stock),
			categories: selectedCategories,
			id: uuid(),
			createdAt: generateDateTime({ isUnix: true }),
			updatedAt: generateDateTime({ isUnix: true }),
		};

		try {
			const db = getDatabase(app);
			const newDocRef = push(ref(db, 'Inventory'));

			await toast.promise(
				set(newDocRef, formattedData),
				{
					pending: 'Creating product',
					success: 'Successfully added the product',
				},
				toastConfigs,
			);

			refetch();
			setAddProductModalIsOpen(false);
			addProductResetForm();
			setSelectedCategories(['mainCourses']);
		} catch (e) {
			console.error('Something went wrong', e);
		}
	};

	// Delete Data
	const removeEntry = async (id) => {
		const db = getDatabase(app);
		const dbRef = ref(db, 'Inventory/' + id);

		await toast.promise(
			remove(dbRef),
			{
				pending: 'Deleting product',
				success: 'Successfully deleted the product',
				error: 'Something went wrong while deleting the product',
			},
			toastConfigs,
		);
		refetch();
	};

	// Functions
	const handleCategoryCheckboxChange = (categoryId) => {
		const isChecked = selectedCategories.includes(categoryId);
		if (isChecked) {
			setSelectedCategories((prevState) => prevState.filter((item) => item !== categoryId));
		} else {
			setSelectedCategories((prevState) => [...prevState, categoryId]);
		}
	};

	const formattedTableData = productsData?.map((el) => {
		return {
			...el,
			name: <span className="font-medium sm2:font-bold">{el.name}</span>,
			categories: (
				<div className="flex flex-wrap gap-[.5em]">
					{el?.categories?.map((el, index) => {
						return (
							<span key={index} className="badge badge-outline">
								{toCapitalize({ phrase: el })}
							</span>
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
							console.log(el.firebaseId);
							toast.info(
								"I wasn't able to do this due to lack of time 😞",
								toastConfigs,
							);
						}}>
						<BiPencil className="text-info" />
					</button>
					<button
						className="btn btn-circle btn-ghost"
						title="Delete"
						onClick={() => {
							openDeleteProductDialog();
							setDeleteId(el.firebaseId);
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
		addProductResetForm();
		setSelectedCategories(['mainCourses']);
	};

	const openDeleteProductDialog = () => {
		setDeleteProductDialogIsOpen(true);
	};

	const closeDeleteProductDialog = () => {
		setDeleteProductDialogIsOpen(false);
		setDeleteId('');
	};

	const handleDelete = () => {
		removeEntry(deleteId);
		closeDeleteProductDialog();
	};

	return (
		<div className="">
			<Navbar title={toCapitalize({ phrase: 'utak inventory system', eachWord: true })} />

			<div className="flex justify-end gap-[.5em] mt-[2em]">
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
							className="btn btn-primary text-sm text-slate-50"
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
				closeModal={closeAddProductModal}
				submitText="Add product"
				formToSubmit="addProductForm"
				isSubmitting={addProductIsSubmitting}>
				<form
					id="addProductForm"
					className="my-[1em] space-y-[1em]"
					onSubmit={addProductHandleSubmit(addProductOnSubmit)}>
					{formInputs.map((el) => {
						return (
							<>
								<label
									key={el.id}
									className="input input-bordered flex items-center gap-[1em] cursor-pointer">
									{el.name}
									<input
										{...addProductRegister(toCamelCase({ phrase: el.name }))}
										type={el.type}
										className="grow"
										placeholder={el.placeholder}
										step={el.step || null}
									/>
								</label>

								{addProductErrors?.[toCamelCase({ phrase: el.name })] && (
									<p className="text-error">
										{
											addProductErrors[toCamelCase({ phrase: el.name })]
												?.message
										}
									</p>
								)}
							</>
						);
					})}
					<div className="py-[1em]">
						<h3 className="mb-[1em] font-medium">Categories</h3>
						<div className="flex flex-wrap gap-[.5em]">
							{categories.map((el) => {
								return (
									<div
										key={toCamelCase({ phrase: el.displayName })}
										className="form-control">
										<label
											className={twMerge(
												'label cursor-pointer badge p-[1em]',
												selectedCategories.includes(
													toCamelCase({ phrase: el.displayName }),
												)
													? 'badge-primary text-slate-50'
													: '',
											)}>
											<span className="label-text">{el.displayName}</span>
											<input
												type="checkbox"
												className="toggle sr-only"
												checked={selectedCategories.includes(
													toCamelCase({ phrase: el.displayName }),
												)}
												onChange={() =>
													handleCategoryCheckboxChange(
														toCamelCase({ phrase: el.displayName }),
													)
												}
											/>
										</label>
									</div>
								);
							})}
						</div>
					</div>
				</form>
			</Modal>

			{/* Delete Product Dialog */}
			<Modal
				modalTitle="Delete this product?"
				isOpen={deleteProductDialogIsOpen}
				closeModal={closeDeleteProductDialog}
				submitText="Delete product"
				handleSubmitOnClick={handleDelete}
				submitButtonStyles="btn-error text-white">
				<p className="py-[1.3em]">Are you sure you want to delete this product?</p>
			</Modal>
		</div>
	);
}

export default DashboardPage;
