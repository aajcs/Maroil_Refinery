import React, { useState, useRef } from "react";
import { useSession } from "next-auth/react";

import { classNames } from "primereact/utils";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import UsuarioChangePasswordForm from "../usuarioComponents/UsuarioChangePasswordForm";

const MyProfileList: React.FC = () => {
  const { data: session, update } = useSession();
  const profile = session?.user;
  const toast = useRef<Toast>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile?.usuario?.nombre || "");
  const [email, setEmail] = useState(profile?.usuario?.correo || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState(
    profile?.image ||
      "https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
  );
  const [usuarioPasswordFormDialog, setUsuarioPasswordFormDialog] =
    useState(false);
  const showToast = (
    severity: "success" | "info" | "warn" | "error",
    summary: string,
    detail: string
  ) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };
  const hideUsuarioPasswordFormDialog = () => {
    setUsuarioPasswordFormDialog(false);
  };
  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simular actualización de perfil en el backend
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Actualizar sesión
      await update({
        ...session,
        user: {
          ...session?.user,
          usuario: {
            ...session?.user?.usuario,
            nombre: name,
            correo: email,
          },
        },
      });

      showToast("success", "Éxito", "Perfil actualizado correctamente");
      setIsEditing(false);
    } catch (error) {
      showToast("error", "Error", "No se pudo actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast("error", "Error", "Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);
    try {
      // Simular cambio de contraseña en el backend
      await new Promise((resolve) => setTimeout(resolve, 1500));

      showToast("success", "Éxito", "Contraseña actualizada correctamente");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      showToast("error", "Error", "No se pudo cambiar la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = (e: any) => {
    const file = e.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target?.result as string);
        showToast("success", "Éxito", "Avatar actualizado correctamente");
      };
      reader.readAsDataURL(file);
    }
  };

  const renderProfileInfo = () => (
    <div className="grid">
      <div className="col-12 md:col-4 flex flex-column align-items-center">
        <div className="relative mb-4">
          <Avatar
            image={avatar}
            size="xlarge"
            shape="circle"
            className="border-2 border-primary"
          />
          <FileUpload
            mode="basic"
            name="avatar"
            accept="image/*"
            maxFileSize={2000000}
            auto
            chooseLabel="Cambiar"
            className="absolute bottom-0 right-0"
            onSelect={handleAvatarUpload}
          />
        </div>
        <h1 className="text-2xl font-bold text-900 mt-3">{name}</h1>
        <Tag
          severity={profile?.usuario?.estado === "true" ? "success" : "danger"}
          className="mt-2"
        >
          {profile?.usuario?.estado === "true" ? "Activo" : "Inactivo"}
        </Tag>
      </div>

      <div className="col-12 md:col-8">
        <div className="grid">
          <div className="col-12 md:col-6 mb-4">
            <div className="text-600 font-medium mb-1">Correo electrónico</div>
            <div className="text-900">{profile?.usuario?.correo}</div>
          </div>

          <div className="col-12 md:col-6 mb-4">
            <div className="text-600 font-medium mb-1">Rol</div>
            <div className="text-900">{profile?.usuario?.rol || "-"}</div>
          </div>

          <div className="col-12 md:col-6 mb-4">
            <div className="text-600 font-medium mb-1">Acceso</div>
            <div className="text-900">{profile?.usuario?.acceso || "-"}</div>
          </div>
          <div className="col-12 md:col-6 mb-4">
            <div className="text-600 font-medium mb-1">Departamento</div>
            {Array.isArray(profile?.usuario?.departamento) &&
            profile.usuario.departamento.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.usuario.departamento.map(
                  (dep: string, idx: number) => (
                    <Tag key={idx} value={dep} className="mr-2 mb-2" />
                  )
                )}
              </div>
            ) : (
              <div className="text-900">Sin departamento</div>
            )}
          </div>

          <div className="col-12 md:col-6 mb-4">
            <div className="text-600 font-medium mb-1">
              Última actualización
            </div>
            <div className="text-900">{profile?.usuario?.updatedAt || "-"}</div>
          </div>

          <div className="col-12 mb-4">
            <div className="text-600 font-medium mb-1">Refinerías</div>
            {profile?.usuario?.idRefineria &&
            profile.usuario.idRefineria.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.usuario.idRefineria.map((refineria, index) => (
                  <Tag
                    key={index}
                    value={refineria.nombre}
                    className="mr-2 mb-2"
                  />
                ))}
              </div>
            ) : (
              <div className="text-900">Sin acceso a refinerías</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEditForm = () => (
    <div className="grid formgrid p-fluid">
      <div className="field mb-4 col-12 md:col-6">
        <label htmlFor="name" className="font-medium text-900 block mb-2">
          Nombre completo
        </label>
        <InputText
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="field mb-4 col-12 md:col-6">
        <label htmlFor="email" className="font-medium text-900 block mb-2">
          Correo electrónico
        </label>
        <InputText
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );

  const renderPasswordForm = () => (
    <div className="grid formgrid p-fluid">
      <div className="field mb-4 col-12">
        <label
          htmlFor="currentPassword"
          className="font-medium text-900 block mb-2"
        >
          Contraseña actual
        </label>
        <Password
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          toggleMask
          feedback={false}
          className="w-full"
        />
      </div>

      <div className="field mb-4 col-12 md:col-6">
        <label
          htmlFor="newPassword"
          className="font-medium text-900 block mb-2"
        >
          Nueva contraseña
        </label>
        <Password
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          toggleMask
          className="w-full"
        />
      </div>

      <div className="field mb-4 col-12 md:col-6">
        <label
          htmlFor="confirmPassword"
          className="font-medium text-900 block mb-2"
        >
          Confirmar contraseña
        </label>
        <Password
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          toggleMask
          className="w-full"
        />
      </div>

      <div className="col-12">
        <div className="p-3 bg-blue-50 border-round">
          <h4 className="mt-0 mb-2 text-blue-700">Requisitos de contraseña:</h4>
          <ul className="m-0 p-0 pl-3">
            <li>Mínimo 8 caracteres</li>
            <li>Al menos una letra mayúscula</li>
            <li>Al menos un número</li>
            <li>Al menos un carácter especial</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Toast ref={toast} position="top-right" />

      <Card className="mb-6">
        <div className="flex justify-content-between align-items-center mb-5">
          <h1 className="text-3xl font-bold text-900">Perfil de Usuario</h1>

          {!isEditing && (
            <div className="flex gap-2">
              <Button
                label="Editar Perfil"
                icon="pi pi-pencil"
                className="p-button-outlined"
                onClick={() => setIsEditing(true)}
              />
              <Button
                label="Cambiar Contraseña"
                icon="pi pi-key"
                className="p-button-outlined p-button-help"
                onClick={() => setUsuarioPasswordFormDialog(true)}
              />
            </div>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-content-center py-8">
            <ProgressSpinner />
          </div>
        )}

        {!isLoading && (
          <>
            {!isEditing && renderProfileInfo()}

            {isEditing && (
              <div className="mt-5">
                <h2 className="text-2xl font-bold text-900 mb-4">
                  Editar Perfil
                </h2>
                {renderEditForm()}
                <div className="flex justify-content-end gap-3 mt-5">
                  <Button
                    label="Cancelar"
                    className="p-button-outlined p-button-secondary"
                    onClick={() => setIsEditing(false)}
                  />
                  <Button
                    label="Guardar Cambios"
                    icon="pi pi-save"
                    onClick={handleSaveProfile}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      <Card title="Actividad Reciente" className="mb-6">
        <div className="timeline">
          <div className="timeline-event">
            <div className="timeline-event-circle bg-blue-500"></div>
            <div className="timeline-event-content">
              <div className="font-bold">Sesión iniciada</div>
              <div className="text-600">Hoy a las 09:45 AM</div>
            </div>
          </div>

          <div className="timeline-event">
            <div className="timeline-event-circle bg-green-500"></div>
            <div className="timeline-event-content">
              <div className="font-bold">Documento actualizado</div>
              <div className="text-600">Ayer a las 03:20 PM</div>
              <div className="text-600">Reporte de producción.pdf</div>
            </div>
          </div>

          <div className="timeline-event">
            <div className="timeline-event-circle bg-purple-500"></div>
            <div className="timeline-event-content">
              <div className="font-bold">Cambio de contraseña</div>
              <div className="text-600">Hace 3 días</div>
            </div>
          </div>
        </div>
      </Card>
      <Dialog
        visible={usuarioPasswordFormDialog}
        style={{ width: "850px" }}
        header="Editar Usuario"
        modal
        // footer={deleteProductDialogFooter}
        onHide={hideUsuarioPasswordFormDialog}
        content={() => (
          <UsuarioChangePasswordForm
            usuario={profile?.usuario}
            hideUsuarioPasswordFormDialog={hideUsuarioPasswordFormDialog}
            showToast={showToast}
          />
        )}
      ></Dialog>
    </div>
  );
};

export default MyProfileList;
