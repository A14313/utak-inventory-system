import { z } from 'zod';

import { STRINGS } from 'src/utils/constants';

const characterMinLength = 2;
const characterMaxLength = 50;

const productsSchema = z.object({
	name: z
		.string()
		.trim()
		.min(characterMinLength, {
			message: `Product name must be minimum of ${characterMinLength} characters`,
		})
		.max(characterMaxLength, {
			message: `Product name must be maximum of ${characterMaxLength} characters`,
		}),

	stock: z.string().trim().min(1, {
		message: STRINGS.STOCK_CANNOT_BE_EMPTY,
	}),
	price: z.string().trim().min(1, {
		message: STRINGS.PRICE_CANNOT_BE_EMPTY,
	}),
	cost: z.string().trim().min(1, {
		message: STRINGS.COST_CANNOT_BE_EMPTY,
	}),
	size: z
		.string({
			required_error: STRINGS.SIZE_CANNOT_BE_EMPTY,
			invalid_type_error: STRINGS.SIZE_CANNOT_BE_EMPTY,
		})
		.trim()
		.min(1, {
			message: STRINGS.SIZE_CANNOT_BE_EMPTY,
		}),
});

export default productsSchema;
