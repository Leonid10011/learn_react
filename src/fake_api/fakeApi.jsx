import { users } from "./fakeUser";

// Get all users
export const getUsers = () => 
    //Returns values as array
    new Promise((resolve, reject) => {
        if(!users){
            setTimeout(
                () => reject(new Error("Users not found")), 
                500
            );
        }
        setTimeout(() => resolve(Object.values(users)));
    });

    // Get single user by id
export const getUser = (id) => {
    new Promise((resolve, reject) => {
        const user = users[id];
        if(!user) {
            setTimeout(
                () => reject(new Error("User not found"))               
            ), 250
        }
        setTimeout(() => resolve(users[id]), 250)
    })
}

// create single user
export const createUser = (data) => {
    new Promise( (resolve, reject) => {
        if(!data.firstName || !data.lastName){
            reject(new Error("User needs at least a pre or surname!"))
        }
        
        const id = uuidv4();
        const newUser = {id, ...data};
    
        users = {...users, [id]: newUser};
        setTimeout(() => resolve(true),250);
    })
}

// updating a user
export const updateUser = (id, data) => {
    new Promise((resolve, reject) => {
        if(!users[id]){
            return setTimeout(
                () =>  reject(newError("User not found"))
            )
        }
        users[id] = {...users[id], ...data};
    
        return setTimeout(() => resolve(true), 250);
    });
};

// remove a user
export const deleteUser = (id) => {
    new Promise((resolve, reject) => {
        const {[id]: user, ...rest} = users;

        if(!users[id]){
            return setTimeout(
                () => reject(new Error("User not found!"))
            )
        }

        users = {...rest};

        return setTimeout(() => resolve(true), 250)
    });
};


