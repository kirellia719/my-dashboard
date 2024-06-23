import "./StatisticPage.scss";
import { useEffect, useState } from "react";
import moment from "moment";
import api from "api";

import {
  DatePicker,
  FlexboxGrid,
  Input,
  InputGroup,
  Modal,
  SelectPicker,
  Stack,
  Panel,
  InputNumber,
  Timeline,
  DateRangePicker,
  Loader,
} from "rsuite";
const { before } = DateRangePicker;
import SearchIcon from "@rsuite/icons/Search";

function toThousands(value) {
  return (
    (value
      ? `${value}`.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
      : value) + " VNĐ"
  );
}

function chuyenDoiNgay(date) {
  const thu = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];

  // Lấy thông tin về ngày, tháng, năm từ đối số date
  const ngay = date.getDate();
  const thuTrongTuan = thu[date.getDay()];
  const thangTrongNam = `tháng ${date.getMonth() + 1}`;
  const nam = date.getFullYear();

  // Trả về định dạng "Thứ Mấy, ngày X tháng Y năm Z"
  return `${thuTrongTuan}, ngày ${ngay} ${thangTrongNam} năm ${nam}`;
}

const ClothesItem = ({
  image = "https://i.pinimg.com/564x/43/68/be/4368be35f084ae89a75475c5ec0d7feb.jpg",
  histories,
  name,
  price,
  category,
  date,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div className="clothes-item">
      <img onClick={handleOpen} src={image} alt="" />

      <div className="like-btn">{histories.length}</div>

      <Modal onClose={handleClose} open={open} size="min(100%, 360px)">
        <Modal.Header>
          <b>Thống kê</b>
        </Modal.Header>

        <Modal.Body style={{ maxHeight: "unset", overflow: "unset" }}>
          <FlexboxGrid justify="space-between">
            <FlexboxGrid.Item colspan={15}>
              <Stack spacing={8} direction="column" alignItems="flex-start">
                <InputGroup>
                  <InputGroup.Addon>
                    <div>Tên:</div>
                  </InputGroup.Addon>
                  <Input readOnly value={name} />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Addon>
                    <div>Loại:</div>
                  </InputGroup.Addon>
                  <Input value={category} readOnly />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Addon>
                    <div>Giá:</div>
                  </InputGroup.Addon>
                  <InputNumber
                    formatter={toThousands}
                    placeholder="VNĐ"
                    value={price}
                    readOnly
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Addon>
                    <div>Mua:</div>
                  </InputGroup.Addon>
                  <DatePicker
                    value={new Date(date)}
                    format="MM/yyyy"
                    readOnly
                  />
                </InputGroup>
              </Stack>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={8}>
              <img
                src={image}
                style={{
                  width: "100%",
                  aspectRatio: "2/3",
                  objectFit: "cover",
                }}
              />
            </FlexboxGrid.Item>
          </FlexboxGrid>

          <Panel bordered style={{ marginTop: 10 }}>
            <FlexboxGrid justify="space-between" style={{ marginBottom: 10 }}>
              <FlexboxGrid.Item>Lịch sử:</FlexboxGrid.Item>
              <FlexboxGrid.Item>
                <div
                  style={{ color: "dodgerblue", textDecoration: "underline" }}
                >{`${histories.length} lần`}</div>
              </FlexboxGrid.Item>
            </FlexboxGrid>
            <Timeline isItemActive={Timeline.ACTIVE_FIRST}>
              {histories.map((h, i) => (
                <Timeline.Item key={i}>
                  {chuyenDoiNgay(new Date(h))}
                </Timeline.Item>
              ))}
            </Timeline>
          </Panel>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const StatisticPage = () => {
  const [sort, setSort] = useState(1);
  const [clothes, setClothes] = useState([]);
  const [date, setDate] = useState({
    date_start: new Date(moment().subtract(7, "days")),
    date_end: new Date(),
  });

  const [loading, setLoading] = useState(false);

  const setStartDate = (date_start) => {
    date_start.setHours(0, 0, 0);
    let { date_end } = date;
    if (date_end.getTime() - date_start.getTime() < 0) {
      date_end = date_start;
      date_end.setHours(23, 59, 59);
    }
    setDate({ date_start, date_end });
  };

  const setEndDate = (date_end) => {
    date_end.setHours(23, 59, 59);
    let { date_start } = date;
    if (date_end.getTime() - date_start.getTime() < 0) {
      date_start = date_end;
      date_start.setHours(0, 0, 0);
    }
    setDate({ date_start, date_end });
  };

  const fetchStatistic = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/statistic", date);
      setClothes(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    fetchStatistic();
  };

  useEffect(() => {
    fetchStatistic();
  }, []);

  const sortedClothes = clothes.sort(
    (a, b) => (b.histories.length - a.histories.length) * sort
  );

  return (
    <div className="statistic-page">
      <div className="filter-container">
        <div className="filter-box">
          <InputGroup>
            <DatePicker
              format="dd/MM/yyyy"
              oneTap
              placement="auto"
              placeholder="Từ ngày"
              isoWeek
              value={date.date_start}
              onChange={setStartDate}
              className={!date.date_start ? "invalid-custom" : ""}
            />
            <InputGroup.Addon>tới</InputGroup.Addon>
            <DatePicker
              format="dd/MM/yyyy"
              oneTap
              placement="auto"
              placeholder="Ngày"
              isoWeek
              value={date.date_end}
              onChange={setEndDate}
              className={!date.date_end ? "invalid-custom" : ""}
              shouldDisableDate={before(date.date_start)}
            />
            <InputGroup.Addon
              style={{ color: "var(--color-pink)" }}
              onClick={handleSubmit}
            >
              <SearchIcon />
            </InputGroup.Addon>
          </InputGroup>
        </div>
        <div className="filter-box sort-box">
          <label htmlFor="">Xếp theo số lần mặc:</label>
          <SelectPicker
            placement="auto"
            block
            searchable={false}
            placeholder={null}
            data={[
              { label: "Từ cao tới thấp", value: 1 },
              { label: "Từ thấp tới cao", value: -1 },
            ]}
            value={sort}
            onChange={(v) => setSort(v)}
          />
        </div>
      </div>
      <div className="clothes-container">
        <div className="clothes-list">
          {loading ? (
            <Loader />
          ) : (
            <>
              {sortedClothes.map((c, index) => (
                <ClothesItem key={index} {...c} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticPage;
