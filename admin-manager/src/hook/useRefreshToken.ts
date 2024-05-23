import axios from "@/lib/axios";

export const useRefreshToken = ({ user }: { user: any }) => {
  const refreshToken = async () => {
    const res = await axios.post("http://localhost:8070/refresh", {
      refreshToken: user?.refreshToken,
    });

    return res.data;
  };
  return refreshToken;
};
