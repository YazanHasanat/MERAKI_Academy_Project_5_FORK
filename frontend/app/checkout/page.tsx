"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Divider,
} from "@mui/material";

type CartItem = {
  product_id: number;
  title: string;
  price: number;
  quantity: number;
};