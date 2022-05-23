const variables = ["a", "b", "a ∧ b"];
const numberOfSets = 1 << variables.length;
const results = [];
let i, j;
for (i = 0; i < numberOfSets; i++) {
	results.push({});
	for (j = 0; j < variables.length; j++) {
		if (((1 << j) & i) > 0) results[i][variables[j]] = true;
		else results[i][variables[j]] = false;
	}
}
