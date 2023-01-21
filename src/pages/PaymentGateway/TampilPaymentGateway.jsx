import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { tempUrl, useStateContext } from "../../contexts/ContextProvider";
import { ShowTablePaymentGateway } from "../../components/ShowTable";
import {
  SearchBar,
  Loader,
  usePagination,
  ButtonModifier
} from "../../components";
import { FetchErrorHandling } from "../../components/FetchErrorHandling";
import { Box, TextField, Typography, Divider, Pagination } from "@mui/material";

const TampilPaymentGateway = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [ket, setKet] = useState("");
  const [nama, setNama] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [bank, setBank] = useState("");
  const [grossAmount, setGrossAmount] = useState("");
  const [vaNumber, setVaNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentGatewaysData, setPaymentGatewaysData] = useState([]);
  const navigate = useNavigate();
  let isRegisterExist = paymentId.length !== 0;

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = paymentGatewaysData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val._id.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.ket.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.nama.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.response_midtrans.transaction_status
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.response_midtrans.gross_amount
        .toUpperCase()
        .includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(paymentGatewaysData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getPaymentGatewaysData();
    id && getPaymentGatewayById();
  }, [id]);

  const getPaymentGatewaysData = async () => {
    setLoading(true);
    try {
      const allPaymentGateway = await axios.get(`${tempUrl}/order`);
      setPaymentGatewaysData(allPaymentGateway.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getPaymentGatewayById = async () => {
    if (id) {
      const pickedPaymentGateway = await axios.get(
        `${tempUrl}/order/status/${id}`
      );
      setPaymentId(pickedPaymentGateway.data._id);
      setKet(pickedPaymentGateway.data.ket);
      setNama(pickedPaymentGateway.data.nama);
      setTransactionStatus(
        pickedPaymentGateway.data.response_midtrans.transaction_status
      );
      setGrossAmount(pickedPaymentGateway.data.response_midtrans.gross_amount);
    }
  };

  const deletePaymentGateway = async (id) => {
    try {
      setLoading(true);
      await axios.post(`${tempUrl}/order/delete/${id}`);
      setPaymentId("");
      setKet("");
      setNama("");
      setTransactionStatus("");
      setGrossAmount("");
      setLoading(false);
      navigate("/paymentGateway");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Payment Gateway</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Payment Gateway
      </Typography>
      {transactionStatus === "pending" ? (
        <Box sx={buttonModifierContainer}>
          <ButtonModifier
            id={id}
            kode={paymentId}
            addLink={`/paymentGateway/tambahPaymentGateway`}
            editLink={`/paymentGateway/${id}/edit`}
            deleteUser={deletePaymentGateway}
            nameUser={paymentId}
          />
        </Box>
      ) : (
        <Box sx={buttonModifierContainer}>
          <ButtonModifier
            id={id}
            kode={paymentId}
            addLink={`/paymentGateway/tambahPaymentGateway`}
            editLink={``}
            nameUser={paymentId}
          />
        </Box>
      )}
      {isRegisterExist && (
        <>
          <Divider sx={dividerStyle} />
          <Box sx={showDataContainer}>
            <Box sx={showDataWrapper}>
              <Typography sx={labelInput}>Payment Id</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={paymentId}
              />
              <Typography sx={[labelInput, spacingTop]}>Keterangan</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={ket}
              />
              <Typography sx={[labelInput, spacingTop]}>Nama</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={nama}
              />
            </Box>
            <Box sx={[showDataWrapper, secondWrapper]}>
              <Typography sx={labelInput}>Status Traksaksi</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={transactionStatus}
              />
              <Typography sx={[labelInput, spacingTop]}>Jumlah</Typography>
              <TextField
                size="small"
                id="outlined-basic"
                variant="filled"
                InputProps={{
                  readOnly: true
                }}
                value={grossAmount}
              />
            </Box>
          </Box>
        </>
      )}
      <Divider sx={dividerStyle} />
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTablePaymentGateway
          currentPosts={currentPosts}
          searchTerm={searchTerm}
        />
      </Box>
      <Box sx={tableContainer}>
        <Pagination
          count={count}
          page={page}
          onChange={handleChange}
          color="primary"
          size={screenSize <= 600 ? "small" : "large"}
        />
      </Box>
    </Box>
  );
};

export default TampilPaymentGateway;

const container = {
  p: 4
};

const subTitleText = {
  fontWeight: "900"
};

const buttonModifierContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};

const dividerStyle = {
  pt: 4
};

const showDataContainer = {
  mt: 4,
  display: "flex",
  flexDirection: {
    xs: "column",
    sm: "row"
  }
};

const showDataWrapper = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  maxWidth: {
    md: "40vw"
  }
};

const searchBarContainer = {
  pt: 6,
  display: "flex",
  justifyContent: "center"
};

const tableContainer = {
  pt: 4,
  display: "flex",
  justifyContent: "center"
};

const labelInput = {
  fontWeight: "600",
  marginLeft: 1
};

const spacingTop = {
  mt: 4
};

const secondWrapper = {
  marginLeft: {
    sm: 4
  },
  marginTop: {
    sm: 0,
    xs: 4
  }
};

const downloadButtons = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};
