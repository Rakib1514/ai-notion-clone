"use client";

import { db } from "../firebase";
import { doc } from "firebase/firestore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDocumentData } from "react-firebase-hooks/firestore";

function SidebarOption({ href, id }: { href: string; id: string }) {
  // Get the document data for the document with the given id
  const [data] = useDocumentData(doc(db, "documents", id));

  // Get the current path name
  const pathname = usePathname();

  // Check whether the current path name is the same as the href
  // but excluding the root path
  const isActive = href.includes(pathname) && pathname !== "/";

  if (!data) return null;

  return (
    <Link
      href={href}
      className={`relative border p-2 rounded-md text-gray-700 ${
        isActive ? "bg-gray-300 font-bold border-black" : " border-gray-400"
      }`}
    >
      {/* Add a paragraph element with the title of the document and a truncate
      class that will truncate the text if it is too long and add an ellipsis */}
      <p className="truncate">{data.title}</p>
    </Link>
  );
}
export default SidebarOption;
