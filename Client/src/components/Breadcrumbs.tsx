import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

type DashboardBreadcrumbProps = {
  path: string;
  finalPathName?: string;
  className?: string;
  pathName?: string;
};
export default function Breadcrumbs({
  pathName,
  path,
  finalPathName,
  className,
}: DashboardBreadcrumbProps) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="text-md font-medium">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href={path} className="text-md font-medium">
            {pathName}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>

          <BreadcrumbItem>
            <BreadcrumbLink>{finalPathName}</BreadcrumbLink>
          </BreadcrumbItem>
        </>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
