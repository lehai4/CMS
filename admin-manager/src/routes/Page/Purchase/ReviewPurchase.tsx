import AxiosJWTInstance from "@/InstanceAxios";
import Helmet from "@/components/Helmet";
import { useAppSelector } from "@/hook/useHookRedux";
import { Purchase } from "@/type";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ReviewPurchase = () => {
  const params = useParams();
  const [form] = Form.useForm();
  const user = useAppSelector((state) => state.auth.login.currentUser);
  const axiosAuth = AxiosJWTInstance({ user });

  const [purchase, setPurchase] = useState<Purchase>();

  const onFill = () => {
    form.setFieldsValue({
      ...purchase,
      user: purchase?.user.email,
      product: purchase?.product.name,
      reviewNote:
        purchase?.reviewNote === null ? "No review note" : purchase?.reviewNote,
      reviewComment:
        purchase?.reviewComment === null
          ? "No review note"
          : purchase?.reviewComment,
    });
  };
  useEffect(() => {
    onFill();
  }, [purchase]);

  useEffect(() => {
    (async () => {
      await axiosAuth({
        method: "GET",
        url: `/purchase/${params.id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken}`,
        },
      })
        .then((response) => {
          setPurchase(response.data);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    })();
  }, []);
  return (
    <div className="px-[40px] h-full flex flex-col items-center justify-center">
      <Helmet title="Review Purchase">
        <></>
      </Helmet>
      <div className="w-full flex flex-row items-center justify-between py-[20px]">
        <Link to="/purchase">
          <Button size="large" icon={<ArrowLeftOutlined />}>
            Back
          </Button>
        </Link>
      </div>
      <h1 className="text-[40px] font-bold pt-[20px] pb-[30px]">
        Review Purchase
      </h1>

      <Form
        style={{ width: "100%", margin: "0 45px" }}
        initialValues={{ purchase }}
        onFinish={() => {}}
        layout="vertical"
        form={form}
        className="flex flex-col gap-5 justify-center"
      >
        <div className="flex justify-center items-center gap-[50px]">
          <Form.Item<Purchase> name="id" label="Id" className="w-full">
            <Input size="large" />
          </Form.Item>

          <Form.Item<Purchase> name="userId" label="User ID" className="w-full">
            <Input size="large" />
          </Form.Item>
        </div>

        <div className="flex justify-center items-center gap-[50px]">
          <Form.Item<Purchase>
            name="productId"
            label="Product ID"
            className="w-full"
          >
            <Input size="large" type="string" />
          </Form.Item>

          <Form.Item<Purchase>
            name="createdAt"
            label="Date Create"
            className="w-full"
          >
            <Input size="large" />
          </Form.Item>
        </div>
        <div className="flex justify-center items-center gap-[50px]">
          <Form.Item<Purchase>
            name="totalPrice"
            label="Total Price"
            className="w-full"
          >
            <Input size="large" type="string" />
          </Form.Item>

          <Form.Item<Purchase> name="amount" label="Amount" className="w-full">
            <Input size="large" />
          </Form.Item>
        </div>

        <div className="flex justify-center items-center gap-[50px]">
          <Form.Item<Purchase>
            name="reviewNote"
            label="Review Note"
            className="w-full"
          >
            <Input size="large" type="string" />
          </Form.Item>

          <Form.Item<Purchase>
            name="reviewComment"
            label="Review Comment"
            className="w-full"
          >
            <Input size="large" />
          </Form.Item>
        </div>
        <div className="flex justify-center items-center gap-[50px]">
          <Form.Item<Purchase> name="user" label="User" className="w-full">
            <Input size="large" type="string" />
          </Form.Item>

          <Form.Item<Purchase>
            name="product"
            label="Product"
            className="w-full"
          >
            <Input size="large" />
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default ReviewPurchase;
