import "./HistoryPage.scss";

import moment from "moment";
import api from "api";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareMinus } from "@fortawesome/free-regular-svg-icons";
import { faShirt, faHeart } from "@fortawesome/free-solid-svg-icons";

import { Button, Message, Modal, useToaster } from "rsuite";

import HistoryModal from "./HistoryModal/HistoryModal";
import HistoryEdit from "./HistoryEdit/HistoryEdit";

import { useDispatch, useSelector } from "react-redux";
import { DeleteHistoryAction } from "../../redux/HistoryReducer";

const formatDate = (date) => {
  // Ngày cần định dạng (có thể thay đổi ngày này để kiểm tra)
  var ngay = moment(date);
  var homNay = moment();
  var homQua = moment().subtract(1, "days");

  // Kiểm tra nếu là ngày hôm nay
  let ngay_dinh_dang;
  if (homNay.isSame(ngay, "day")) {
    ngay_dinh_dang = "Hôm nay";
  } else if (homQua.isSame(ngay, "day")) {
    ngay_dinh_dang = "Hôm qua";
  } else {
    // Danh sách các ngày trong tuần
    var thu_trong_tuan = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"];
    // Lấy tên ngày trong tuần từ đối tượng ngày
    var thu = thu_trong_tuan[ngay.day()];
    // Định dạng ngày theo yêu cầu
    ngay_dinh_dang = thu + ", " + ngay.format("DD/MM/YYYY");
  }
  return ngay_dinh_dang;
};

const ClothesItem = ({
  image = "https://i.pinimg.com/564x/43/68/be/4368be35f084ae89a75475c5ec0d7feb.jpg",
  liked = false,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div className="clothes-item">
      <img onClick={handleOpen} src={image} alt="" />
      {liked && (
        <div className="like-btn">
          <FontAwesomeIcon icon={faHeart} />
        </div>
      )}

      <Modal onClose={handleClose} open={open} size="min(100%, 350px)">
        <Modal.Header></Modal.Header>
        <img src={image} alt="" style={{ width: "100%" }} />
      </Modal>
    </div>
  );
};

const HistoryItem = (h) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [remove, setRemove] = useState(false);
  const openRemove = () => setRemove(true);
  const closeRemove = () => setRemove(false);

  const toaster = useToaster();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      await api.delete(`/history/${h._id}`);
      toaster.push(
        <Message showIcon type="success">
          Đã xóa
        </Message>,
        {
          duration: 1500,
        }
      );
      dispatch(DeleteHistoryAction(h._id));
    } catch (error) {
      console.log(error);
    }
    closeRemove();
  };

  return (
    <div className="history-item">
      <div className="history-header">
        <div className="date-title" title="Chỉnh sửa" onClick={handleOpen}>
          <span>{formatDate(h?.date)}</span>
        </div>
        <div className="setting">
          <FontAwesomeIcon
            icon={faSquareMinus}
            onClick={openRemove}
            className="remove-history"
          />
          <Modal open={remove} onClose={closeRemove}>
            <Modal.Body>
              Xác nhận xóa lịch sử ngày{" "}
              <b>{moment(h?.date).format("DD/MM/yyyy")}</b>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={closeRemove}>Hủy</Button>
              <Button onClick={handleDelete} appearance="primary">
                Xác nhận
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        {open && <HistoryEdit onClose={handleClose} open={open} data={h} />}
      </div>
      <div className="clothes-list">
        {h.clothes.map((c) => (
          <ClothesItem key={h.date + c._id} image={c.image} liked={c.liked} />
        ))}
      </div>
    </div>
  );
};

const HistoryPage = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const histories = useSelector((state) => state.Histories);

  function groupByMonth(items) {
    // Tạo một object để lưu trữ các nhóm theo tháng
    const grouped = {};

    items.forEach((item) => {
      // Chuyển đổi date thành dạng 'YYYY-MM' để làm khóa
      const date = new Date(item.date);
      const monthKey = `Tháng ${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")} năm ${date.getFullYear()}`;

      // Nếu khóa này chưa tồn tại trong object, khởi tạo nó với một mảng rỗng
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }

      // Đẩy item vào mảng tương ứng với khóa
      grouped[monthKey].push(item);
    });

    // Chuyển đổi object thành mảng kết quả mong muốn
    return Object.keys(grouped).map((monthKey) => ({
      month: monthKey,
      dates: grouped[monthKey],
    }));
  }

  const historiesgroupByMonth = groupByMonth(histories);

  return (
    <div className="history-page custom-scrollbar">
      {historiesgroupByMonth.map((hg, i) => (
        <div className="histories-month" key={i}>
          <div className="month-title">{hg.month}</div>
          <div className="histories-list">
            {hg.dates.map((h, index) => (
              <HistoryItem key={index} {...h} />
            ))}
          </div>
        </div>
      ))}

      <div className="add-btn" onClick={handleOpen}>
        <FontAwesomeIcon icon={faShirt} />
      </div>

      {open && <HistoryModal open={open} onClose={handleClose}></HistoryModal>}
    </div>
  );
};

export default HistoryPage;
