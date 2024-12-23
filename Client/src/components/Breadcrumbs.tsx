import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

type DashboardBreadcrumbProps = {
  path: string;
  path2?: string;
  pathName2?: string;
  finalPathName?: string;
  className?: string;
  pathName?: string;
};
export default function Breadcrumbs({
  pathName,
  path,
  path2,
  pathName2,
  finalPathName,
  className,
}: DashboardBreadcrumbProps) {
  return (
    <Breadcrumb className={cn("text-md font-medium", className)}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink href={path} className="">
            <BreadcrumbSeparator>/ {pathName}</BreadcrumbSeparator>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {path2 && (
          <BreadcrumbItem>
            <BreadcrumbLink href={path2} className="">
              <BreadcrumbSeparator> {pathName2}</BreadcrumbSeparator>
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}
        <>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <BreadcrumbSeparator className="max-w-44 truncate">
                {" "}
                {finalPathName}
              </BreadcrumbSeparator>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
