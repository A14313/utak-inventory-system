const toCapitalize = ({ phrase, eachWord }) => {
	if (phrase) {
		if (eachWord) {
			const words = phrase.split(/\s+|_|-/);
			const capitalized = words
				.map((el) => {
					const firstCharacter = el.charAt(0).toUpperCase();
					return firstCharacter + el.slice(1).toLowerCase();
				})
				.join(' ');
			return capitalized;
		}
		return phrase[0].toUpperCase() + phrase.slice(1).toLowerCase();
	}

	return;
};

export default toCapitalize;
