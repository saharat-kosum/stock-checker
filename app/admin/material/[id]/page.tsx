"use client";

import MaterialManage from "@/components/MaterialManage";
import { AppDispatch } from "@/redux/Store";
import { EnumMode } from "@/type/type";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { getMaterial } from "@/redux/materialSlice";

function EditMaterial() {
  const params = useParams();
  const mode: EnumMode = EnumMode.Edit;
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const url = `/api/material/${params.id}`;
    dispatch(getMaterial(url));
  }, [params.id, dispatch]);

  return <MaterialManage mode={mode} />;
}

export default EditMaterial;
