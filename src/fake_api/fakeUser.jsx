import { v4 as uuidv4 } from "uuid";

const idOne = uuidv4();
const idTwo = uuidv4();

export const users = {
    [idOne]: {
        id: idOne,
        firstName: "Robert",
        lastName: "Davidson",
        isDeveloper: "false",
    },
    [idTwo]: {
        id: idTwo,
        firstName: "Leonid",
        lastName: "Budovski",
        isDeveloper: "true",
    },
};