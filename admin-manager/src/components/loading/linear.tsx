import { Flex, Progress } from "antd";
import { useEffect, useState } from "react";
const LinearLoading = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <Flex gap="small" vertical className="my-[12px]">
      <Progress status="active" percent={progress} showInfo={false} />
    </Flex>
  );
};

export default LinearLoading;
