import jwt from 'jsonwebtoken';
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.API_SECRET as string, {
    expiresIn: '2d',
  });
};

export default generateToken;