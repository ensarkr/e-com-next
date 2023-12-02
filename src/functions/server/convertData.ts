import { orderProduct } from "@/components/productCardBig/ProductOrder";
import {
  productT,
  productT_DB,
  sizesT,
  userPartial,
  user,
  user_DB,
} from "./database";

const convertToRealProduct = (DBProduct: productT_DB): productT => {
  const sizes_DB = DBProduct.sizes;
  const sizes = sizes_DB === null ? null : (JSON.parse(sizes_DB) as sizesT[]);

  return {
    id: DBProduct.id,
    name: DBProduct.name,
    nameTR: DBProduct.name_tr,
    type: DBProduct.type,
    img: DBProduct.img,
    sex: DBProduct.sex,
    hasSizes: DBProduct.has_sizes,
    sizes,
    colors: JSON.parse(DBProduct.colors) as string[],
    price: DBProduct.price,
    oldPrice: DBProduct.old_price,
    designer: DBProduct.designer,
    imgSrc: DBProduct.img_src,
    imgPhotographer: DBProduct.img_photographer,
  } as productT;
};

const convertToRealProducts = (DBProducts: productT_DB[]) => {
  return DBProducts.map((e) => convertToRealProduct(e));
};

const convertUserToPartial = (user: user_DB): userPartial => {
  return {
    fullName: user.full_name,
    email: user.email,
    country: user.country,
    city: user.city,
    address: user.address,
  };
};

const convertDatabaseUserToUser = (user: user_DB): user => {
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    country: user.country,
    city: user.city,
    address: user.address,
  };
};

export type orderProduct_DB = {
  id: number;
  email: string;
  created_at: Date;
  product_id: number;
  product_size: sizesT;
  product_color: string;
  bought_price: number;
  order_status: string;
  country: string;
  city: string;
  address: string;
};

const convertToOrderProducts = (
  boughtProductsDatabase: orderProduct_DB[]
): Omit<orderProduct, "data">[] => {
  return boughtProductsDatabase.map((boughtProductDatabase) => {
    return {
      pid: boughtProductDatabase.product_id,
      boughtPrice: boughtProductDatabase.bought_price,
      boughtDate: convertDatabaseTime(boughtProductDatabase.created_at),
      orderStatus: boughtProductDatabase.order_status,
      country: boughtProductDatabase.country,
      color: boughtProductDatabase.product_color,
      size: boughtProductDatabase.product_size,
    };
  });
};

const convertDatabaseTime = (databaseTime: Date) => {
  const databaseTimeString = databaseTime.toISOString();
  const year = databaseTimeString.slice(0, 4);
  const month = databaseTimeString.slice(5, 7);
  const date = databaseTimeString.slice(8, 10);
  return date + "-" + month + "-" + year;
};

export {
  convertToRealProduct,
  convertToRealProducts,
  convertUserToPartial,
  convertDatabaseUserToUser,
  convertToOrderProducts,
  convertDatabaseTime,
};
