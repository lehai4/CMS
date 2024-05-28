import { HeatMapOutlined } from "@ant-design/icons";
import { Typography } from "antd";
const Logo = () => {
  return (
    <div className="flex flex-row justify-center gap-3 text-[30px]">
      <HeatMapOutlined className="text-white" />
      <Typography.Text strong className="text-white text-[30px]">
        Admin
      </Typography.Text>
    </div>
  );
};

export default Logo;
