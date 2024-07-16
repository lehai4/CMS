import AxiosJWTInstance from "@/InstanceAxios";
import Helmet from "@/components/Helmet";
import TableList from "@/components/TableList";
import LinearLoading from "@/components/loading/linear";
import { useAppSelector } from "@/hook/useHookRedux";
import { getProduct } from "@/redux/api";
import { DataType, ProductProps } from "@/type";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Image,
  Input,
  Modal,
  Popconfirm,
  PopconfirmProps,
  Space,
  TableColumnsType,
  Typography,
  message,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";
const ProductList = () => {
  const user = useAppSelector((state) => state.auth.login.currentUser);
  const axiosAuth = AxiosJWTInstance({ user });

  const inputFile = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState<string>("");
  const [image, setImage] = useState<any>(null);
  const [id, setId] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [idDelete, setIdDelete] = useState<string>("");

  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isHasMore, setIsHasMore] = useState<boolean>(true);
  const [page, setPage] = useState(1);

  const confirm: PopconfirmProps["onConfirm"] = async () => {
    try {
      await axiosAuth({
        method: "DELETE",
        url: `/product/${idDelete}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });
      const product = await getProduct();
      setProducts(product);
      toast.success("Delete successfully!");
    } catch (e) {
      toast.error("Delete Failed!");
    }
  };

  const cancel: PopconfirmProps["onCancel"] = () => {
    message.error("No Delete");
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "Picture",
      render: (e: DataType) => (
        <Image
          src={
            e.picture
              ? `http://${e.picture}`
              : "https://st4.depositphotos.com/2495409/19919/i/450/depositphotos_199193024-stock-photo-new-product-concept-illustration-isolated.jpg"
          }
          alt="picture"
          width={60}
          height={60}
          preview={false}
          onClick={() => {
            setModalOpen(true);
            setId(e.id);
          }}
          className="w-[60px] h-[60px]"
        />
      ),
    },
    {
      title: "Id",
      dataIndex: "id",
      render: (id: string) => (
        <Typography.Text className="text-[16px]">{id}</Typography.Text>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (name: string) => (
        <Typography.Text className="text-[16px]">{name}</Typography.Text>
      ),
    },
    {
      title: "PriceBase",
      dataIndex: "priceBase",
      render: (priceBase: string) => (
        <Typography.Text className="text-[16px]">{priceBase}</Typography.Text>
      ),
      width: 110,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      render: (stock: number) => (
        <Typography.Text className="text-[16px]">{stock}</Typography.Text>
      ),
      width: 80,
    },
    {
      title: "DiscountPercentage",
      dataIndex: "discountPercentage",
      render: (discountPercentage: number) => (
        <Typography.Text className="text-[16px]">
          {discountPercentage}
        </Typography.Text>
      ),
      width: 180,
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (e: DataType) => (
        <Space className="gap-4">
          <Link to={`/product-list/edit/${e.urlName}`}>
            <Button type="primary" icon={<EditOutlined />} size="large">
              Edit
            </Button>
          </Link>
          <Popconfirm
            title="Delete"
            description={`You are sure delete "${e.name}" ?`}
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              size="large"
              icon={<DeleteOutlined />}
              onClick={() => setIdDelete(e.id)}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const dataSource: any[] = products?.map((t) => {
    return {
      key: t.id,
      id: t.id,
      name: t.name,
      picture: t.picture,
      priceBase: t.basePrice,
      stock: t.stock,
      urlName: t.urlName,
      discountPercentage: t.discountPercentage,
    };
  });

  const handleChangeImage = (event: any) => {
    const file = event.target.files?.[0];
    if (file.size > 3 * 1024 * 1024) {
      alert("Kích thước ảnh vượt quá 3MB.");
      return;
    } else {
      setImage(file);
    }
  };

  const onUpload = async () => {
    if (!image) {
      toast.error("Please choose image for upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    await axiosAuth({
      url: `/product/picture/${id}`,
      method: "PATCH",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${user?.accessToken}`,
      },
      data: formData,
    })
      .then(async () => {
        setModalOpen(false);
        toast.success("Change image successfully");
        await axiosAuth({
          method: "GET",
          url: `/product`,
          headers: {
            Authorization: `Berear ${user?.accessToken}`,
          },
        })
          .then((response) => {
            setProducts(response.data);
          })
          .catch((error) => {
            toast.error(error.message);
          });
      })
      .catch((error) => {
        toast.error(error.message);
      });
    if (inputFile.current) {
      inputFile.current.value = "";
    }
    setImage(null);
  };

  const onScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (scrollTop + clientHeight === scrollHeight && isHasMore) {
      setLoading(true);
      setPage((prev) => prev + 1);
    }
  };

  const handleChangeInputSearch = useDebouncedCallback(async () => {
    const res = await axiosAuth({
      method: "GET",
      url: `/product${query ? `?productName=${query}` : ""}`,
      headers: {
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });
    if (res.data.length > 0) {
      setProducts(res.data);
      toast.info("results found!");
    } else {
      setProducts([]);
      toast.info("No results found!");
    }
  }, 1000);

  useEffect(() => {
    setTimeout(async () => {
      await axiosAuth({
        method: "GET",
        url: `/product?page=${page}&offset=10`,
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      })
        .then((response) => {
          response.data.length === 0
            ? setIsHasMore(false)
            : setProducts([...products, ...response.data]);
          setLoading(false);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }, 3000);
  }, [page]);

  useEffect(() => {
    (async () => {
      await axiosAuth({
        method: "GET",
        url: `/product`,
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      })
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    })();
  }, []);

  return (
    <>
      <Helmet title="ProductList">
        <></>
      </Helmet>
      <div className="py-[20px] px-[30px] h-[100%]">
        <h1 className="text-[32px] font-semibold">Product List</h1>
        <Space direction="horizontal" className="py-[20px] flex flex-row gap-5">
          <Space className="gap-5">
            <form>
              <Input.Search
                className="flex py-[20px]"
                placeholder="Search product..."
                size="large"
                type="search"
                name="productName"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  e.preventDefault();
                  handleChangeInputSearch();
                }}
              />
            </form>
            <Link to="create">
              <Button type="primary" className="bg-blue-500" size="large">
                Create Product
              </Button>
            </Link>
          </Space>
        </Space>
        <div className="py-[25px]">
          <TableList
            columns={columns}
            dataSource={dataSource}
            handleScroll={onScroll}
          />
          {loading && <LinearLoading />}
        </div>
        <Modal
          title="Change Picture of product"
          centered
          open={modalOpen}
          okText="Upload"
          onOk={onUpload}
          onCancel={() => {
            if (inputFile.current) {
              inputFile.current.value = "";
            }
            setImage(null);
            setModalOpen(false);
          }}
        >
          <Space direction="vertical">
            <input
              accept="image/*"
              onClick={() => {
                if (inputFile.current) {
                  inputFile.current.value = "";
                }
              }}
              type="file"
              ref={inputFile}
              onChange={handleChangeImage}
            />
            <Space direction="vertical" className="mt-[20px]">
              {image && (
                <>
                  <Image
                    src={URL.createObjectURL(image)}
                    width={"100%"}
                    height={"100%"}
                  />
                  <Button
                    onClick={() => {
                      setImage(null);
                      if (inputFile.current) {
                        inputFile.current.value = "";
                      }
                    }}
                    danger
                  >
                    Delete Image
                  </Button>
                </>
              )}
            </Space>
          </Space>
        </Modal>
      </div>
    </>
  );
};

export default ProductList;
