import EditIcon from "@rsuite/icons/Edit";

import NotePage from "~/page/NotePage";
import FashionPage from "~/page/FashionPage";

const router_dom = [
   {
      link: "note",
      icon: EditIcon,
      title: "Ghi chú",
      page: NotePage,
   },
   {
      link: "fashion",
      icon: EditIcon,
      title: "Thời trang",
      page: FashionPage,
   },
];

export default router_dom;
