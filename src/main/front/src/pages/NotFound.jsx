import React from "react";
import { Outlet } from "react-router-dom";

export default function Board() {
  return (
    <div style={{margin:"20px"}}>
      <h1>Page Not Found Error</h1>
      <img src="/img/not-found.svg" alt="error"/>
    </div>
  )
}