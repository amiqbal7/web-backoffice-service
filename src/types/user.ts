export type User = {
  id: number;
  avatar: null | {
    name: string;
    url: string;
  };
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female';
  address: string;
  company: string | null;
}
