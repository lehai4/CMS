import {
  HomeOutlined,
  MergeCellsOutlined,
  ProductOutlined,
  ReadOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";

export const routerAdmin = [
  {
    id: 0,
    path: "/",
    content: "Home",
    icon: <HomeOutlined />,
  },
  {
    id: 1,
    path: "/product-list",
    content: "Product List",
    icon: <ProductOutlined />,
  },
  {
    id: 2,
    path: "/category",
    content: "Category",
    icon: <MergeCellsOutlined />,
  },
  {
    id: 3,
    path: "/purchase",
    content: "Purchase",
    icon: <AppstoreAddOutlined />,
  },
];
export const routerUser = [
  {
    id: 0,
    path: "/",
    content: "Home",
    icon: <HomeOutlined />,
  },
  {
    id: 1,
    path: "/product-detail",
    content: "Product Detail",
    icon: <ReadOutlined />,
  },
];
