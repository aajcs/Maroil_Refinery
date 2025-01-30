"use client";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React from "react";
import type { Page } from "@/types";
import { Password } from "primereact/password";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { LayoutContext } from "../../../../layout/context/layoutcontext";
import { classNames } from "primereact/utils";

const AccessDenied: Page = () => {
  const { layoutConfig } = useContext(LayoutContext);
  const [value, setValue] = useState<string>("");
  const [value2, setValue2] = useState<string>("");
  const router = useRouter();
  const navigateToDashboard = () => {
    router.push("/");
  };
  const filledInput = layoutConfig.inputStyle === "filled";

  return (
    <>
      <div
        className={classNames(
          "surface-ground h-screen w-screen flex align-items-center justify-content-center",
          { "p-input-filled": filledInput }
        )}
      >
        <div
          className="surface-card py-7 px-5 sm:px-7 shadow-2 flex flex-column w-11 sm:w-30rem"
          style={{ borderRadius: "14px" }}
        >
          <h1 className="font-bold text-2xl mt-0 mb-2">MAROIL</h1>
          <p className="text-color-secondary mb-4">
            Welcome to the <strong>Verona Community</strong>, where the magic
            happens, sign up to continue.
          </p>

          <span className="p-input-icon-left mb-4">
            <i className="pi pi-user"></i>
            <InputText type="text" placeholder="Email" className="w-full" />
          </span>

          <span className="p-input-icon-left mb-4">
            <i className="pi pi-key z-2"></i>
            <Password
              id="password"
              placeholder="Password"
              className="w-full"
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue(e.target.value)
              }
              inputStyle={{ paddingLeft: "2.5rem" }}
              inputClassName="w-full"
              toggleMask={true}
            ></Password>
          </span>

          <Button
            label="Sign Up"
            className="mb-4"
            onClick={navigateToDashboard}
          ></Button>

          <span className="text-color-secondary text-center mb-4">
            or sign up with below
          </span>

          <div className="flex gap-4 align-items-center justify-content-center">
            <a
              href="https://www.facebook.com"
              className="inline-flex flex-shrink-0 w-3rem h-3rem justify-content-center align-items-center surface-ground border-circle"
            >
              <i className="pi pi-facebook text-2xl text-color"></i>
            </a>
            <a
              href="https://www.twitter.com"
              className="inline-flex flex-shrink-0 w-3rem h-3rem justify-content-center align-items-center surface-ground border-circle"
            >
              <i className="pi pi-twitter text-2xl text-color"></i>
            </a>
            <a
              href="https://www.google.com"
              className="inline-flex flex-shrink-0 w-3rem h-3rem justify-content-center align-items-center surface-ground border-circle"
            >
              <i className="pi pi-google text-2xl text-color"></i>
            </a>
            <a
              href="https://www.github.com"
              className="inline-flex flex-shrink-0 w-3rem h-3rem justify-content-center align-items-center surface-ground border-circle"
            >
              <i className="pi pi-github text-2xl text-color"></i>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccessDenied;
