import { Token } from "@/type";
import { toast } from "react-toastify";
import {
  logOutFailure,
  logOutStart,
  logOutSuccess,
  signInFailure,
  signInStart,
  signInSuccess,
} from "../slice/authSlice";
import { axiosAuth } from "@/lib/axios";

export async function getProduct() {
  try {
    const res = await axiosAuth("/product", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}
export async function getAllCategory() {
  try {
    const res = await axiosAuth("/category", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}
export async function getAllPurchase({ user }: { user: any }) {
  try {
    const res = await axiosAuth("/purchase/admin", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}
export async function getProductByName({ name }: { name: string }) {
  return await axiosAuth(`/product/${name}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => data);
}
export async function getCategoryByName({ name }: { name: string }) {
  return await axiosAuth(`/category/${name}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => data);
}

export const signInUser = async (user: any, dispatch: any, navigate: any) => {
  dispatch(signInStart());
  try {
    const res: any = await axiosAuth({
      method: "POST",
      data: user,
      url: "/login",
    });
    if (!res) {
      toast.info("Token doesn't exist!");
    }
    const userRes = await GetUserWithToken({ token: res.data });

    dispatch(
      signInSuccess({
        user: userRes.data,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      })
    );
    navigate("/");
    toast.success("Login successfully!");
  } catch (e) {
    toast.error("Username or password is incorrect!");
    dispatch(signInFailure());
  }
};

export const signOut = async ({
  dispath,
  navigate,
  axiosCustom,
  user,
}: {
  dispath: any;
  navigate: any;
  axiosCustom: any;
  user: any;
}) => {
  dispath(logOutStart());
  try {
    await axiosCustom({
      method: "POST",
      url: "/logout",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
      data: { refreshToken: user.refreshToken },
    });
    navigate("/auth/login");
    dispath(logOutSuccess());
    toast.success("Logout successfully!");
  } catch (e) {
    dispath(logOutFailure());
  }
};

export const GetUserWithToken = async ({ token }: { token: Token }) => {
  try {
    const res: any = await axiosAuth({
      method: "GET",
      url: "/user",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });
    return res;
  } catch (e) {
    toast.error("Token not match!");
  }
};
