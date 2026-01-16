import { Outlet, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function Changer() {
  const { pathname } = useLocation();

  let title = "Tullu Dimtu Secondary School";

  if (pathname === "/") title = "Home";
  else if (pathname.startsWith("/about/chairman-welcome"))
    title = "Chairman’s Welcome";
  else if (pathname.startsWith("/about/mission-vision"))
    title = "Mission & Vision";
  else if (pathname.startsWith("/contact"))
    title = "Contact";
  else if (pathname.startsWith("/ourschool/overview"))
    title = "School Overview";
  else if (pathname.startsWith("/about/school-profile"))
    title = "School Profile";
  else if (pathname.startsWith("/ourschool/sport"))
    title = "Sports";
  else if (pathname.startsWith("/students/council"))
    title = "Student Council";

  return (
    <>
      <Helmet>
        <title>{title} | Tullu Dimtu Secondary School</title>
      </Helmet>

      <Outlet />
    </>
  );
}

export default Changer;
