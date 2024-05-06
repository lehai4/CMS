import { Table, TableColumnsType } from "antd";

const TableList = ({
  dataSource,
  columns,
}: {
  dataSource: any[];
  columns: TableColumnsType<any>;
}) => {
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      scroll={{ x: "max-content" }}
      className="shadow-lg rounded mt-4 "
    />
  );
};

export default TableList;
