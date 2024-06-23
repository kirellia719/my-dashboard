import "./HistoryEdit.scss";

import { useState } from "react";
import api from "api";
import moment from "moment";

import {
  Button,
  Modal,
  FlexboxGrid,
  Loader,
  useToaster,
  Message,
} from "rsuite";
import ImagePicker from "~/component/ImagePicker/ImagePicker";

import { useDispatch, useSelector } from "react-redux";
import { UpdateHistoryAction } from "~/redux/HistoryReducer";

const HistoryEdit = ({ onClose, open, data }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [formValue, setFormValue] = useState({
    clothes: data.clothes.map((d) => d._id),
  });
  const fashions = useSelector((state) => state.Fashions);
  const toaster = useToaster();

  const selectClothes = (v) =>
    setFormValue((prev) => ({ ...prev, clothes: v }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!loading) {
        if (formValue.clothes.length > 0) {
          const { data: response } = await api.put(
            `/history/${data._id}`,
            formValue
          );
          dispatch(UpdateHistoryAction(response));
          onClose();

          toaster.push(
            <Message showIcon type="success">
              Đã cập nhật
            </Message>,
            { duration: 2000 }
          );
        } else {
          toaster.push(
            <Message showIcon type="warning">
              Không có trang phục
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
        <Modal.Title>
          Ngày {moment(new Date(data.date)).format("DD/MM/yyyy")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "unset", overflow: "unset" }}>
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
            Cập nhật
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default HistoryEdit;
