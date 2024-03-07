import { DateTime } from 'luxon';

const generateDateTime = ({ daysToMinus = 0, format, isUnix }) => {
	if (!format) format = 'MMMM dd yyyy HH:mm:ss.SSS';
	if (!format || isUnix) {
		return DateTime.now().minus({ days: daysToMinus }).toMillis();
	}

	return DateTime.now().minus({ days: daysToMinus }).toFormat(format);
};

export default generateDateTime;
