export const getPropertyValues = (objectArray = [{}], key) => {
	const propertyValues = objectArray.map((element) => element[key]);
	return propertyValues;
};
