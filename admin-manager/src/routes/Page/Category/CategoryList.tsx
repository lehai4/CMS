import AxiosJWTInstance from "@/InstanceAxios";
import Helmet from "@/components/Helmet";
import TableList from "@/components/TableList";
import LinearLoading from "@/components/loading/linear";
import { useAppSelector } from "@/hook/useHookRedux";
import { getAllCategory } from "@/redux/api";
import { Category, DataTypeCategory } from "@/type";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  Popconfirm,
  PopconfirmProps,
  Space,
  TableColumnsType,
  Typography,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";

const CategoryList = () => {
  const user = useAppSelector((state) => state.auth.login.currentUser);

  const axiosAuth = AxiosJWTInstance({ user });
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState(1);
  const [idDelete, setIdDelete] = useState<string>("");

  const [category, setCategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [isHasMore, setIsHasMore] = useState<boolean>(true);

  const confirm: PopconfirmProps["onConfirm"] = async () => {
    try {
      await axiosAuth({
        method: "DELETE",
        url: `/category/${idDelete}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });
      const category = await getAllCategory();
      setCategory(category);
      toast.success("Delete successfully!");
    } catch (e) {
      toast.error("Delete Failed!");
    }
  };

  const cancel: PopconfirmProps["onCancel"] = () => {
    message.error("No Delete");
  };

  const columns: TableColumnsType<DataTypeCategory> = [
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
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (e: DataTypeCategory) => (
        <Space className="gap-4">
          <Link to={`/category/edit/${e.name}`}>
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
            style={{ width: 550 }}
          >
            <Button
              danger
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

  const dataSource: any[] = category?.map((t) => {
    return {
      key: t.id,
      id: t.id,
      name: t.name,
    };
  });

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
      url: `/category${query ? `?categoryName=${query}` : ""}`,
      headers: {
        Authorization: `Berear ${user?.accessToken}`,
      },
    });
    if (res.data.length > 0) {
      Array.isArray(res.data)
        ? setCategory([...res.data])
        : setCategory([{ id: res.data.id, name: res.data.name }]);
      toast.success("Search category is found");
    } else {
      setCategory([]);
      toast.info("No results found!");
    }
  }, 1000);

  useEffect(() => {
    setTimeout(async () => {
      await axiosAuth({
        method: "GET",
        url: `/category?page=${page}&offset=10`,
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      })
        .then((response) => {
          response.data.length === 0
            ? setIsHasMore(false)
            : setCategory([...category, ...response.data]);
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
        url: `/category`,
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      })
        .then((response) => {
          setCategory(response.data);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    })();
  }, []);
  return (
    <>
      <Helmet title="Category-list">
        <></>
      </Helmet>
      <div className="py-[20px] px-[30px]">
        <h1 className="text-[32px] font-semibold">Category List</h1>
        <Space direction="horizontal" className="py-[20px] flex flex-row gap-5">
          <Space className="gap-5">
            <form method="get" action="/category">
              <Input.Search
                className="flex py-[20px]"
                placeholder="Search category..."
                size="large"
                type="search"
                name="categoryName"
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
                Create Category
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
      </div>
    </>
  );
};

export default CategoryList;
