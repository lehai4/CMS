import { useEffect } from "react";
import { axiosAuth } from "@/lib/axios";
import { useAppDispatch } from "@/hook/useHookRedux";
import { signInSuccess } from "@/redux/slice/authSlice";
import { useRefreshToken } from "@/hook/useRefreshToken";

export const AxiosJWTInstance = ({ user }: { user: any }) => {
  const dispatch = useAppDispatch();
  const refreshToken = useRefreshToken({ user });
  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${user?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosAuth.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;

          const res = await refreshToken();
          const newUserRefreshToken = {
            ...user,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          };
          dispatch(signInSuccess(newUserRefreshToken));

          prevRequest.headers["Authorization"] = `Bearer ${res.accessToken}`;
          return axiosAuth(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, [user]);

  return axiosAuth;
};

export default AxiosJWTInstance;
