import Helmet from "@/components/Helmet";
import axios from "@/lib/axios";
import { Button, Form, Input, Typography, type FormProps } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type FieldType = {
  email: string;
  password: string;
  name: string;
  address: string;
};

const Register = () => {
  const theme = localStorage.getItem("theme");

  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log(values);
    await axios({ method: "POST", url: "/user", data: values })
      .then(() => {
        toast.success("Register successfully!");
        navigate("/auth/login");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="border w-3/4 rounded-lg flex flex-col justify-center items-center">
        <Helmet title="Authen/register">
          <></>
        </Helmet>
        <h1
          className={`text-[30px] font-bold pt-8 mb-[40px] ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          Register
        </h1>

        <Form
          form={form}
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
            name="name"
            label="Name"
            rules={[
              { required: true },

              {
                message: "Please input your name",
              },
            ]}
          >
            <Input size="middle" placeholder="Name..." />
          </Form.Item>
          <Form.Item<FieldType>
            label="Address"
            name="address"
            rules={[
              { required: true },

              {
                message: "Please input your address",
              },
            ]}
          >
            <Input size="middle" placeholder="Address..." />
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
              Register
            </Button>
          </Form.Item>
          <div className="flex flex-row mb-[30px] justify-center">
            <Typography.Text
              className={`${theme === "dark" ? "text-white" : "text-black"}`}
            >
              You do have an account?
            </Typography.Text>
            <Link
              to="/auth/login"
              className={`underline hover:underline ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Login
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
