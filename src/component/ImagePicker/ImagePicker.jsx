import "./ImagePicker.scss";

import { Button, FlexboxGrid, Input, InputGroup } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import { useState } from "react";

const ImagePicker = ({ data, value = [], onChange }) => {
  const [search, setSearch] = useState("");

  const handleSelect = (v) => {
    const checkExist = value.find((item) => item === v);
    if (checkExist) {
      const newValue = value.filter((item) => item !== v);
      onChange && onChange(newValue);
    } else {
      onChange && onChange([...value, v]);
    }
  };

  const dataOptions = data.filter(
    (d) => !search || d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ImagePicker">
      <FlexboxGrid style={{ marginBottom: 10 }}>
        <FlexboxGrid.Item colspan={18}>
          <InputGroup inside style={{}}>
            <Input
              value={search}
              onChange={(v) => setSearch(v)}
              placeholder="Search ..."
            />
            <InputGroup.Button>
              <SearchIcon />
            </InputGroup.Button>
          </InputGroup>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={6} style={{ textAlign: "end" }}>
          <Button appearance="link" onClick={() => onChange([])}>
            Clear
          </Button>
        </FlexboxGrid.Item>
      </FlexboxGrid>
      <div className="list-wrapper custom-scrollbar">
        <div className="image-list ">
          {dataOptions.map((option, index) => {
            const findIndex =
              value.findIndex((item) => item === option.value) + 1;
            return (
              <div
                className={`image-item ${findIndex ? "active" : ""}`}
                onClick={() => handleSelect(option.value)}
                key={index}
              >
                <img src={option.image} alt="" />
                {findIndex ? (
                  <div className="image-number">{findIndex}</div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ImagePicker;
