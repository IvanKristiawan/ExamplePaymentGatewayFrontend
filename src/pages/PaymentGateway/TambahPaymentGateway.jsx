import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { tempUrl, SCRIPT_CLIENT } from "../../contexts/ContextProvider";
import { Colors } from "../../constants/styles";
import { Loader } from "../../components";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Snackbar,
  Alert,
  Paper
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahPaymentGateway = () => {
  const [open, setOpen] = useState(false);
  const [order_id, setOrderId] = useState(
    `${(Math.random() + 1).toString(36).substring(7)}`
  );
  const [gross_amount, setGrossAmount] = useState(1000);
  const [ket, setKet] = useState("");
  const [nama, setNama] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.client = `${SCRIPT_CLIENT}`;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const bayarPaymentGateway = async (e) => {
    e.preventDefault();
    let isFailedValidation =
      order_id.length === 0 ||
      gross_amount.length === 0 ||
      ket.length === 0 ||
      nama.length === 0;

    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        const getSnapToken = await axios.post(`${tempUrl}/order/chargeSnap`, {
          transaction_details: {
            order_id,
            gross_amount
          },
          ket,
          nama
        });

        window.snap.pay(`${getSnapToken.data}`, {
          // Optional
          onSuccess: async (result) => {
            /* You may add your own js here, this is just example */
            await axios.get(`${tempUrl}/order/status/${result.order_id}`);
            navigate("/paymentGateway")
          },
          // Optional
          onPending: async (result) => {
            /* You may add your own js here, this is just example */
            await axios.get(`${tempUrl}/order/status/${result.order_id}`);
            navigate("/paymentGateway")
          },
          // Optional
          onError: async (result) => {
            /* You may add your own js here, this is just example */
            await axios.get(`${tempUrl}/order/status/${result.order_id}`);
            navigate("/paymentGateway")
          }
        });
      } catch (err) {
        alert(err);
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Master</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Tambah Register Penjualan
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={showDataContainer}>
          <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>Payment Id </Typography>
            <TextField
              size="small"
              error={error && order_id.length === 0 && true}
              helperText={
                error && order_id.length === 0 && "Payment Id harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={order_id}
              onChange={(e) => setOrderId(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>Jumlah</Typography>
            <TextField
              type="number"
              size="small"
              error={error && gross_amount.length === 0 && true}
              helperText={
                error && gross_amount.length === 0 && "Jumlah harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={gross_amount}
              onChange={(e) => setGrossAmount(e.target.value.toUpperCase())}
            />
          </Box>
          <Box sx={[showDataWrapper, secondWrapper]}>
            <Typography sx={labelInput}>Keterangan</Typography>
            <TextField
              size="small"
              error={error && ket.length === 0 && true}
              helperText={error && ket.length === 0 && "Ket harus diisi!"}
              id="outlined-basic"
              variant="outlined"
              value={ket}
              onChange={(e) => setKet(e.target.value.toUpperCase())}
            />
            <Typography sx={[labelInput, spacingTop]}>Nama</Typography>
            <TextField
              size="small"
              error={error && nama.length === 0 && true}
              helperText={error && nama.length === 0 && "Nama harus diisi!"}
              id="outlined-basic"
              variant="outlined"
              value={nama}
              onChange={(e) => setNama(e.target.value.toUpperCase())}
            />
          </Box>
        </Box>
        <Box sx={spacingTop}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/paymentGateway")}
            sx={{ marginRight: 2 }}
          >
            {"< Kembali"}
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={bayarPaymentGateway}
          >
            Bayar
          </Button>
        </Box>
      </Paper>
      <Divider sx={spacingTop} />
      {error && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={alertBox}>
            Data belum terisi semua!
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default TambahPaymentGateway;

const container = {
  p: 4
};

const subTitleText = {
  fontWeight: "900"
};

const dividerStyle = {
  mt: 2
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

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};

const labelInput = {
  fontWeight: "600",
  marginLeft: 1
};

const contentContainer = {
  p: 3,
  pt: 1,
  mt: 2,
  backgroundColor: Colors.grey100
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
