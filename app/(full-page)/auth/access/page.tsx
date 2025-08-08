"use client";
// Importaciones necesarias
import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Ripple } from "primereact/ripple";

// Definición de variantes de animación para Framer Motion
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.3,
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AccessDenied: React.FC = () => {
  const router = useRouter();

  // Función para manejar la redirección al menú principal
  const navigateToDashboard = () => {
    router.push("/");
  };

  // Función para regresar a la página anterior
  const goBack = () => {
    router.back();
  };

  // Redirección automática después de un tiempo, opcional
  useEffect(() => {
    const timer = setTimeout(() => {
      // navigateToDashboard();
    }, 60000); // 60 segundos
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex align-items-center justify-content-center surface-ground min-h-screen">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center p-3 sm:p-5 w-full"
        style={{ maxWidth: "40rem" }}
      >
        <div className="p-4 surface-card shadow-3 border-round-2xl">
          <motion.div
            variants={itemVariants}
            className="flex flex-column align-items-center justify-content-center "
          >
            <div className="mb-3">
              <Image
                src="/layout/images/pages/auth/access-denied2.svg"
                alt="Acceso Denegado"
                width={320}
                height={200}
                priority
                style={{ objectFit: "contain" }}
              />
            </div>
          </motion.div>
          {/* <motion.p
            variants={itemVariants}
            className="text-700 text-lg line-height-3 mb-4"
          >
            Parece que no tienes los permisos necesarios para ver esta página.
            Por favor, regresa al panel principal para continuar. Si crees que
            esto es un error, contacta al administrador.
          </motion.p> */}
          <motion.div
            variants={itemVariants}
            className="flex flex-column gap-3"
          >
            <Button
              label="Regresar a la página anterior"
              icon="pi pi-arrow-left"
              className="p-button-secondary w-full p-ripple"
              onClick={goBack}
            >
              <Ripple />
            </Button>
            <Button
              label="Ir al Panel Principal"
              icon="pi pi-home"
              className="p-button-primary w-full p-ripple"
              onClick={navigateToDashboard}
            >
              <Ripple />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AccessDenied;
