import "./FashionEdit.scss";

import { useState } from "react";
import api from "api";

import {
  Input,
  Button,
  Modal,
  DatePicker,
  Uploader,
  FlexboxGrid,
  InputPicker,
  InputNumber,
  Loader,
  useToaster,
  Message,
} from "rsuite";
import CameraRetroIcon from "@rsuite/icons/legacy/CameraRetro";

import { sizeOptions } from "../../../utils/constants";

import { useDispatch } from "react-redux";
import {
  DeleteFashionAction,
  UpdateFashionAction,
} from "~/redux/FashionReducer";

import { toThousands } from "../../../utils/function";

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

const warning = (value) => (
  <Message type="warning">
    Thiếu <strong>{value}</strong>
  </Message>
);

const FashionEdit = ({ onClose, open, categoryList, fashion, _id }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [formValue, setFormValue] = useState({
    ...fashion,
    date: new Date(fashion.date),
  });
  const toaster = useToaster();

  const handleChange = (name, value) => {
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!loading) {
        const { category, name } = formValue;
        if (!category) {
          toaster.push(warning("Danh mục"), {
            placement: "topCenter",
            duration: 2000,
          });
        } else if (!name) {
          toaster.push(warning("Tên"), {
            placement: "topCenter",
            duration: 2000,
          });
        } else {
          const formRequest = new FormData();
          for (let key in formValue) {
            formRequest.append(key, formValue[key]);
          }

          const { data } = await api.put(`/fashion/${_id}`, formRequest);
          dispatch(UpdateFashionAction(data));
          onClose();
          toaster.push(
            <Message showIcon type="success">
              Cập nhật thành công
            </Message>,
            {
              duration: 2000,
            }
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    const confirm = window.confirm(`Chắc chắn xóa?`);
    if (confirm) {
      setLoading(true);
      try {
        await api.delete(`/fashion/${_id}`);
        toaster.push(
          <Message showIcon type="success">
            Đã xóa {fashion?.name}
          </Message>,
          {
            duration: 2000,
          }
        );
        dispatch(DeleteFashionAction(_id));
        onClose();
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  };

  const preview = (image) => {
    return typeof image == "string" ? image : URL.createObjectURL(image);
  };

  const data = categoryList.map((c) => ({ label: c, value: c }));

  return (
    <Modal
      size="calc(100% - 2rem)"
      open={open}
      onClose={onClose}
      className="fashion-modal"
    >
      <Modal.Header>
        <Modal.Title>Chỉnh sửa</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "unset" }}>
        <ControlRow
          label="Danh mục"
          control={
            <InputPicker
              creatable
              style={{ width: 150 }}
              placeholder="Chọn"
              onChange={(value) => handleChange("category", value)}
              value={formValue.category}
              data={data}
              onCreate={(value) => {
                categoryList.push(value);
              }}
            />
          }
        />
        <ControlRow
          label="Tên"
          control={
            <Input
              style={{ width: 150 }}
              placeholder="..."
              onChange={(value) => handleChange("name", value)}
              value={formValue.name}
            />
          }
        />
        <ControlRow
          label="Size"
          control={
            <InputPicker
              style={{ width: 150 }}
              data={sizeOptions.map((s) => ({ label: s, value: s }))}
              onChange={(v) => handleChange("size", v)}
              value={formValue.size}
              cleanable={false}
            />
          }
        />
        <ControlRow
          label="Màu"
          control={
            <Input
              style={{ width: 150 }}
              placeholder="..."
              onChange={(value) => handleChange("color", value)}
              value={formValue.color}
            />
          }
        />
        <ControlRow
          label="Thời điểm mua"
          control={
            <DatePicker
              style={{ width: 150 }}
              oneTap
              format="MM-yyyy"
              placement="auto"
              placeholder="Tháng / Năm"
              onChange={(value) => handleChange("date", value)}
              value={formValue.date}
            />
          }
        />
        <ControlRow
          label="Giá tiền"
          control={
            <InputNumber
              formatter={toThousands}
              placeholder="VNĐ"
              min={0}
              step={1000}
              style={{ width: 150 }}
              onChange={(value) => handleChange("price", value)}
              value={formValue.price}
            />
          }
        />
        <ControlRow
          label="Hình Ảnh"
          control={
            <Uploader
              fileListVisible={false}
              listType="picture-text"
              onUpload={(file) => {
                handleChange("image", file.blobFile);
              }}
              action=""
            >
              <button>
                {formValue.image ? (
                  <img
                    src={preview(formValue.image)}
                    width="100%"
                    height="100%"
                    style={{ borderRadius: 10 }}
                  />
                ) : (
                  <CameraRetroIcon style={{ fontSize: "2rem" }} />
                )}
              </button>
            </Uploader>
          }
        />
      </Modal.Body>
      <Modal.Footer>
        {loading ? (
          <Loader />
        ) : (
          <>
            <Button appearance="ghost" onClick={handleDelete}>
              Xóa
            </Button>
            <Button onClick={handleSubmit} appearance="primary">
              Cập nhật
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default FashionEdit;
