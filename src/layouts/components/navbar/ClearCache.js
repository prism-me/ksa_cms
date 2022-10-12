import React from "react";
import { Button } from "reactstrap";
import axios from "axios";

const ClearCache = () => {
  const removeCache = () => {
    axios
      .get("https://www.pigeonarabia.com/KSA_APIs/public/api/remove_cache")
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          alert(response.data);
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div
      className="mr-auto float-left bookmark-wrapper d-flex align-items-center"
      style={{ padding: "0.7rem 1rem" }}
    >
      <Button className="analyticsBtn" onClick={removeCache}>
        Clear Cache
      </Button>
    </div>
  );
};

export default ClearCache;
