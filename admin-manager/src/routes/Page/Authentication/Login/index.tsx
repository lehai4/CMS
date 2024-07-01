import Helmet from "@/components/Helmet";
import { useAppDispatch } from "@/hook/useHookRedux";
import { signInUser } from "@/redux/api";
import { Button, Form, Input, Typography, type FormProps } from "antd";
import { Link, useNavigate } from "react-router-dom";

type FieldType = {
  email?: string;
  password?: string;
};

const Login = () => {
  const theme = localStorage.getItem("theme");

  const navigate = useNavigate();
  const dispath = useAppDispatch();
  const [form] = Form.useForm();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    await signInUser(
      {
        email: values.email,
        password: values.password,
      },
      dispath,
      navigate
    );
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="border w-3/5 rounded-lg flex flex-col justify-center items-center">
        <Helmet title="Authen/login">
          <></>
        </Helmet>
        <h1
          className={`text-[30px] font-bold pt-8 mb-[30px] ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          Login
        </h1>
        <Form
          form={form}
          name="basic"
          layout="vertical"
          labelCol={{ span: 8 }}
          style={{ width: "100%", padding: "0 50px" }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            name="email"
            label="Email"
            rules={[
              { required: true },
              {
                pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                message: "Email format is incorrect",
              },
              { message: "Please input your email!" },
            ]}
          >
            <Input size="middle" placeholder="Email..." />
          </Form.Item>

          <Form.Item<FieldType>
            name="password"
            label="Password"
            rules={[
              { required: true },
              {
                pattern: /^(?=.*?[0-9])(?=.*?[A-Za-z]).{8,32}$/,
                message:
                  "Password has at least one number, one letter and one special character",
              },
              {
                message: "Please input your password",
              },
            ]}
          >
            <Input.Password size="middle" placeholder="Password..." />
          </Form.Item>

          <Form.Item className=" w-full">
            <Button
              type="primary"
              htmlType="submit"
              size="middle"
              className="w-full"
            >
              Login
            </Button>
          </Form.Item>
          <div className="flex flex-row mb-[30px] justify-center">
            <Typography.Text
              className={`${theme === "dark" ? "text-white" : "text-black"}`}
            >
              Don't have an account?
            </Typography.Text>
            <Link
              to="/auth/register"
              className={`underline hover:underline ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Register
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
