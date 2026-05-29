import { memo, type ComponentType, type ReactNode } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import BaseLayout from "@/layout/base-layout/BaseLayout";
import NotFoundPage from "@/pages/not-found/NotFoundPage";
import PrivateRouter from "@/routes/PrivateRouter";
import { privateRouteList, publicRouteList } from "@/routes/routes-list";

const withLayout = (Element: ComponentType, Layout?: ComponentType<{ children: ReactNode }>) => {
  const pageElement = <Element />;

  if (!Layout) {
    return pageElement;
  }

  return <Layout>{pageElement}</Layout>;
};

function RoutesComponent() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="animate-page-enter motion-reduce:animate-none">
      <Routes location={location}>
        {publicRouteList.map(({ path, title, element: Element, layout }) => (
          <Route key={title || path} path={path} element={withLayout(Element, layout)} />
        ))}

        {privateRouteList.map(({ path, title, element: Element, layout }) => (
          <Route key={title || path} element={<PrivateRouter layout={layout} />}>
            <Route path={path} element={<Element />} />
          </Route>
        ))}

        <Route path="*" element={withLayout(NotFoundPage, BaseLayout)} />
      </Routes>
    </div>
  );
}

export default memo(RoutesComponent);
