import { ConfigProvider, theme } from "antd";

const ConfigProviderTheme = ({
  children,
  config,
}: {
  children: React.ReactNode;
  config: string;
}) => {
  return (
    <ConfigProvider
      theme={{
        algorithm:
          config === "light" ? theme.defaultAlgorithm : theme.darkAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ConfigProviderTheme;
