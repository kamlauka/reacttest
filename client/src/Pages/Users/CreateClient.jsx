import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Divider, TextField, Slide
} from "@mui/material";
import { PiNotepad, PiXLight } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { createClient } from "../../redux/action/user";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const CreateClient = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { isFetching } = useSelector((state) => state.user);

  const initialState = {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    phone: "",
    email: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialState);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = { ...formData };
    if (!payload.email) delete payload.email;

    dispatch(createClient(payload));
    handleClose();
  };

  return (
    <Dialog open={open} TransitionComponent={Transition} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle className="flex items-center justify-between">
        <div className="text-sky-400 font-primary">Add New Client</div>
        <div className="cursor-pointer" onClick={handleClose}>
          <PiXLight className="text-[25px]" />
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-2 p-3 text-gray-500 font-primary">
          <div className="text-xl flex gap-2 items-center">
            <PiNotepad size={23} />
            <span>Client Details</span>
          </div>
          <Divider />
          <table className="mt-4 w-full">
            <tbody>
              {["firstName", "lastName", "username", "email", "password", "phone"].map((field) => (
                <tr key={field}>
                  <td className="pb-4 text-lg capitalize">{field.replace(/([A-Z])/g, ' $1')}</td>
                  <td className="pb-4">
                    <TextField
                      size="small"
                      fullWidth
                      type={field === "password" ? "password" : field === "phone" ? "number" : "text"}
                      value={formData[field]}
                      onChange={(e) => handleChange(field, e.target.value)}
                      error={!!errors[field]}
                      helperText={errors[field]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
      <DialogActions>
        <button onClick={handleClose} className="bg-[#d7d7d7] px-4 py-2 rounded-lg text-gray-500 hover:text-white hover:bg-[#6c757d] border border-[#efeeee] font-thin transition-all">
          Cancel
        </button>
        <button onClick={handleSubmit} className="bg-primary-red px-4 py-2 rounded-lg text-white hover:bg-red-400 font-thin">
          {isFetching ? "Submitting..." : "Submit"}
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateClient;
