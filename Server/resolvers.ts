
import { getProducts, getProductsByCategory } from './controllers/Productcontroller';
import { registerUser, loginUser } from './controllers/Authcontroller';

export const resolvers = {
    Query: {
        getAllProducts: async () => await getProducts(),
        getCategory: async (_: any, { categoryName }) => await getProductsByCategory(categoryName),
    },
    Mutation: {
        register: async (_: any, args: any) => await registerUser(args),
        login: async (_: any, { email, password }) => await loginUser(email, password),
    }
};