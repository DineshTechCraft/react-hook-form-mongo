import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

const schema = yup.object().shape({
  email: yup.string().required().email(),
  name: yup.string().required(),
  phone: yup
    .string()
    .required("Mobile number is required")
    .matches(
      /^[0-9]{10}$/,
      "Mobile number must be 10 digits and contain only numbers"
    ),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirm_password: yup
    .string()
    .label("confirm password")
    .required()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const Signup = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getusers");
        console.log("Fetched User Data:", response.data);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    fetchUserData();
  }, []);

  const [selectFile, setSelectFile] = useState(null);
  const handleFileChange = (event) => {
    setSelectFile(event.target.files[0]);
  };
  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", selectFile);
    axios
      .post("http://localhost:5000/upload_profile_picture", formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error Uploading Profile Picture:", error);
      });
  };

  const [showUserData, setShowUserData] = useState(false);
  const handleShowUserData = () => {
    setShowUserData(!showUserData);
  };

  const onsubmitHandle = async (data) => {
    try {
      console.log("SignUp Data:", data);
      await axios.post("http://localhost:5000/register", data);
      console.log("User registered successfully");
      reset();
    } catch (error) {
      console.error("Error registering user", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="mb-4 text-center">Sign Up</h2>
              <form onSubmit={handleSubmit(onsubmitHandle)}>
                <div className="mb-3">
                  <input
                    {...register("name")}
                    className="form-control"
                    placeholder="Enter Your Name"
                    required
                  />
                  <p className="text-danger">{errors.name?.message}</p>
                </div>
                <div className="mb-3">
                  <input
                    {...register("phone")}
                    className="form-control"
                    placeholder="Enter Your Phone"
                    required
                  />
                  <p className="text-danger">{errors.phone?.message}</p>
                </div>
                <div className="mb-3">
                  <input
                    {...register("email")}
                    className="form-control"
                    placeholder="Enter Your Email"
                    type="email"
                    required
                  />
                  <p className="text-danger">{errors.email?.message}</p>
                </div>
                <div className="mb-3">
                  <input
                    {...register("password")}
                    className="form-control"
                    placeholder="Enter Your Password"
                    type="password"
                    required
                  />
                  <p className="text-danger">{errors.password?.message}</p>
                </div>
                <div className="mb-3">
                  <input
                    {...register("confirm_password")}
                    className="form-control"
                    placeholder="Confirm Your Password"
                    type="password"
                    required
                  />
                  <p className="text-danger">{errors.confirm_password?.message}</p>
                </div>
                <button
                  type="submit"
                  className="btn btn-success w-100 rounded-0 mt-3"
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6 mt-4">
          <div className="card">
            <div className="card-body">
              <h2>Users</h2>
              <button onClick={handleShowUserData} className="btn btn-info mb-3">
                {showUserData ? "Hide Users" : "Show Users"}
              </button>
              {showUserData && userData.length > 0 && (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {showUserData && userData.length === 0 && (
                <p className="text-center text-muted">No users available.</p>
              )}
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-body">
              <div className="mb-3">
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload} className="btn btn-primary mt-2">
                  Upload Profile picture
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
