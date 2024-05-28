import React, { useEffect } from "react";

type HelmetProps = {
  title: string;
  children: React.ReactNode;
};
const Helmet = (props: HelmetProps): JSX.Element => {
  document.title = "Admin Management - " + props.title;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return <div>{props.children}</div>;
};

export default Helmet;
