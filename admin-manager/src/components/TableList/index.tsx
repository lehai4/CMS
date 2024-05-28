import { Table, TableColumnsType } from "antd";

const TableList = ({
  dataSource,
  columns,
  handleScroll,
}: {
  dataSource: any[];
  columns: TableColumnsType<any>;
  handleScroll?: (e: any) => void;
}) => {
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      scroll={{ x: "max-content", y: 500 }}
      className="shadow-lg rounded"
      onScroll={handleScroll}
    />
  );
};

export default TableList;
