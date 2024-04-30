"use client";

import MaterialManage from "@/components/MaterialManage";
import { AppDispatch } from "@/redux/Store";
import { EnumMode } from "@/type/type";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "next/navigation";

function EditMaterial() {
  const params = useParams();
  const mode: EnumMode = EnumMode.Edit;
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // dispatch(getMaterial(params.id))
    console.log(params.id);
  }, [params.id]);

  return <MaterialManage mode={mode} />;
}

export default EditMaterial;
