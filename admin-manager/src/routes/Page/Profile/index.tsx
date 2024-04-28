import AxiosJWTInstance from "@/InstanceAxios";
import Helmet from "@/components/Helmet";
import { useAppDispatch, useAppSelector } from "@/hook/useHookRedux";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface FieldType {
  name: string;
  email: string;
  address: string;
  role: string;
}
const Profile = () => {
  const [form] = Form.useForm();
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.login.currentUser);
  const role: any = user?.user?.role;
  const [profile, setProfile] = useState<FieldType>();

  const onFill = () => {
    form.setFieldsValue({
      name: profile?.name,
      email: profile?.email,
      address: profile?.address,
      role: profile?.role,
    });
  };
  useEffect(() => {
    onFill();
  }, [profile]);

  useEffect(() => {
    (async function getProfileUser() {
      await AxiosJWTInstance({ user, dispath })({
        method: "GET",
        url: "/user",
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      })
        .then((response) => {
          setProfile(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    })();
  }, []);
  return (
    <>
      <Helmet title="Profile">
        <></>
      </Helmet>
      <div
        className={`py-[20px] ${role === "ADMIN" ? "px-[30px]" : "-mx-[15px]"}`}
      >
        <Space className=" py-[30px]">
          <Button
            onClick={() => navigate(-1)}
            type="default"
            size="large"
            icon={<ArrowLeftOutlined />}
          >
            Back Home
          </Button>
        </Space>
        <div className="border rounded-md">
          <h1 className="text-[32px] text-center font-semibold py-[20px]">
            Profile
          </h1>
          <div className="pt-[25px] pb-[40px] flex justify-center">
            <Form
              labelCol={{ span: 8 }}
              style={{ margin: "0 45px", width: "50%" }}
              form={form}
              className="flex flex-col gap-5 justify-center"
            >
              <div className="flex justify-center items-center gap-[50px]">
                <Form.Item<FieldType>
                  name="name"
                  rules={[
                    { required: true },
                    { message: "Please input your name!" },
                  ]}
                  className="w-full"
                >
                  <Input size="large" placeholder="Name..." />
                </Form.Item>

                <Form.Item<FieldType>
                  name="email"
                  rules={[
                    { required: true },
                    { message: "Please input your email!" },
                  ]}
                  className="w-full"
                >
                  <Input size="large" type="string" placeholder="Email..." />
                </Form.Item>
              </div>

              <div className="flex justify-center items-center gap-[50px]">
                <Form.Item<FieldType>
                  name="address"
                  rules={[
                    { required: true },
                    { message: "Please input your address!" },
                  ]}
                  className="w-full"
                >
                  <Input size="large" type="string" placeholder="Address..." />
                </Form.Item>

                <Form.Item<FieldType>
                  name="role"
                  rules={[
                    { required: true },
                    { message: "Please input your role!" },
                  ]}
                  className="w-full"
                >
                  <Input size="large" type="string" placeholder="Role..." />
                </Form.Item>
              </div>

              <Link to="/profile/update" className="w-full">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="w-full"
                >
                  Update
                </Button>
              </Link>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
