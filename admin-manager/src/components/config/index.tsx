import { ConfigProvider, theme } from "antd";

const ConfigProviderTheme = ({
  children,
  config,
  role,
}: {
  children: React.ReactNode;
  config: string;
  role: string;
}) => {
  return (
    <ConfigProvider
      theme={{
        algorithm:
          role === "USER"
            ? theme.defaultAlgorithm
            : role === "ADMIN" && config === "dark"
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ConfigProviderTheme;
