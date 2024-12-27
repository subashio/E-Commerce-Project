import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

type DashboardBreadcrumbProps = {
  path: string;
  isAdd?: boolean;
  isEdit?: boolean;
  pathName: string;
};
export default function DashboardBreadcrumb({
  pathName,
  path,
  isAdd,
  isEdit,
}: DashboardBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard-page" className="font-medium">
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink
            href={`/dashboard-page/${path}`}
            className="font-medium"
          >
            {pathName}
          </BreadcrumbLink>
        </BreadcrumbItem>
        {isAdd && (
          <>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink>Add {pathName}</BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
        {isEdit && (
          <>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink>Edit {pathName}</BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
