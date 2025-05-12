import React, { useState, useEffect, useRef } from "react";

// PrimeReact Imports
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext"; // For general inputs if needed, Password comp is specific
import { Password } from "primereact/password";
import { Avatar } from "primereact/avatar";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import { Message } from "primereact/message";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { useSession } from "next-auth/react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  isEmailVerified: boolean;
  // phoneNumber?: string;
  // address?: string;
}

interface MyProfileListProps {
  // onUpdateProfileDetails: (details: Partial<Pick<UserProfile, 'name' | 'phoneNumber' | 'address'>>) => Promise<void>;
}

const MyProfileList: React.FC<MyProfileListProps> = ({}) => {
  const { data: session } = useSession();
  const profile = session?.user;
  console.log("profile", profile);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const toast = useRef<Toast>(null);
  const fileUploadRef = useRef<FileUpload>(null);

  //   useEffect(() => {
  //     setImagePreview(profile.profileImageUrl || null);
  //   }, [profile.profileImageUrl]);

  const showToast = (
    severity: "success" | "info" | "warn" | "error",
    summary: string,
    detail: string
  ) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="p-grid p-justify-center p-p-2 md:p-4">
        <div className="p-col-12 p-md-10 p-lg-8">
          <Card className="p-mb-4">
            <div className="p-d-flex p-flex-column p-ai-center sm:p-flex-row sm:p-ai-start"></div>
          </Card>

          {/* 
                        Future section for editing other profile details:
                        <Card title="Editar Detalles del Perfil" className="p-mt-4">
                            <div className="p-fluid">
                                <div className="p-field p-mb-3">
                                    <label htmlFor="profileName">Nombre</label>
                                    <InputText id="profileName" defaultValue={profile.name} />
                                </div>
                                // Add inputs for other editable fields like phoneNumber, address
                                <Button label="Guardar Cambios" icon="pi pi-save" />
                            </div>
                        </Card>
                    */}
        </div>
      </div>
    </>
  );
};

export default MyProfileList;
