import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

import {
  setShowSideMenu,
  setShowSuccessModal,
  setShowToast,
} from "../../../lib/features/shared/sharedSlice";
import React, { useEffect } from "react";
import MainInput from "../common/MainInput";
import PWDIcon from "../../assets/auth/2-AdornmentEnd.svg";

import PwdHideIcon from "../../assets/main/66-hideeye.png";
import DropDownInput from "../common/DropDownInput";
import {
  addEmployee,
  searchEmployeeByName,
  updateEmployee,
} from "../../../lib/features/employee/employeeActions";
import { searchLocationByName } from "../../../lib/features/locations/locationActions";
import { searchRoleByName } from "../../../lib/features/roles/roleActions";
import {
  resetState,
  setShowEmployeeSideMenu,
} from "../../../lib/features/roles/roleSlice";
const EmployeeSideMenu = () => {
  const { showSideMenu, selectedItem } = useSelector((state) => state.shared);
  // For roles page employee menu
  const { showEmployeeSideMenu } = useSelector((state) => state.roles);
  const [dateInputType, setDateInputType] = React.useState("text");
  const { roleSearchData, toastMsg: roleToast } = useSelector(
    (state) => state.roles
  );

  const [togglePWD, setTogglePWD] = React.useState(false);
  const [togglePWDC, setTogglePWDC] = React.useState(false);

  const [roleInputValue, setRoleInputValue] = React.useState("");
  const [formState, setFormState] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    position: "",
    date: "",
  });
  const formData = new FormData();

  const dispatch = useDispatch();

  const onInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  // When in edit mode  Update formData when selectedItem selected otherwise empty
  useEffect(() => {
    if (showSideMenu.mode === "edit" || showSideMenu.mode === "preview") {
      if (selectedItem) {
        setFormState({
          ...formState,
          firstName: selectedItem.name.first,
          lastName: selectedItem.name.last,
          email: selectedItem.email,
          role: selectedItem.role._id,
          position: selectedItem.position,
          date: new Date(selectedItem.date).toLocaleDateString(),
        });
        setRoleInputValue(selectedItem.role.name);
      }
    }
  }, [selectedItem, showSideMenu]);

  const onFormSubmit = (e) => {
    e.preventDefault();
    console.log(formState);
    // check if password and confirm password are same
    if (formState.password !== formState.confirmPassword) {
      return dispatch(
        setShowToast({
          value: true,
          msg: "Password and confirm password should be same",
          red: true,
        })
      );
    }

    if (
      formState.firstName === "" ||
      formState.lastName === "" ||
      formState.email === "" ||
      formState.role === "" ||
      formState.position === "" ||
      formState.date === ""
    ) {
      return dispatch(
        setShowToast({
          value: true,
          msg: "All field required",
          red: true,
        })
      );
    }

    // set form data with form state
    formData.append("name[first]", formState.firstName);
    formData.append("name[last]", formState.lastName);
    formData.append("email", formState.email);
    formData.append("password", formState.confirmPassword);
    formData.append("role", formState.role);
    formData.append("position", formState.position);
    formData.append("date", formState.date);

    //  if in edit mode update else add
    if (showSideMenu.mode === "edit") {
      dispatch(updateEmployee({ formData, id: selectedItem._id }));
    } else {
      dispatch(addEmployee(formData));
    }
    // close the menu after submitting
    dispatch(setShowSideMenu({ value: false }));
    dispatch(setShowEmployeeSideMenu(false));

    // reset the form values
    setFormState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      position: "",
      date: "",
    });
    setRoleInputValue("");
    setDateInputType("text");
  };
  return (
    <div
      className={`fixed flex w-full ${
        showSideMenu.value || showEmployeeSideMenu ? "flex" : "hidden"
      }   h-full  z-20 overflow-y-clip `}
    >
      {/* Black part */}
      <div
        onClick={() => {
          dispatch(setShowSideMenu({ value: false }));
          setFormState({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "",
            position: "",
            date: "",
          });
          setDateInputType("text");
          console.log("clicked");
        }}
        className="flex-1  lg:flex-[2] hidden sm:block h-full bg-black opacity-50"
      ></div>

      {/* Main container */}
      <div
        // ref={menuRef}
        className="flex-1 bg-white  overflow-y-auto  no-scrollbar flex flex-col justify-start items-start "
      >
        <div className="p-6 flex w-full flex-col space-y-4">
          <p className="font-semibold">
            {showSideMenu.mode === "edit"
              ? "Edit Employee"
              : showSideMenu.mode === "preview"
              ? "Preview Employee"
              : "Add  Employee"}
          </p>
          {/* This additional container to make them opaque in preview mode */}
          <div
            className={`${
              showSideMenu.mode === "preview" &&
              "opacity-50 pointer-events-none"
            }  flex flex-col space-y-4  items-center w-full `}
          >
            {/* Employee Name input */}
            <div className="flex space-x-4">
              <div className="w-full p-3 hover:border-gray-400 rounded-lg border border-[#D0D5DD]">
                <input
                  className="w-full outline-none"
                  type="text"
                  placeholder="First Name"
                  value={formState.firstName}
                  name="firstName"
                  onChange={onInputChange}
                />
              </div>
              <div className="w-full p-3 hover:border-gray-400 rounded-lg border border-[#D0D5DD]">
                <input
                  className="w-full outline-none"
                  type="text"
                  placeholder="Last Name"
                  value={formState.lastName}
                  name="lastName"
                  onChange={onInputChange}
                />
              </div>
            </div>
            {/* Employee Email input */}
            <div className="w-full p-3 hover:border-gray-400 rounded-lg border border-[#D0D5DD]">
              <input
                className="w-full outline-none"
                type="text"
                placeholder="Email Address"
                value={formState.email}
                name="email"
                onChange={onInputChange}
              />
            </div>

            {/* Double input */}
            <div className="flex space-x-4">
              <DropDownInput
                onSearch={searchRoleByName}
                searchData={roleSearchData}
                keyToShow={"name"}
                inputValue={roleInputValue}
                setInputValue={setRoleInputValue}
                setIdFunc={(val) => {
                  setFormState({ ...formState, role: val });
                }}
                placeholder={"Select Role"}
              />
              <div className="w-full p-3 hover:border-gray-400 rounded-lg border border-[#D0D5DD]">
                <input
                  className="w-full outline-none"
                  type="text"
                  value={formState.position}
                  placeholder="Position"
                  name="position"
                  onChange={onInputChange}
                />
              </div>
            </div>
            {/* Employee date hired input */}
            <div className="w-full p-3 hover:border-gray-400 rounded-lg border border-[#D0D5DD]">
              <input
                onClick={() => setDateInputType("date")}
                className="w-full outline-none"
                type={dateInputType}
                placeholder="Date Hired"
                value={formState.date}
                name="date"
                onChange={onInputChange}
              />
            </div>
            {/* Employee password input */}

            <div className="w-full ">
              <MainInput
                placeholder="Password"
                type={togglePWD ? "text" : "password"}
                icon={togglePWD ? PWDIcon : PwdHideIcon}
                onIconClick={() => setTogglePWD(!togglePWD)}
                value={formState.password}
                onChange={onInputChange}
                name={"password"}
              />
            </div>

            {/* Confirm password input */}
            <div className="w-full ">
              <MainInput
                placeholder="Confirm Password"
                type={togglePWDC ? "text" : "password"}
                icon={togglePWDC ? PWDIcon : PwdHideIcon}
                onIconClick={() => setTogglePWDC(!togglePWDC)}
                value={formState.confirmPassword}
                onChange={onInputChange}
                name={"confirmPassword"}
              />
            </div>
          </div>
        </div>
        {/* Buttons */}

        <div className="flex flex-1 place-items-end p-6  w-full justify-center space-x-4 ">
          <div
            onClick={() => {
              dispatch(setShowSideMenu({ value: false, mode: "add" }));
              dispatch(setShowEmployeeSideMenu(false));
            }}
            className="flex-1 flex justify-center items-center px-4 py-3 rounded-lg bg-white border border-gray-300 font-semibold cursor-pointer select-none hover:bg-gray-200"
          >
            Cancel
          </div>
          <div
            onClick={(e) => {
              if (showSideMenu.mode === "preview") {
                dispatch(setShowSideMenu({ value: true, mode: "edit" }));
              } else {
                onFormSubmit(e);
              }
            }}
            className={`flex-1 flex justify-center items-center px-4 py-3 rounded-lg bg-[#78FFB6] hover:bg-[#37fd93] font-semibold cursor-pointer select-none `}
          >
            {showSideMenu.mode === "edit"
              ? "Update Employee"
              : showSideMenu.mode === "preview"
              ? "Edit Employee"
              : "Add Employee"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSideMenu;
