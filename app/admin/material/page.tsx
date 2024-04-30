import MaterialManage from "@/components/MaterialManage";
import { EnumMode } from "@/type/type";
import React from "react";

function CreateMaterial() {
  const mode: EnumMode = EnumMode.Create;

  return <MaterialManage mode={mode} />;
}

export default CreateMaterial;
