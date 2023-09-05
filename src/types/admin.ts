export type Admin = {
  id: number;
  avatar: null | {
    name: string;
    url: string;
  };
  name: string;
  email: string;
  phone: string;
  role: string | null;
}
