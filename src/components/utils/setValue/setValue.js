import { isNotNull } from "../isNotNull/isNotNull";
import { isNotUndefined } from "../isNotUndefined/isNotUndefined";

export const setValue = (userInput, defaultValue) => {
	if (isNotUndefined(userInput) && isNotNull(userInput)) {
		return userInput;
	} else {
		return defaultValue;
	}
};
