import AxiosJWTInstance from "@/InstanceAxios";
import Helmet from "@/components/Helmet";
import InfiniteScroll from "@/components/InfiniteScroller";
import { useAppDispatch, useAppSelector } from "@/hook/useHookRedux";
import { AddToCart } from "@/redux/slice/cartSlice";
import { ProductProps } from "@/type";
import {
  HeartIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { Divider, Image, Input, Select, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";
const ProductDetail = () => {
  const user = useAppSelector((state) => state.auth.login.currentUser);
  const cart = useAppSelector((state) => state.cart.cartArr);
  const dispath = useAppDispatch();

  const [query, setQuery] = useState<string>("");
  const [paginate, setPaginate] = useState<any>({
    value: "Show product per page",
    label: "Show product per page",
  });
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [page, setPage] = useState(1);
  const [isHasMore, setIsHasMore] = useState<boolean>(true);

  const handleChangeInputSearch = useDebouncedCallback(async () => {
    const res = await AxiosJWTInstance({ user, dispath })({
      method: "GET",
      url: `/product/?productName=${query}&page=1&offset=${
        paginate.value === "Show product per page" ? 6 : paginate
      }`,
      headers: {
        Authorization: `Berear ${user?.accessToken}`,
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
    (async () => {
      await AxiosJWTInstance({ user, dispath })({
        method: "GET",
        url: `/product${query ? `?productName=${query}&` : `?`}offset=${
          paginate.value === "Show product per page" ? 6 : paginate
        }`,
        headers: {
          Authorization: `Berear ${user?.accessToken}`,
        },
      })
        .then((response) => {
          setProducts([...response.data]);
          response.data.length === 0
            ? setIsHasMore(false)
            : setProducts([...response.data]);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    })();
  }, [paginate]);

  useEffect(() => {
    (async () => {
      await AxiosJWTInstance({ user, dispath })({
        method: "GET",
        url: `/product?page=${page}&offset=${
          paginate.value === "Show product per page" ? 6 : paginate
        }`,
        headers: {
          Authorization: `Berear ${user?.accessToken}`,
        },
      })
        .then((response) => {
          response.data.length === 0
            ? setIsHasMore(false)
            : setProducts([...products, ...response.data]);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    })();
  }, [page]);
  return (
    <div className="py-[20px] px-[30px]">
      <Helmet title="product-detail">
        <></>
      </Helmet>
      <div className="container">
        <Space
          direction="horizontal"
          className="pb-[40px] sm:py-[20px] md:py[20px] lg:py-[20px] xl:py-[20px] flex flex-row gap-5 -mx-[15px]"
        >
          <Space className="flex-wrap">
            <form>
              <Input.Search
                className="flex flex-row items-center py-[20px]"
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
            <Select
              style={{ width: "100%" }}
              size="large"
              allowClear
              placeholder="Select paginate"
              value={paginate}
              onChange={(e) => setPaginate(e)}
              options={[
                {
                  value: "Show product per page",
                  label: "Show product per page",
                },
                { value: "6", label: "6" },
                { value: "8", label: "8" },
                { value: "12", label: "12" },
              ]}
            />
          </Space>
        </Space>
      </div>
      {/* Product Show */}
      <div className="container">
        <InfiniteScroll
          loader={<p className="text-[16px]">Loading...</p>}
          fetchMore={() => setPage((prev) => prev + 1)}
          hasMore={isHasMore}
          endMessage={<p>You have seen it all</p>}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 -mx-[15px] gap-[30px]">
            {products.length > 0 ? (
              products.map((item, i) => (
                <div
                  className="item-card border border-[0.5] rounded-md px-[15px] relative"
                  key={i}
                >
                  <div className="hover:bg-[rgba(0,0,0,0.1)] hover:opacity-90 z-10 opacity-0 duration-200 ease-in transition-all w-full h-full absolute inset-0">
                    <div className="flex flex-row items-center justify-center gap-2 absolute top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2 border border-gray rounded-lg bg-gray-100 p-[15px]">
                      <button
                        className="rounded-md p-2 bg-purple-700 border border-purple-700 hover:bg-sky-500 hover:border-sky-500 duration-200 ease-in transition-all"
                        onClick={() => {
                          toast.info("Temporary close function!");
                        }}
                      >
                        <MagnifyingGlassIcon className="h-5 w-5 text-white" />
                      </button>
                      <button
                        className="rounded-md p-2 bg-purple-700 border border-purple-700 hover:bg-sky-500 hover:border-sky-500 duration-200 ease-in transition-all"
                        onClick={() => {
                          if (cart.length > 0) {
                            return cart.filter((c) => {
                              if (c.id === item.id) {
                                toast.error(
                                  "product already exists in cart. Please select other product"
                                );
                              } else {
                                dispath(
                                  AddToCart({
                                    ...item,
                                    quantity: 1,
                                  })
                                );
                                toast.success("Add Product Successfully!");
                              }
                            });
                          } else if (cart.length === 0) {
                            dispath(
                              AddToCart({
                                ...item,
                                quantity: 1,
                              })
                            );
                            toast.success("Add Product Successfully!");
                          }
                        }}
                      >
                        <ShoppingCartIcon className="h-5 w-5 text-white" />
                      </button>
                      <button className="rounded-md p-2 bg-purple-700 border border-purple-700 hover:bg-sky-500 hover:border-sky-500 duration-200 ease-in transition-all">
                        <HeartIcon className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  </div>
                  <Link
                    to={`/product-detail/${item.urlName}`}
                    className="flex flex-col h-full"
                  >
                    <div className="text-center p-[40px]">
                      <Image
                        preview={false}
                        width={"100%"}
                        height={"100%"}
                        src={
                          item.picture
                            ? `http://${item.picture}`
                            : "https://st4.depositphotos.com/2495409/19919/i/450/depositphotos_199193024-stock-photo-new-product-concept-illustration-isolated.jpg"
                        }
                        alt={item.name}
                      />
                    </div>
                    <div className="content px-[30px] py-[25px] flex-1 flex flex-col justify-end">
                      <div className="flex flex-row items-center justify-between my-[25px] gap-8">
                        <h3 className="font-semibold text-[20px] sm:truncate lg:truncate">
                          {item.name}
                        </h3>
                        <p className="font-semibold flex flex-row items-center text-[20px]">
                          $ <span>{item.basePrice}</span>
                        </p>
                      </div>
                      <Typography.Paragraph
                        className="text-[20px] font-[400] text-gray-500"
                        ellipsis={{ rows: 1 }}
                      >
                        {item.description}
                      </Typography.Paragraph>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <Typography.Text className="text-red-500 px-[16px] text-[25px]">
                No Data!!
                <Divider />
              </Typography.Text>
            )}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ProductDetail;
