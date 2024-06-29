import EditIcon from "@rsuite/icons/Edit";
import SingleSourceIcon from "@rsuite/icons/SingleSource";

import NotePage from "~/page/NotePage";
import FileManagerPage from "~/page/FileManagerPage";
import VideoPage from "~/page/VideoPage";

const router_dom = [
   {
      link: "note",
      icon: EditIcon,
      title: "Ghi chú",
      page: NotePage,
   },
   {
      link: "file-manager",
      icon: SingleSourceIcon,
      title: "Quản lý tệp",
      page: FileManagerPage,
   },
   {
      link: "video",
      icon: SingleSourceIcon,
      title: "Video",
      page: VideoPage,
   },
];

export default router_dom;
