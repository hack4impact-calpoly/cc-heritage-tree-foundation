"use client";
import { Image, Box, FormControl, FormErrorMessage, Input, Button, Link } from "@chakra-ui/react";
import { useState } from "react";
import "../fonts/fonts.css";
import { InputStyle } from "@/styles/CreateAccountStyle";

type FormFields = "name" | "password" | "confirmPass" | "email" | "phoneNum";

export default function CreateAccount() {
  const [formState, setFormState] = useState<Record<FormFields, { value: string; touched: boolean }>>({
    name: { value: "", touched: false },
    password: { value: "", touched: false },
    confirmPass: { value: "", touched: false },
    email: { value: "", touched: false },
    phoneNum: { value: "", touched: false },
  });

  const handleInputChange = (field: FormFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [field]: { ...formState[field], value: e.target.value },
    });
  };

  const handleBlur = (field: FormFields) => () => {
    setFormState({
      ...formState,
      [field]: { ...formState[field], touched: true },
    });
  };

  const isError = (field: FormFields) => formState[field].touched && formState[field].value === "";

  return (
    <div
      style={{
        position: "absolute",
        backgroundColor: "#596334",
        height: "100vh",
        overflowY: "scroll",
        width: "100%",
        paddingBottom: "20px",
      }}
    >
      <Box
        style={{
          backgroundColor: "white",
          justifySelf: "center",
          width: "500px",
          marginTop: "15vh",
          borderRadius: "41px",
          fontFamily: "Inter",
          paddingBottom: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Box
          style={{
            position: "absolute",
            top: "15px", // Half the height of the circular box
            left: "50%",
            transform: "translateX(-50%)",
            borderRadius: "1000px",
            backgroundColor: "#F4F1E8",
            width: "175px",
            height: "175px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src="/logo1.png"
            alt="Logo"
            style={{
              width: "70%",
              height: "70%",
              objectFit: "contain",
            }}
          />
        </Box>
        <p style={{ color: "#33333", textAlign: "center", marginTop: "10px", paddingTop: "70px" }}>
          Sign in to continue to your <br /> CCHTF dashboard
        </p>
        <FormControl
          isInvalid={isError("name")}
          style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
        >
          <Input
            type="text"
            value={formState.name.value}
            onChange={handleInputChange("name")}
            onBlur={handleBlur("name")}
            placeholder="Name"
            _placeholder={{ color: "inherit" }}
            {...InputStyle}
          />
          {isError("name") && <FormErrorMessage>Field is required.</FormErrorMessage>}
        </FormControl>

        <FormControl
          isInvalid={isError("email")}
          style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
        >
          <Input
            type="email"
            value={formState.email.value}
            onChange={handleInputChange("email")}
            onBlur={handleBlur("email")}
            placeholder="Email"
            _placeholder={{ color: "inherit" }}
            {...InputStyle}
          />
          {isError("email") && <FormErrorMessage>Field is required.</FormErrorMessage>}
        </FormControl>

        <FormControl
          isInvalid={isError("phoneNum")}
          style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
        >
          <Input
            type="phoneNum"
            value={formState.phoneNum.value}
            onChange={handleInputChange("phoneNum")}
            onBlur={handleBlur("phoneNum")}
            placeholder="Phone Number"
            _placeholder={{ color: "inherit" }}
            {...InputStyle}
          />
          {isError("phoneNum") && <FormErrorMessage>Field is required.</FormErrorMessage>}
        </FormControl>
        <FormControl
          isInvalid={isError("password")}
          style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
        >
          <Input
            type="password"
            value={formState.password.value}
            onChange={handleInputChange("password")}
            onBlur={handleBlur("password")}
            placeholder="Password"
            _placeholder={{ color: "inherit" }}
            {...InputStyle}
          />
          {isError("password") && <FormErrorMessage>Field is required.</FormErrorMessage>}
        </FormControl>

        <FormControl
          isInvalid={isError("confirmPass")}
          style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
        >
          <Input
            type="tel"
            value={formState.confirmPass.value}
            onChange={handleInputChange("confirmPass")}
            onBlur={handleBlur("confirmPass")}
            placeholder="Confirm Password "
            _placeholder={{ color: "inherit" }}
            {...InputStyle}
          />
          {isError("confirmPass") && <FormErrorMessage>Field is required.</FormErrorMessage>}
        </FormControl>
        <Box style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
          <Button
            style={{
              backgroundColor: "#596334",
              color: "white",
              width: "60%",
              fontWeight: "lighter",
              height: "50px",
              borderRadius: "16px",
            }}
          >
            Sign Up
          </Button>
        </Box>
        <p style={{ textAlign: "center", color: "#596334" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ textDecoration: "underline" }}>
            Sign in
          </Link>
        </p>
      </Box>
    </div>
  );
}
