import { getProducts, getProductsByCategory } from './controllers/Productcontroller';
import { registerUser, loginUser } from './controllers/Authcontroller';
interface CategoryArgs {
  categoryName: string;
}

interface LoginArgs {
  email: string;
  password: string;
}

export const resolvers = {
  Query: {
    getAllProducts: async () => await getProducts(),

    getCategory: async (_: any, { categoryName }: CategoryArgs) => 
      await getProductsByCategory(categoryName),
  },
  Mutation: {
    register: async (_: any, args: any) => await registerUser(args),
    login: async (_: any, { email, password }: LoginArgs) => 
      await loginUser(email, password),
  }
};