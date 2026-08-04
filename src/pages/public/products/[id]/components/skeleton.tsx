import { Skeleton } from "@mantine/core";

export default function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton height={35} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Skeleton height={575} />
        </div>
        <div>
          <div className="flex h-full flex-col justify-between gap-16">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Skeleton width={200} height={30} />
                <Skeleton width={100} height={30} />
              </div>
              <Skeleton width="50%" height={20} />
              <Skeleton width="75%" height={20} />
              <Skeleton width="75%" height={20} />
              <div className="flex flex-wrap gap-2">
                <Skeleton width={50} height={20} />
                <Skeleton width={50} height={20} />
                <Skeleton width={50} height={20} />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Skeleton width="20%" height={20} />
              <Skeleton width="90%" height={30} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
