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
  
  const path = usePathname();

  // Split the path into individual segments. For example, if the path is
  // "/foo/bar", then segments will be ["foo", "bar"].
  const segments = path.split("/");

  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* The first breadcrumb item is always "Home". */}
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        {/* Loop through each segment and create a breadcrumb item. */}
        {segments.map((segment, idx) => {
          // If the segment is empty, then skip it.
          if (!segment) return null;

          // Create the href for the breadcrumb item.
          const href = `/${segments.slice(0, idx + 1).join("/")}`;

          // Determine if the current item is the last one in the list.
          const isLast = idx === segments.length - 1;

          // Return a fragment that contains a separator and the breadcrumb item.
          return (
            <Fragment key={idx}>
              {/* The separator is only shown if this is not the first item. */}
              <BreadcrumbSeparator />

              {/* Create the breadcrumb item. */}
              <BreadcrumbItem>
                {/* If this is the last item in the list, then make it a page
                item (i.e. not a link). */}
                {isLast ? (
                  <BreadcrumbPage>{segment}</BreadcrumbPage>
                ) : (
                  {/* Otherwise, make it a link. */}
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
