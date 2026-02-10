import { uuidv7 } from "uuidv7";

export const generateRandomUUID = () => {
	const id = uuidv7();
	return id;
};
