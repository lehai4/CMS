import React, { useEffect, useRef } from "react";
const InfiniteScroll = ({
  children,
  loader,
  fetchMore,
  hasMore,
  endMessage,
  className,
}: {
  children: React.ReactNode;
  loader: React.ReactElement;
  fetchMore: () => void;
  hasMore: boolean;
  endMessage: React.ReactElement;
  className?: string;
}) => {
  const loaderRef = useRef(null);

  useEffect(() => {
    if (hasMore) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchMore();
          }
        },
        { threshold: 1 }
      );
      if (loaderRef.current) {
        observer.observe(loaderRef.current);
      }
      return () => {
        if (loaderRef.current) {
          observer.unobserve(loaderRef.current);
        }
      };
    }
  }, [hasMore]);
  return (
    <div className={className}>
      {children}

      {hasMore ? <div ref={loaderRef}>{loader}</div> : endMessage}
    </div>
  );
};

export default InfiniteScroll;
