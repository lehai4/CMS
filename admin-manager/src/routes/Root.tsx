import Helmet from "@/components/Helmet";
import {
  BarsOutlined,
  CloseOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  ProfileOutlined,
  SettingOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Drawer,
  FloatButton,
  Layout,
  Popover,
  Space,
  theme,
} from "antd";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { routerAdmin } from "../MockAPI";
import Logo from "../components/Logo";
import { ThemeContext } from "../hook/useContext";
import { useAppDispatch, useAppSelector } from "../hook/useHookRedux";
import { signOut } from "../redux/api";
const { Header, Content, Sider } = Layout;

const RootDefault = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.login.currentUser);
  const role: any = user?.user?.role;
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const { themeContext, setTheme } = useContext(ThemeContext);
  const [scroll, setScroll] = useState<boolean>(false);

  const [offsetScroll, setOffsetScroll] = useState<number>(window.scrollY);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogOut = async () => {
    await signOut(dispath, navigate, user);
  };
  const showMenu = () => {
    setOpen(true);
  };
  const handleClick = (item: any) => {
    navigate(item.key);
  };

  const onClose = () => {
    setOpen(false);
  };
  const handleScroll = useCallback(
    (e: any) => {
      const window = e.currentTarget;

      if (offsetScroll >= window.scrollY) {
        setScroll(false);
      } else if (offsetScroll <= window.scrollY) {
        setScroll(true);
      }
      setOffsetScroll(window.scrollY);
    },
    [offsetScroll]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      {role === "ADMIN" ? (
        <>
          <Helmet title="Main">
            <></>
          </Helmet>
          <Layout hasSider>
            <Sider
              width={300}
              style={{
                overflow: "auto",
                height: "100vh",
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
              }}
            >
              <div className="demo-logo-vertical" />
              <div className="py-[4rem]">
                <Logo />
              </div>
              <div className="flex flex-col gap-10 px-[18px]">
                {routerAdmin.map((item, i) => (
                  <NavLink
                    key={i}
                    to={`${item.path}`}
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                    }}
                    className={({ isActive }) =>
                      isActive
                        ? "active text-blue-500 "
                        : "hover:text-blue-500 ease-out-in text-white"
                    }
                  >
                    <Space>
                      {item.icon} {item.content}
                    </Space>
                  </NavLink>
                ))}
              </div>
            </Sider>
            <Layout style={{ marginLeft: 300 }}>
              <Header
                style={{ padding: "0 30px", background: colorBgContainer }}
              >
                <div className="flex flex-row items-center justify-between">
                  <Button
                    type="text"
                    icon={
                      collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                    }
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                      width: 64,
                      height: 64,
                    }}
                  />
                  <Popover
                    title="Tool"
                    content={
                      <Space>
                        <Link to="/profile">
                          <Button type="primary" icon={<ProfileOutlined />}>
                            Profile
                          </Button>
                        </Link>
                        <Button
                          type="default"
                          icon={<LogoutOutlined />}
                          onClick={handleLogOut}
                        >
                          LogOut
                        </Button>
                      </Space>
                    }
                    trigger="hover"
                  >
                    <Button icon={<UserOutlined />}>
                      Role: {user?.user?.role}
                    </Button>
                  </Popover>
                </div>
              </Header>
              <Content style={{ margin: "32px 32px", overflow: "initial" }}>
                <div
                  style={{
                    padding: 24,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                  }}
                >
                  <Outlet />
                </div>
              </Content>
            </Layout>
          </Layout>
          <FloatButton.Group
            trigger="click"
            type="primary"
            style={{ left: 24, bottom: 24 }}
            icon={<SettingOutlined />}
          >
            <FloatButton
              onClick={() => {
                themeContext === "dark" ? setTheme("light") : setTheme("dark");
              }}
              icon={
                themeContext === "dark" ? <MoonOutlined /> : <SunOutlined />
              }
            />
          </FloatButton.Group>
        </>
      ) : (
        <>
          <div className="pb-[20px] px-[30px]">
            <div className="container">
              <div
                className={`${!scroll ? "scroll_up" : "scroll_down"}${
                  offsetScroll > 40
                    ? " fixed top-0 left-0 right-0 z-10 bg-white border-b-[0.5px]"
                    : ""
                }`}
              >
                <div className="container">
                  <div className="h-[80px] flex flex-row flex-wrap justify-between items-center gap-5 -mx-[15px]">
                    <h1 className="text-[25px] md:text-[25px] lg:text-[30px] xl:text-[32px] font-bold">
                      Product Detail
                    </h1>
                    <div className="flex flex-row items-center gap-10">
                      <div className="hidden flex-row items-center gap-2 sm:hidden md:flex lg:flex xl:flex">
                        <Avatar size="large" icon={<UserOutlined />} />
                        <Popover
                          title="Tool"
                          content={
                            <Space>
                              <Link to="/profile">
                                <Button
                                  type="primary"
                                  icon={<ProfileOutlined />}
                                >
                                  Profile
                                </Button>
                              </Link>
                              <Button
                                type="default"
                                icon={<LogoutOutlined />}
                                onClick={handleLogOut}
                              >
                                LogOut
                              </Button>
                            </Space>
                          }
                          trigger="hover"
                        >
                          <Button>
                            {user?.user?.name ? user?.user?.name : "Login"}
                          </Button>
                        </Popover>
                      </div>
                      <BarsOutlined
                        className="text-[30px] block sm:block md:hidden lg:hidden xl:hidden"
                        onClick={showMenu}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${offsetScroll > 40 ? "mt-[80px]" : ""}`}>
                <Outlet />
              </div>
            </div>
          </div>
          <Drawer
            placement="right"
            onClose={onClose}
            open={open}
            width={"50%"}
            onClick={(item) => handleClick(item)}
            headerStyle={{ alignSelf: "end", border: "none" }}
            maskStyle={{ background: "rgba(0, 0, 0, 0.6)" }}
            closeIcon={
              <Button
                icon={<CloseOutlined className="text-white" />}
                style={{ backgroundColor: "#FF4A52", borderColor: "#FF4A52" }}
                size="large"
                shape="circle"
              />
            }
          >
            <div className="flex flex-col gap-5 px-[18px]">
              <a href="/" className="text-[16px]">
                Product Detail
              </a>
              <a href="/profile" className="text-[16px]">
                Profile
              </a>
              <Button
                type="default"
                icon={<LogoutOutlined />}
                onClick={handleLogOut}
              >
                LogOut
              </Button>
            </div>
          </Drawer>
        </>
      )}
    </>
  );
};

export default RootDefault;