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
import { sql } from "@vercel/postgres";
import { orderProduct } from "@/components/productOrderCard/productOrderCard";

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

async function fetchProducts(
  limit?: number | undefined
): Promise<doubleReturn<productT[]>> {
  const databaseConnection = await database.getDatabase();

  if (!databaseConnection.status)
    return await {
      status: false,
      message: databaseConnection.message,
    };

  const supabase = databaseConnection.value;

  let { data: allProducts, error } = await supabase
    .from("product_datas")
    .select("*")
    .order("id", { ascending: true })
    .limit(limit === undefined ? 50 : limit);

  if (error) return { status: false, message: error.message };

  return {
    status: true,
    value: convertToRealProducts(allProducts as productT_DB[]),
  };
}

async function fetchAllProducts() {
  return fetchProducts();
}

async function fetchPopularProducts(): Promise<doubleReturn<productT[]>> {
  const databaseConnection = await database.getDatabase();

  if (!databaseConnection.status)
    return await {
      status: false,
      message: databaseConnection.message,
    };

  const supabase = databaseConnection.value;

  let { data: allProducts, error } = await supabase
    .from("product_datas")
    .select("*")
    .order("popularity", { ascending: true })
    .limit(9);

  if (error) return { status: false, message: error.message };

  return {
    status: true,
    value: convertToRealProducts(allProducts as productT_DB[]),
  };
}
async function fetchProduct(
  productId: number
): Promise<doubleReturn<productT>> {
  const databaseConnection = await database.getDatabase();

  if (!databaseConnection.status)
    return await {
      status: false,
      message: databaseConnection.message,
    };

  const supabase = databaseConnection.value;

  let { data: product, error } = await supabase
    .from("product_datas")
    .select("*")
    .eq("id", productId)
    .single();

  if (error) return { status: false, message: error.message };

  return {
    status: true,
    value: convertToRealProduct(product as productT_DB),
  };
}

async function fetchUser(
  email: string,
  password: string
): Promise<doubleReturn<user>> {
  const databaseConnection = await database.getDatabase();

  if (!databaseConnection.status)
    return await {
      status: false,
      message: databaseConnection.message,
    };

  const supabase = databaseConnection.value;

  let { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) return { status: false, message: error.message };

  if (await bcrypt.compare(password, user.password_hash)) {
    return {
      status: true,
      value: convertDatabaseUserToUser(user as user_DB),
    };
  } else {
    return {
      status: false,
      message: "passwords does not match",
    };
  }
}

async function fetchUser_ID(id: string): Promise<doubleReturn<user>> {
  const databaseConnection = await database.getDatabase();

  if (!databaseConnection.status)
    return await {
      status: false,
      message: databaseConnection.message,
    };

  const supabase = databaseConnection.value;

  let { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { status: false, message: error.message };

  return {
    status: true,
    value: convertDatabaseUserToUser(user as user_DB),
  };
}

async function fetchUserData(
  email: string
): Promise<doubleReturn<userPartial>> {
  const databaseConnection = await database.getDatabase();

  if (!databaseConnection.status)
    return await {
      status: false,
      message: databaseConnection.message,
    };

  const supabase = databaseConnection.value;

  let { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) return { status: false, message: error.message };

  return {
    status: true,
    value: convertUserToPartial(user),
  };
}

async function doesUserExist(email: string): Promise<doubleReturn<boolean>> {
  const databaseConnection = await database.getDatabase();

  if (!databaseConnection.status)
    return await {
      status: false,
      message: databaseConnection.message,
    };

  const supabase = databaseConnection.value;

  let { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  // * No rows returned code
  if (error && error.code !== "PGRST116")
    return { status: false, message: error.message };

  if (data === null) {
    return {
      status: true,
      value: false,
    };
  } else {
    return {
      status: true,
      value: true,
    };
  }
}
async function createUser(user: user_FD): Promise<doubleReturn<"success">> {
  const databaseConnection = await database.getDatabase();

  if (!databaseConnection.status)
    return await {
      status: false,
      message: databaseConnection.message,
    };

  const supabase = databaseConnection.value;

  let { data, error } = await supabase.from("users").insert([
    {
      full_name: user.fullName,
      email: user.email,
      password_hash: await bcrypt.hash(user.password, 10),
      country: user.country,
      city: user.city,
      address: user.address,
    } as Omit<user_DB, "id">,
  ]);

  if (error) return { status: false, message: error.message };

  return {
    status: true,
    value: "success",
  };
}

async function editUser(
  newUserData: userPartial,
  email: string
): Promise<doubleReturn<user_JWT>> {
  const databaseConnection = await database.getDatabase();

  if (!databaseConnection.status)
    return await {
      status: false,
      message: databaseConnection.message,
    };

  const supabase = databaseConnection.value;

  const { data, error } = await supabase
    .from("users")
    .update({
      full_name: newUserData.fullName,
      email: newUserData.email,
      country: newUserData.country,
      city: newUserData.city,
      address: newUserData.address,
    })
    .eq("email", email);

  if (error) return { status: false, message: error.message };

  return {
    status: true,
    value: {
      name: newUserData.fullName,
      email: newUserData.email,
    },
  };
}

async function editUserPassword(
  passwordObject: passwordObjectT,
  email: string
): Promise<doubleReturn<"success">> {
  const databaseConnection = await database.getDatabase();

  if (!databaseConnection.status)
    return await {
      status: false,
      message: databaseConnection.message,
    };

  const supabase = databaseConnection.value;

  let { data: checkUser, error: checkError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (checkError)
    return {
      status: false,
      message:
        checkError.code === "PGRST116"
          ? "user does not exist"
          : checkError.message,
    };

  const verifyResult = await bcrypt.compare(
    passwordObject.oldPassword,
    checkUser.password_hash
  );

  if (!verifyResult) {
    return { status: false, message: "wrong password" };
  }

  const { data, error } = await supabase
    .from("users")
    .update({
      password_hash: await bcrypt.hash(passwordObject.newPassword, 5),
    })
    .eq("email", email);

  if (error) return { status: false, message: error.message };

  return {
    status: true,
    value: "success",
  };
}

async function addBoughtProducts(
  userEmail: string,
  options: buyMarketRequestBody
): Promise<doubleReturn<{ itemCount: number }>> {
  const databaseConnection = await database.getDatabase();

  if (!databaseConnection.status)
    return await {
      status: false,
      message: databaseConnection.message,
    };

  const supabase = databaseConnection.value;

  const { market, country, city, address } = options;

  let { data: productsData, error: errorData } = await supabase
    .from("product_datas")
    .select("*")
    .in("id", [market.map((item) => item.pid)]);

  if (errorData || productsData === null)
    return {
      status: false,
      message: errorData
        ? errorData.message
        : "products fetching returned null",
    };

  const { data, error: boughtError } = await supabase
    .from("bought_products")
    .insert(
      market.map((marketItem) => {
        return {
          email: userEmail,
          product_id: marketItem.pid,
          product_size: marketItem.size,
          product_color: marketItem.color,
          country: country,
          city: city,
          address: address,
          bought_price: (productsData as unknown as productT_DB[]).filter(
            (databaseProduct) => databaseProduct.id === marketItem.pid
          )[0].price,
          order_status: ["processing", "on the way", "received"][
            Math.floor(Math.random() * 3)
          ],
        };
      })
    );

  if (boughtError) return { status: false, message: boughtError.message };

  return {
    status: true,
    value: { itemCount: market.length },
  };
}

async function fetchAllBoughtProducts(
  email: string
): Promise<doubleReturn<{ allBoughtProducts: Omit<orderProduct, "data">[] }>> {
  const databaseConnection = await database.getDatabase();

  if (!databaseConnection.status)
    return await {
      status: false,
      message: databaseConnection.message,
    };

  const supabase = databaseConnection.value;

  const { data, error } = await supabase
    .from("bought_products")
    .select("*")
    .eq("email", email);

  if (error) return { status: false, message: error.message };

  return {
    status: true,
    value: {
      allBoughtProducts: convertToOrderProducts(data as orderProduct_DB[]),
    },
  };
}

export {
  fetchAllProducts,
  fetchProducts,
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
