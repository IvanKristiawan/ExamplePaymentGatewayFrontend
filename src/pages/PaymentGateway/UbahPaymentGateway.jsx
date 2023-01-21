import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import EditIcon from "@mui/icons-material/Edit";

const UbahPaymentGateway = () => {
  const [open, setOpen] = useState(false);
  const [new_order_id, setNewOrderId] = useState(
    `${(Math.random() + 1).toString(36).substring(7)}`
  );
  const [order_id, setOrderId] = useState("");
  const [gross_amount, setGrossAmount] = useState("");
  const [ket, setKet] = useState("");
  const [nama, setNama] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getPaymentGatewayById();

    const script = document.createElement("script");

    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.client = `${SCRIPT_CLIENT}`;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const getPaymentGatewayById = async () => {
    setLoading(true);
    const pickedPaymentGateway = await axios.get(
      `${tempUrl}/order/status/${id}`
    );
    setOrderId(pickedPaymentGateway.data._id);
    setGrossAmount(pickedPaymentGateway.data.response_midtrans.gross_amount);
    setKet(pickedPaymentGateway.data.ket);
    setNama(pickedPaymentGateway.data.nama);
    setLoading(false);
  };

  const bayarUlang = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${tempUrl}/order/delete/${id}`);

      const getSnapToken = await axios.post(`${tempUrl}/order/chargeSnap`, {
        transaction_details: {
          order_id: new_order_id,
          gross_amount: parseInt(gross_amount)
        },
        ket,
        nama
      });

      window.snap.pay(`${getSnapToken.data}`, {
        // Optional
        onSuccess: async (result) => {
          /* You may add your own js here, this is just example */
          await axios.get(`${tempUrl}/order/status/${result.order_id}`);
        },
        // Optional
        onPending: async (result) => {
          /* You may add your own js here, this is just example */
          await axios.get(`${tempUrl}/order/status/${result.order_id}`);
        },
        // Optional
        onError: async (result) => {
          /* You may add your own js here, this is just example */
          await axios.get(`${tempUrl}/order/status/${result.order_id}`);
        }
      });
    } catch (error) {
      alert(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Payment Gateway</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Ubah Payment Gateway
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={showDataContainer}>
          <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>Payment Id</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={order_id}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>Jumlah</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={gross_amount}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
          </Box>
          <Box sx={[showDataWrapper, secondWrapper]}>
            <Typography sx={labelInput}>Keterangan</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={ket}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
            />
            <Typography sx={[labelInput, spacingTop]}>Nama</Typography>
            <TextField
              size="small"
              id="outlined-basic"
              variant="outlined"
              value={nama}
              InputProps={{
                readOnly: true
              }}
              sx={{ backgroundColor: Colors.grey400 }}
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
            startIcon={<EditIcon />}
            onClick={bayarUlang}
          >
            Bayar Ulang
          </Button>
        </Box>
      </Paper>
      <Divider sx={dividerStyle} />
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

export default UbahPaymentGateway;

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
