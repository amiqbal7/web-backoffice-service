import { OrderCourierType, OrderStatus, OrderType } from '@/enums';

export type Order = {
  id: number;
  uuid: string;
  company: string | null;
  email: string;
  address: string;
  phone: string;
  dicom: string;
  stl: null | {
    name: string;
    url: string;
  };
  type: keyof typeof OrderType;
  note: string | null;
  status: keyof typeof OrderStatus;
  price: number | null;
  receipt: null | {
    name: string;
    url: string;
  };
  courier_type: null | keyof typeof OrderCourierType;
  courier_gosend_price: null | number;
  courier_jnt_price: null | number;
  courier_track_number: null | string;
  review_rate: number | null;
  review_message: string | null;
  number: string;
  invoice: string | null;
}
