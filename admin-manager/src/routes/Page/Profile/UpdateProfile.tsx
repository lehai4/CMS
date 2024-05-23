import AxiosJWTInstance from "@/InstanceAxios";
import Helmet from "@/components/Helmet";
import { useAppDispatch, useAppSelector } from "@/hook/useHookRedux";
import { signOut } from "@/redux/api";
import { Button, Form, FormProps, Input, Space } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeftOutlined } from "@ant-design/icons";

interface FieldType {
  name: string;
  email: string;
  address: string;
  password: string;
  currentPassword: string;
}
const UpdateProfile = () => {
  const [form] = Form.useForm();
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.login.currentUser);
  const role: any = user?.user?.role;

  const axiosAuth = AxiosJWTInstance({ user });

  const [profile, setProfile] = useState<FieldType>();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    await axiosAuth({
      method: "PATCH",
      url: "/user",
      headers: {
        Authorization: `Bearer ${user?.accessToken}`,
      },
      data: values,
    })
      .then(() => {
        toast.success("Update Profile successfully!");
        (async function LogOut() {
          await signOut(dispath, navigate, user);
        })();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  const onFill = () => {
    form.setFieldsValue({
      name: profile?.name,
      email: profile?.email,
      address: profile?.address,
      password: profile?.password,
      currentPassword: profile?.currentPassword,
    });
  };
  useEffect(() => {
    onFill();
  }, [profile]);

  useEffect(() => {
    (async function getProfileUser() {
      await axiosAuth({
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
      <Helmet title="UpdateProfile">
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
          <div className="pt-[25px] pb-[40px] flex justify-center items-center">
            <Form
              labelCol={{ span: 8 }}
              style={{ margin: "0 45px", width: "50%" }}
              onFinish={onFinish}
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
                  name="password"
                  rules={[
                    { required: true },
                    { message: "Please input your password!" },
                  ]}
                  className="w-full"
                >
                  <Input.Password
                    size="large"
                    type="password"
                    placeholder="password..."
                  />
                </Form.Item>
                <Form.Item<FieldType>
                  name="currentPassword"
                  rules={[
                    { required: true },
                    { message: "Please input your currentPassword!" },
                  ]}
                  className="w-full"
                >
                  <Input.Password
                    size="large"
                    type="password"
                    placeholder="currentPassword..."
                  />
                </Form.Item>
              </div>
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
              <Button htmlType="reset" size="large">
                Reset
              </Button>
              <Button type="primary" htmlType="submit" size="large">
                Update
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
