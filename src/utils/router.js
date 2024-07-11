import EditIcon from "@rsuite/icons/Edit";
import SingleSourceIcon from "@rsuite/icons/SingleSource";

import NotePage from "~/page/NotePage";
import FileManagerPage from "~/page/FileManagerPage";
import VideoPage from "~/page/VideoPage";
import MapPage from "~/page/MapPage";

const router_dom = [
   {
      link: "file-manager",
      icon: SingleSourceIcon,
      title: "Quản lý tệp",
      page: FileManagerPage,
   },
   {
      link: "note",
      icon: EditIcon,
      title: "Ghi chú",
      page: NotePage,
   },
   {
      link: "video",
      icon: SingleSourceIcon,
      title: "Video (not)",
      page: VideoPage,
   },
   {
      link: "map",
      icon: SingleSourceIcon,
      title: "Map (not)",
      page: MapPage,
   },
   {
      link: "chat",
      icon: SingleSourceIcon,
      title: "Chat (not)",
      page: VideoPage,
   },
];

export default router_dom;
