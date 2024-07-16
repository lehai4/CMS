import AxiosJWTInstance from "@/InstanceAxios";
import Helmet from "@/components/Helmet";
import { useAppSelector } from "@/hook/useHookRedux";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Form, Input, type FormProps } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
type FieldType = {
  name?: string;
};
const CreateCategory = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.login.currentUser);

  const axiosAuth = AxiosJWTInstance({ user });
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    await axiosAuth({
      url: `/category`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${user?.accessToken}`,
      },
      data: values,
    })
      .then(() => {
        toast.success("Create Category successfully!");
        navigate("/category");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Helmet title="CreateCategory">
        <></>
      </Helmet>
      <div className="w-full flex flex-row items-center justify-between py-[20px]">
        <Link to="/category">
          <Button size="large" icon={<ArrowLeftOutlined />}>
            Back
          </Button>
        </Link>
      </div>
      <h1 className="text-[40px] font-bold pt-[20px] pb-[30px]">Form Create</h1>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        style={{ width: "50%", padding: "0 40px", margin: "0 45px" }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        className="flex flex-col gap-5 justify-center"
      >
        <div className="flex justify-center items-center gap-[50px]">
          <Form.Item<FieldType>
            name="name"
            rules={[{ required: true }, { message: "Please input category!" }]}
            className="w-full"
          >
            <Input size="large" placeholder="Name..." />
          </Form.Item>
        </div>

        <Form.Item className="flex items-center justify-center ">
          <Button htmlType="reset" className="mx-2" size="large">
            Reset
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="mx-2"
            size="large"
          >
            Create
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateCategory;
