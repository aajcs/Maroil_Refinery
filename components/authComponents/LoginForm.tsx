"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { classNames } from "primereact/utils";
import { useContext } from "react";
import { loginSchema } from "@/libs/zod";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { Page } from "@/types";
import { signIn } from "next-auth/react";
import { useSocket } from "@/hooks/useSocket";

type FormData = z.infer<typeof loginSchema>;

const LoginForm: Page = () => {
  const router = useRouter();
  const { layoutConfig } = useContext(LayoutContext);
  const [error, setError] = useState("");
  const filledInput = layoutConfig.inputStyle === "filled";
  const { conectarSocket } = useSocket();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    // console.log(data);
    const resAuth = await signIn("credentials", {
      redirect: false,
      correo: data.correo,
      password: data.password,
    });
    if (resAuth?.error) setError(resAuth.error as string);

    if (resAuth?.ok) {
      router.push("/");
      conectarSocket();
      return;
    }
  };

  return (
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
        <h1 className="font-bold text-2xl mt-0 mb-2">MAROIL Refinery</h1>
        <p className="text-color-secondary mb-4">
          Bienvenido a la <strong>Maroil Refinery</strong>, inicie sesión para
          continuar.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-500 text-white p-2 mb-2">{error}</div>
          )}
          <span className="p-input-icon-left mb-4">
            <i className="pi pi-user"></i>
            <InputText
              type="text"
              placeholder="Correo"
              className={classNames("w-full", { "p-invalid": errors.correo })}
              {...register("correo")}
            />
            {errors.correo && (
              <small className="p-error">{errors.correo.message}</small>
            )}
          </span>

          <span className="p-input-icon-left mb-4">
            <i className="pi pi-key"></i>
            <InputText
              type="password"
              placeholder="Contraseña"
              className={classNames("w-full", { "p-invalid": errors.password })}
              {...register("password")}
            />
            {errors.password && (
              <small className="p-error">{errors.password.message}</small>
            )}
          </span>

          <Button
            label="Iniciar Sesión"
            className="mb-4"
            type="submit"
          ></Button>
        </form>

        <span className="text-color-secondary text-center mb-4">
          o inicie sesión con lo siguiente
        </span>

        <div className="flex gap-4 align-items-center justify-content-center">
          <a
            href="https://www.google.com"
            className="inline-flex flex-shrink-0 w-3rem h-3rem justify-content-center align-items-center surface-ground border-circle"
          >
            <i className="pi pi-google text-2xl text-color"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
