"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

function Breadcrumbs() {
  // Get the current pathname from Next.js.
  const path = usePathname();

  // Split the path into individual segments. For example, if the path is
  // "/doc/GOI9VDso86uyQFUIjSaN", then segments will be ["doc", "GOI9VDso86uyQFUIjSaN"].
  const segments = path.split("/");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* The first breadcrumb is always "Home"*/}
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        
        {segments.map((segment, idx) => {
          if (!segment) return null;

          // The href for each breadcrumb is the concatenation of the previous
          // segments. For example, if the current segment is "bar" and the
          // previous segment was "foo", then the href will be "/foo/bar".
          const href = `/${segments.slice(0, idx + 1).join("/")}`;

          // If this is the last segment, then we should render it as a
          // BreadcrumbPage component instead of a BreadcrumbLink. This is
          // because the last segment is the current page, and we don't want
          // the user to be able to click on it and navigate away.
          const isLast = idx === segments.length - 1;

          
          return (
            <Fragment key={idx}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  // If this is the last segment, then render it as a
                  // BreadcrumbPage.
                  <BreadcrumbPage>{segment}</BreadcrumbPage>
                ) : (
                  // Otherwise, render it as a BreadcrumbLink.
                  <BreadcrumbLink href={href}>{segment}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
export default Breadcrumbs;
