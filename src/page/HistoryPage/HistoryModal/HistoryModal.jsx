import "./HistoryModal.scss";

import { useEffect, useState } from "react";
import api from "api";
import {
  Button,
  Modal,
  DatePicker,
  FlexboxGrid,
  Loader,
  useToaster,
  Message,
} from "rsuite";
import ImagePicker from "~/component/ImagePicker/ImagePicker";

import { useDispatch, useSelector } from "react-redux";
import { GetAllHistoriesAction } from "~/redux/HistoryReducer";

const ControlRow = ({ label, control, ...rest }) => (
  <FlexboxGrid {...rest} style={{ marginBottom: 10 }} align="middle">
    <FlexboxGrid.Item colspan={10}>{label}: </FlexboxGrid.Item>
    <FlexboxGrid.Item
      colspan={14}
      style={{ display: "flex", justifyContent: "flex-end" }}
    >
      {control}
    </FlexboxGrid.Item>
  </FlexboxGrid>
);

const defaultForm = {
  date: null,
  clothes: [],
};

function areDatesEqual(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

const HistoryModal = ({ onClose, open }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [formValue, setFormValue] = useState(defaultForm);
  const fashions = useSelector((state) => state.Fashions);
  const histories = useSelector((state) => state.Histories);
  const toaster = useToaster();

  const isExistDate = (date) => {
    const checkExist = histories.find((h) =>
      areDatesEqual(date, new Date(h.date))
    );
    return checkExist ? true : false;
  };

  useEffect(() => {
    const n = new Date();
    n.setHours(1, 1, 1);
    if (!isExistDate(n)) {
      setFormValue((prev) => ({ ...prev, date: n }));
    }
  }, []);

  const selectClothes = (v) =>
    setFormValue((prev) => ({ ...prev, clothes: v }));

  const changeDate = (v) => {
    v.setHours(1, 1, 1);
    setFormValue((prev) => ({ ...prev, date: v }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!loading) {
        if (formValue.date && formValue.clothes.length > 0) {
          const { data } = await api.post("/history", formValue);
          dispatch(GetAllHistoriesAction(data));
          setFormValue(defaultForm);
          onClose();
        } else {
          toaster.push(
            <Message showIcon type="warning">
              Vui lòng điền đầy đủ
            </Message>,
            { duration: 2000 }
          );
        }
      }
    } catch (error) {
      console.log(error);
      toaster.push(
        <Message showIcon type="error">
          {error.response.data}
        </Message>,
        { duration: 2000 }
      );
    }
    setLoading(false);
  };

  const fashionsOption = fashions.map((f) => ({
    name: f.name,
    image: f.image,
    value: f._id,
    category: f.category,
  }));

  return (
    <Modal
      size="calc(100% - 2rem)"
      open={open}
      onClose={onClose}
      className={`fashion-modal ${loading ? "no-events" : ""}`}
    >
      <Modal.Header>
        <Modal.Title>Lịch sử mặc</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "unset", overflow: "unset" }}>
        <ControlRow
          label="Ngày"
          control={
            <DatePicker
              oneTap
              placement="bottomEnd"
              format="dd/MM/yyyy"
              value={formValue.date}
              onChange={changeDate}
              shouldDisableDate={(date) => isExistDate(date)}
            />
          }
        />
        <FlexboxGrid style={{ alignItems: "center" }}>
          <FlexboxGrid.Item colspan={18} style={{ marginBottom: 10 }}>
            Trang phục:
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={24}>
            <ImagePicker
              data={fashionsOption}
              onChange={selectClothes}
              value={formValue.clothes}
            />
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Modal.Body>
      <Modal.Footer>
        {loading ? (
          <Loader />
        ) : (
          <Button onClick={handleSubmit} appearance="primary">
            Thêm
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default HistoryModal;
