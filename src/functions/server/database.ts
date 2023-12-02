"use server-only";

import {
  convertDatabaseUserToUser,
  convertToOrderProducts,
  convertToRealProduct,
  convertToRealProducts,
  convertUserToPartial,
  orderProduct_DB,
} from "./convertData";
import { doubleReturn } from "@/typings/globalTypes";
import bcrypt from "bcrypt";
import { buyMarketRequestBody } from "@/app/api/buyMarket/route";
import { orderProduct } from "@/components/productCardBig/ProductOrder";
import { createClient, sql } from "@vercel/postgres";
import format from "pg-format";

// * all database fetching are done from here

export type sizesT = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export type productT = {
  id: number;
  name: string;
  nameTR: string;
  type: "clothing" | "accessory";
  img: string;
  sex: "man" | "woman" | "unisex";
  colors: string[];
  price: number;
  oldPrice: null | number;
  designer: string;
  imgSrc: string;
  imgPhotographer: string;
} & ({ hasSizes: false; sizes: null } | { hasSizes: true; sizes: sizesT[] });

export type productT_DB = {
  id: number;
  name: string;
  name_tr: string;
  type: "clothing" | "accessory";
  img: string;
  sex: "man" | "woman" | "unisex";
  has_sizes: boolean;
  sizes: null | string;
  colors: string;
  price: number;
  old_price: null | number;
  designer: string;
  img_src: string;
  img_photographer: string;
};

export type user = {
  id: number;
  fullName: string;
  email: string;
  address: string;
  city: string;
  country: string;
};

export type user_DB = {
  id: number;
  full_name: string;
  email: string;
  password_hash: string;
  address: string;
  city: string;
  country: string;
};

export type user_FD = {
  fullName: string;
  email: string;
  password: string;
  rePassword: string;
  address: string;
  city: string;
  country: string;
};

export type user_JWT = {
  name: string;
  email: string;
};

export type userPartial = Omit<user_FD, "password" | "rePassword">;
export type passwordObjectT = {
  oldPassword: string;
  newPassword: string;
  reNewPassword: string;
};

async function fetchAllProducts(): Promise<doubleReturn<productT[]>> {
  try {
    const { rows } = await sql`
    SELECT * FROM product_datas
    ORDER BY id`;

    return {
      status: true,
      value: convertToRealProducts(rows as productT_DB[]),
    };
  } catch (error) {
    return { status: false, message: (error as Error).message };
  }
}

async function fetchPopularProducts(): Promise<doubleReturn<productT[]>> {
  try {
    const { rows } = await sql`
    SELECT * FROM product_datas
    ORDER BY popularity
    LIMIT 9`;

    return {
      status: true,
      value: convertToRealProducts(rows as productT_DB[]),
    };
  } catch (error) {
    return { status: false, message: (error as Error).message };
  }
}
async function fetchProduct(
  productId: number
): Promise<doubleReturn<productT>> {
  try {
    const { rows } = await sql`
    SELECT * FROM product_datas
    WHERE id = ${productId}`;

    if (rows.length === 0) {
      return { status: false, message: "Could not find the item." };
    }

    return {
      status: true,
      value: convertToRealProduct(rows[0] as productT_DB),
    };
  } catch (error) {
    console.log(error);
    return { status: false, message: (error as Error).message };
  }
}

async function fetchUser(
  email: string,
  password: string
): Promise<doubleReturn<user>> {
  try {
    const { rows } = await sql`
    SELECT * FROM users
    WHERE email = ${email}`;

    if (rows.length === 0) {
      return { status: false, message: "Could not find the user." };
    }

    if (await bcrypt.compare(password, rows[0].password_hash)) {
      return {
        status: true,
        value: convertDatabaseUserToUser(rows[0] as user_DB),
      };
    } else {
      return {
        status: false,
        message: "Passwords does not match.",
      };
    }
  } catch (error) {
    return { status: false, message: (error as Error).message };
  }
}

async function fetchUser_ID(id: string): Promise<doubleReturn<user>> {
  try {
    const { rows } = await sql`
    SELECT * FROM users
    WHERE id = ${id}`;

    if (rows.length === 0) {
      return { status: false, message: "Could not find the user." };
    }

    return {
      status: true,
      value: convertDatabaseUserToUser(rows[0] as user_DB),
    };
  } catch (error) {
    return { status: false, message: (error as Error).message };
  }
}

async function fetchUserData(
  email: string
): Promise<doubleReturn<userPartial>> {
  try {
    const { rows } = await sql`
    SELECT * FROM users
    WHERE email = ${email}`;

    if (rows.length === 0) {
      return { status: false, message: "Could not find the user." };
    }

    return {
      status: true,
      value: convertDatabaseUserToUser(rows[0] as user_DB),
    };
  } catch (error) {
    return { status: false, message: (error as Error).message };
  }
}

async function doesUserExist(email: string): Promise<doubleReturn<boolean>> {
  try {
    const { rows } = await sql`
    SELECT * FROM users
    WHERE email = ${email}`;

    if (rows.length > 0) {
      return { status: true, value: true };
    } else {
      return { status: true, value: false };
    }
  } catch (error) {
    return { status: false, message: (error as Error).message };
  }
}
async function createUser(user: user_FD): Promise<doubleReturn<"success">> {
  try {
    const { rowCount } = await sql`
    INSERT INTO users (full_name,email,password_hash,country,city,address) 
    VALUES (
      ${user.fullName},
      ${user.email},
      ${await bcrypt.hash(user.password, 10)},
      ${user.country},
      ${user.city},
      ${user.address})`;

    if (rowCount === 1) {
      return { status: true, value: "success" };
    } else {
      return { status: false, message: "Unknown error occurred." };
    }
  } catch (error) {
    return { status: false, message: (error as Error).message };
  }
}

async function editUser(
  newUserData: userPartial,
  email: string
): Promise<doubleReturn<user_JWT>> {
  try {
    const { rowCount } = await sql`
    UPDATE users 
    SET 
      full_name = ${newUserData.fullName},
      email = ${newUserData.email},
      country = ${newUserData.country},
      city = ${newUserData.city},
      address = ${newUserData.address}
    WHERE email = ${email}`;

    if (rowCount === 1) {
      return {
        status: true,
        value: {
          name: newUserData.fullName,
          email: newUserData.email,
        },
      };
    } else {
      return { status: false, message: "Unknown error occurred." };
    }
  } catch (error) {
    return { status: false, message: (error as Error).message };
  }
}

async function editUserPassword(
  passwordObject: passwordObjectT,
  email: string
): Promise<doubleReturn<"success">> {
  try {
    const { rows, rowCount: userCount } = await sql`
    SELECT password_hash FROM users WHERE email = ${email}`;

    if (userCount === 0) {
      return {
        status: false,
        message: "User could not be found.",
      };
    }

    if (
      !(await bcrypt.compare(passwordObject.oldPassword, rows[0].password_hash))
    ) {
      return {
        status: false,
        message: "Wrong password.",
      };
    }

    const { rowCount } = await sql`
    UPDATE users 
    SET 
      password_hash = ${await bcrypt.hash(passwordObject.newPassword, 10)}
    WHERE email = ${email}`;

    if (rowCount === 1) {
      return {
        status: true,
        value: "success",
      };
    } else {
      return { status: false, message: "Unknown error occurred." };
    }
  } catch (error) {
    return { status: false, message: (error as Error).message };
  }
}

async function addBoughtProducts(
  userEmail: string,
  options: buyMarketRequestBody
): Promise<doubleReturn<{ itemCount: number }>> {
  try {
    const client = createClient();
    client.connect();

    const { rows: product_datas } = await client.query(
      format("SELECT * FROM product_datas WHERE id IN %L", [
        [options.market.map((item) => item.pid)],
      ])
    );

    const { rowCount } = await client.query(
      format(
        "INSERT INTO bought_products (email, product_id, product_size, product_color, country, city, address, bought_price, order_status) VALUES %L",
        options.market.map((item) => {
          const productData = (product_datas as productT_DB[]).filter(
            (e) => e.id === item.pid
          )[0];

          return [
            userEmail,
            productData.id,
            item.size,
            item.color,
            options.country,
            options.city,
            options.address,
            productData.price,
            ["processing", "on the way", "received"][
              Math.floor(Math.random() * 3)
            ],
          ];
        })
      )
    );

    if (rowCount === 0) {
      return {
        status: false,
        message: "Unknown error occurred.",
      };
    } else {
      return { status: true, value: { itemCount: rowCount } };
    }
  } catch (error) {
    return { status: false, message: (error as Error).message };
  }
}

async function fetchAllBoughtProducts(
  email: string
): Promise<doubleReturn<{ allBoughtProducts: Omit<orderProduct, "data">[] }>> {
  try {
    const { rows } = await sql`
    SELECT * FROM bought_products WHERE email = ${email}`;

    console.log(rows);

    return {
      status: true,
      value: {
        allBoughtProducts: convertToOrderProducts(rows as orderProduct_DB[]),
      },
    };
  } catch (error) {
    return { status: false, message: (error as Error).message };
  }
}

export {
  fetchAllProducts,
  fetchPopularProducts,
  fetchProduct,
  fetchUser,
  fetchUser_ID,
  fetchUserData,
  doesUserExist,
  createUser,
  editUser,
  editUserPassword,
  addBoughtProducts,
  fetchAllBoughtProducts,
};
