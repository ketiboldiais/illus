import React from "react";

export default function TruthTable({
	id = "",
	focus = [],
	data = [],
}) {
	const headers = data[0];
	return (
		<table>
			<thead>
				<tr>
					{headers.map((head) => (
						<th>{head}</th>
					))}
				</tr>
			</thead>
		</table>
	);
}
