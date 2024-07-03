import EditIcon from "@rsuite/icons/Edit";
import SingleSourceIcon from "@rsuite/icons/SingleSource";

import NotePage from "~/page/NotePage";
import FileManagerPage from "~/page/FileManagerPage";
import VideoPage from "~/page/VideoPage";
import MapPage from "~/page/MapPage";
import Test from "../component/Test";

const router_dom = [
   {
      link: "test",
      icon: SingleSourceIcon,
      title: "Test",
      page: Test,
   },
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
      link: "video (not)",
      icon: SingleSourceIcon,
      title: "Video",
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
