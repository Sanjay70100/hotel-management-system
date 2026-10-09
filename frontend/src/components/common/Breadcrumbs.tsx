import { Link } from "react-router-dom";

import "./Breadcrumbs.css";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: string;
}

const Breadcrumbs = ({
  items,
  separator = "/",
}: BreadcrumbsProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      className="app-breadcrumbs"
      aria-label="Breadcrumb"
    >
      <ol className="app-breadcrumbs-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="app-breadcrumbs-item"
            >
              {isLast || !item.path ? (
                <span
                  className={
                    isLast
                      ? "app-breadcrumbs-current"
                      : "app-breadcrumbs-text"
                  }
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="app-breadcrumbs-link"
                >
                  {item.label}
                </Link>
              )}

              {!isLast && (
                <span
                  className="app-breadcrumbs-separator"
                  aria-hidden="true"
                >
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;