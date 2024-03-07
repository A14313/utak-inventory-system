import PropTypes from 'prop-types';

// Utils
import toCamelCase from 'src/utils/toCamelCase';
import toCapitalize from 'src/utils/toCapitalize';
function Table({ data, tableHeadings, tableDataCells }) {
	return (
		<div className="overflow-x-auto max-h-[700px]">
			<table className="table table-zebra table-pin-rows table-pin-cols table-md med:table-lg">
				<thead>
					<tr>
						{/* Blank th for the numbers */}
						<th></th>
						{tableHeadings.map((el) => {
							return (
								<th
									key={toCamelCase({ phrase: el })}
									className="text-xs sm1:text-sm med:text-base lg:text-lg">
									{toCapitalize({ phrase: el })}
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{data?.map((el, index) => {
						return (
							<tr key={el.id}>
								<th>{index + 1}</th>
								{tableDataCells.map((dataCell, index) => {
									return <td key={index}>{el[dataCell]}</td>;
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

Table.propTypes = {
	data: PropTypes.array,
	tableHeadings: PropTypes.array,
	tableDataCells: PropTypes.array,
};

export default Table;
