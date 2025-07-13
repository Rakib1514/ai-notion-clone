"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

function Breadcrumbs() {
  const path = usePathname();

  const segments = path.split("/");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, idx) => {
          if (!segment) return null;

          const href = `/${segments.slice(0, idx + 1).join("/")}`;

          return (
            <Fragment key={idx}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={href}>{segment}</BreadcrumbLink>
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
export default Breadcrumbs;
