import "./styles.css";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { Header, ScrollToTop } from "./components";
import {
  Sidebar,
  Menu,
  SubMenu,
  MenuItem,
  useProSidebar
} from "react-pro-sidebar";
import { ErrorBoundary } from "react-error-boundary";
import { Fallback } from "./components/Fallback";
import MenuIcon from "@mui/icons-material/Menu";
import ClassIcon from "@mui/icons-material/Class";
import { Divider, Box, Typography, CssBaseline, Tooltip } from "@mui/material";
import { Colors } from "./constants/styles";
import { useStateContext } from "./contexts/ContextProvider";
import {
  TampilPaymentGateway,
  TambahPaymentGateway,
  UbahPaymentGateway
} from "./pages/index";
// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import "./styles.css";
// import { Box, TextField, Typography } from "@mui/material";

// const tempUrl = "http://localhost:5000";

const App = () => {
  const { collapseSidebar } = useProSidebar();
  const [open, setOpen] = useState(true);

  const openMenuFunction = () => {
    setOpen(!open);
    collapseSidebar();
  };

  // const [order_id, setOrderId] = useState("");
  // const [gross_amount, setGrossAmount] = useState(15000);
  // const [tiket_id, setTiketId] = useState("1");
  // const [nama, setNama] = useState("");
  // const [error, setError] = useState(false);

  // const payButton = async () => {
  //   let isFailedValidation =
  //     order_id.length === 0 ||
  //     gross_amount.length === 0 ||
  //     tiket_id.length === 0 ||
  //     nama.length === 0;

  //   if (isFailedValidation) {
  //     setError(true);
  //   } else {
  //     try {
  //       const getSnapToken = await axios.post(`${tempUrl}/order/chargeSnap`, {
  //         transaction_details: {
  //           order_id,
  //           gross_amount
  //         },
  //         tiket_id,
  //         nama,
  //         finish_redirect_url: "https://djon08.csb.app/"
  //       });

  //       window.snap.pay(`${getSnapToken.data}`, {
  //         // Optional
  //         onSuccess: async (result) => {
  //           /* You may add your own js here, this is just example */
  //           await axios.get(`${tempUrl}/order/status/${result.order_id}`);
  //         },
  //         // Optional
  //         onPending: async (result) => {
  //           /* You may add your own js here, this is just example */
  //           await axios.get(`${tempUrl}/order/status/${result.order_id}`);
  //         },
  //         // Optional
  //         onError: async (result) => {
  //           /* You may add your own js here, this is just example */
  //           await axios.get(`${tempUrl}/order/status/${result.order_id}`);
  //         }
  //       });
  //     } catch (err) {
  //       alert(err);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const script = document.createElement("script");

  //   script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
  //   script.client = "SB-Mid-client-VlDJNCwtA5rF85JD";

  //   document.body.appendChild(script);

  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);

  return (
    <Box>
      <BrowserRouter>
        <CssBaseline />
        <Header />
        <div style={container}>
          <Sidebar backgroundColor={Colors.blue50} collapsedWidth="0px">
            <Menu>
              <SubMenu
                label="Payment Gateway"
                icon={<ClassIcon name="master-icon" />}
              >
                <Link to="/paymentGateway" style={linkText}>
                  <MenuItem>
                    <Typography variant="body2" sx={{ paddingLeft: "70px" }}>
                      Payment Gateway
                    </Typography>
                  </MenuItem>
                </Link>
              </SubMenu>
            </Menu>
          </Sidebar>
          <main>
            <Tooltip title="Menu">
              <MenuIcon
                onClick={() => openMenuFunction()}
                sx={sidebarIcon}
                fontSize="large"
              />
            </Tooltip>
            <Box sx={contentWrapper}>
              <ErrorBoundary FallbackComponent={Fallback}>
                <ScrollToTop />
                <Routes>
                  <Route path="/" />
                  <Route
                    path="/paymentGateway"
                    element={<TampilPaymentGateway />}
                  />
                  <Route
                    path="/paymentGateway/:id"
                    element={<TampilPaymentGateway />}
                  />
                  <Route
                    path="/paymentGateway/:id/edit"
                    element={<UbahPaymentGateway />}
                  />
                  <Route
                    path="/paymentGateway/tambahPaymentGateway"
                    element={<TambahPaymentGateway />}
                  />
                </Routes>
              </ErrorBoundary>
            </Box>
          </main>
        </div>
      </BrowserRouter>
    </Box>
    // <div className="App">
    //   <Box>
    //     <Typography sx={labelInput}>Order Id (*Required)</Typography>
    //     <TextField
    //       size="small"
    //       error={error && order_id.length === 0 && true}
    //       helperText={error && order_id.length === 0 && "Kode harus diisi!"}
    //       id="outlined-basic"
    //       variant="outlined"
    //       value={order_id}
    //       onChange={(e) => setOrderId(e.target.value.toUpperCase())}
    //     />
    //     <Typography sx={labelInput}>Harga (*Required)</Typography>
    //     <TextField
    //       size="small"
    //       error={error && gross_amount.length === 0 && true}
    //       helperText={error && gross_amount.length === 0 && "Kode harus diisi!"}
    //       id="outlined-basic"
    //       variant="outlined"
    //       value={gross_amount}
    //       onChange={(e) => setGrossAmount(e.target.value.toUpperCase())}
    //     />
    //     <Typography sx={labelInput}>Tiket Id</Typography>
    //     <TextField
    //       size="small"
    //       error={error && tiket_id.length === 0 && true}
    //       helperText={error && tiket_id.length === 0 && "Kode harus diisi!"}
    //       id="outlined-basic"
    //       variant="outlined"
    //       value={tiket_id}
    //       onChange={(e) => setTiketId(e.target.value.toUpperCase())}
    //     />
    //     <Typography sx={labelInput}>Nama</Typography>
    //     <TextField
    //       size="small"
    //       error={error && nama.length === 0 && true}
    //       helperText={error && nama.length === 0 && "Kode harus diisi!"}
    //       id="outlined-basic"
    //       variant="outlined"
    //       value={nama}
    //       onChange={(e) => setNama(e.target.value.toUpperCase())}
    //     />
    //   </Box>
    //   <button id="pay-button" onClick={() => payButton()}>
    //     Pay!
    //   </button>
    //   <pre>
    //     <div id="result-json">
    //       JSON result will appear here after payment:
    //       <br />
    //     </div>
    //   </pre>
    // </div>
  );
};

export default App;

// const labelInput = {
//   fontWeight: "600",
//   marginLeft: 1
// };

const container = {
  display: "flex",
  height: "100%",
  minHeight: "100vh"
};

const linkText = {
  textDecoration: "none",
  color: "inherit"
};

const sidebarIcon = {
  backgroundColor: Colors.grey300,
  borderRadius: "20px",
  padding: 1,
  marginLeft: 1,
  marginTop: 1,
  cursor: "pointer"
};

const contentWrapper = {
  minHeight: "100vh",
  width: "80vw"
};
