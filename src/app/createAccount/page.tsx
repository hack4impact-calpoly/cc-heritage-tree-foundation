"use client";
import { Box, FormControl, FormLabel, FormErrorMessage, Input, Button } from "@chakra-ui/react";
import { useState } from "react";
import "../fonts/fonts.css";

export default function CreateAccount() {
  const [formState, setFormState] = useState({
    name: { value: "", touched: false },
    username: { value: "", touched: false },
    password: { value: "", touched: false },
    phoneNumber: { value: "", touched: false },
    email: { value: "", touched: false },
  });

  const handleInputChange = (field) => (e) => {
    setFormState({
      ...formState,
      [field]: { ...formState[field], value: e.target.value },
    });
  };

  const handleBlur = (field) => () => {
    setFormState({
      ...formState,
      [field]: { ...formState[field], touched: true },
    });
  };

  const isError = (field) => formState[field].touched && formState[field].value === "";

  return (
    <div
      style={{
        position: "absolute",
        backgroundColor: "#eeeeee",
        height: "100vh",
        width: "100%",
      }}
    >
      <Box
        style={{
          backgroundColor: "white",
          justifySelf: "center",
          width: "50%",
          marginTop: "10vh",
          borderRadius: "41px",
          fontFamily: "Inter",
          paddingBottom: "20px",
        }}
      >
        <h1 style={{ width: "100%", textAlign: "center", fontSize: "40px" }}>Create Account</h1>
        <FormControl
          isInvalid={isError("name")}
          style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
        >
          <FormLabel style={{ width: "80%", textAlign: "left", marginTop: "10px" }}>Name</FormLabel>
          <Input
            type="text"
            value={formState.name.value}
            onChange={handleInputChange("name")}
            onBlur={handleBlur("name")}
            placeholder="Name"
            style={{ width: "80%" }}
          />
          {isError("name") && <FormErrorMessage>Field is required.</FormErrorMessage>}
        </FormControl>

        <FormControl
          isInvalid={isError("username")}
          style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
        >
          <FormLabel style={{ width: "80%", textAlign: "left", marginTop: "10px" }}>Username</FormLabel>
          <Input
            type="text"
            value={formState.username.value}
            onChange={handleInputChange("username")}
            onBlur={handleBlur("username")}
            placeholder="Username"
            style={{ width: "80%" }}
          />
          {isError("username") && <FormErrorMessage>Field is required.</FormErrorMessage>}
        </FormControl>

        <FormControl
          isInvalid={isError("password")}
          style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
        >
          <FormLabel style={{ width: "80%", textAlign: "left", marginTop: "10px" }}>Password</FormLabel>
          <Input
            type="password"
            value={formState.password.value}
            onChange={handleInputChange("password")}
            onBlur={handleBlur("password")}
            placeholder="Password"
            style={{ width: "80%" }}
          />
          {isError("password") && <FormErrorMessage>Field is required.</FormErrorMessage>}
        </FormControl>

        <FormControl
          isInvalid={isError("phoneNumber")}
          style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
        >
          <FormLabel style={{ width: "80%", textAlign: "left", marginTop: "10px" }}>Phone Number</FormLabel>
          <Input
            type="tel"
            value={formState.phoneNumber.value}
            onChange={handleInputChange("phoneNumber")}
            onBlur={handleBlur("phoneNumber")}
            placeholder="+1 "
            style={{ width: "80%" }}
          />
          {isError("phoneNumber") && <FormErrorMessage>Field is required.</FormErrorMessage>}
        </FormControl>

        <FormControl
          isInvalid={isError("email")}
          style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
        >
          <FormLabel style={{ width: "80%", textAlign: "left", marginTop: "10px" }}>Email Address</FormLabel>
          <Input
            type="email"
            value={formState.email.value}
            onChange={handleInputChange("email")}
            onBlur={handleBlur("email")}
            placeholder="Email"
            style={{ width: "80%" }}
          />
          {isError("email") && <FormErrorMessage>Field is required.</FormErrorMessage>}
        </FormControl>
        <Box style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
          <Button>Submit</Button>
        </Box>
      </Box>
    </div>
  );
}
