import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Papa from 'papaparse';

const RankingRow = ({ player, index, moveRow }) => {
	const [, ref] = useDrag({
		type: 'ROW',
		item: { index },
	});

	const [, drop] = useDrop({
		accept: 'ROW',
		hover: (item) => {
			if (item.index !== index) {
				moveRow(item.index, index);
				item.index = index;
			}
		},
	});

	return (
		<tr ref={(node) => ref(drop(node))}>
			<td>{player.RANK}</td>
			<td>{player.NAME}</td>
			<td>{player.TEAM}</td>
			<td>{player.POS}</td>
		</tr>
	);
};

const RankingsTable = ({ rankings, setRankings }) => {
	const moveRow = (fromIndex, toIndex) => {
		const updatedRankings = [...rankings];
		const [movedRow] = updatedRankings.splice(fromIndex, 1);
		updatedRankings.splice(toIndex, 0, movedRow);
		setRankings(updatedRankings);
	};

	const saveRankings = () => {
		const csvData = Papa.unparse(rankings, {
			header: true,
			columns: ['RANK', 'NAME', 'TEAM', 'POS'],
		});
		const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.setAttribute('download', 'rankings.csv');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<>
			<table>
				<thead>
					<tr>
						<th>RANK</th>
						<th>NAME</th>
						<th>TEAM</th>
						<th>POS</th>
					</tr>
				</thead>
				<tbody>
					{rankings.map((player, index) => (
						<RankingRow
							key={player.RANK}
							index={index}
							player={player}
							moveRow={moveRow}
						/>
					))}
				</tbody>
			</table>
			<button onClick={saveRankings}>Save</button>
		</>
	);
};

const RankingsEditor = () => {
	const [rankings, setRankings] = useState([
		{ RANK: 1, NAME: 'Player 1', TEAM: 'Team 1', POS: 'QB' },
		{ RANK: 2, NAME: 'Player 2', TEAM: 'Team 2', POS: 'RB' },
		// ... Add initial rankings or fetch from the CSV
	]);

	return (
		<DndProvider backend={HTML5Backend}>
			<RankingsTable rankings={rankings} setRankings={setRankings} />
		</DndProvider>
	);
};

export default RankingsEditor;
