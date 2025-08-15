import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "./assets/logo.jpeg";
import qr1 from "./assets/QR1.jpeg";
import qr2 from "./assets/QR2.jpeg";
import './App.css';

const API_URL = "https://6784f1831ec630ca33a6775d.mockapi.io/Adarash_Tarun_Mandal";

function App() {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const adminPassword = "mandal@123";

  useEffect(() => {
    axios.get(API_URL).then((res) => setEntries(res.data));
  }, []);

  const addEntry = async () => {
    if (!name || !amount) return alert("कृपया नाव आणि रक्कम भरा");
    const newEntry = {
      name,
      amount: parseFloat(amount),
      status: isAdmin ? "Approved" : "Pending"
    };
    const res = await axios.post(API_URL, newEntry);
    setEntries([res.data, ...entries]);
    setName("");
    setAmount("");
  };

  const updateStatus = async (id, status) => {
    const res = await axios.put(`${API_URL}/${id}`, { status });
    setEntries(entries.map((e) => (e.id === id ? res.data : e)));
  };

  const deleteEntry = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setEntries(entries.filter((e) => e.id !== id));
  };

  const handleAdminLogin = () => {
    const pwd = prompt("Enter Admin Password:");
    if (pwd === adminPassword) {
      setIsAdmin(true);
    } else {
      alert("❌ Wrong Password");
    }
  };

  const totalApproved = entries
    .filter((e) => e.status === "Approved")
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="container my-4">
      {/* LOGO + TITLE */}
      <div className="text-center mb-4">
        <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap">

          {/* Left QR Code */}
          <img
            src={qr1}
            alt="QR Left"
            className="d-none d-lg-block"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              border: "3px solid orange",
              borderRadius: "10px"
            }}
          />

          {/* Logo + Title */}
          <div className="d-flex flex-column align-items-center">
            <img
              src={logo}
              alt="Adarsh Tarun Mandal Logo"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "50%",
                border: "3px solid orange",
                marginBottom: "10px"
              }}
            />
            <h1 className="fw-bold" style={{ color: "#FF8C00", textAlign: "center" }}>
              आदर्श तरुण मंडळ गणेशोत्सव २०२५ <br /> सभासद वर्गणी
            </h1>
          </div>

          {/* Right QR Code */}
          <img
            src={qr2}
            alt="QR Right"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              border: "3px solid orange",
              borderRadius: "10px"
            }}
          />

        </div>
      </div>

      <div className="alert alert-success text-center fw-bold">
        एकूण जमा वर्गणी (Approved): ₹ {totalApproved} <br /> <br />
        गणेशोत्सव २०२५ साठी <br /> एकूण खर्च : ₹ १ ,५५ ,०००/-
      </div>

      <div className="text-center mb-3">
        {isAdmin ? (
          <button
            onClick={() => setIsAdmin(false)}
            className="btn btn-danger"
          >
            Logout Admin
          </button>
        ) : (
          <button onClick={handleAdminLogin} className="btn btn-primary">
            Admin Login
          </button>
        )}
      </div>

      {/* Form */}
      <div className="card p-3 mb-4">
        <div className="row g-2">
          <div className="col-md-5">
            <input
              type="text"
              placeholder="नाव"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-md-5">
            <input
              type="number"
              placeholder="रक्कम"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="col-md-2 d-grid">
            <button onClick={addEntry} className="btn btn-success">
              Add Entry
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>नाव</th>
              <th>रक्कम (₹)</th>
              <th>स्थिती</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {entries.map((e, index) => (
              <tr key={e.id}>
                <td>{index + 1}</td>
                <td>{e.name}</td>
                <td>{e.amount}</td>
                <td
                  className={
                    e.status === "Approved"
                      ? "text-success fw-bold"
                      : e.status === "Rejected"
                        ? "text-danger fw-bold"
                        : "text-warning fw-bold"
                  }
                >
                  {e.status}
                </td>
                {isAdmin && (
                  <td>
                    {e.status === "Pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(e.id, "Approved")}
                          className="btn btn-sm btn-success me-1 mb-2"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(e.id, "Rejected")}
                          className="btn btn-sm btn-danger me-1 mb-2"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteEntry(e.id)}
                      className="btn btn-sm btn-secondary mb-2"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
