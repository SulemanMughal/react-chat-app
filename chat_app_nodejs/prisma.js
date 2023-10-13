import { PrismaClient } from "@prisma/client";
import { global } from "styled-jsx/css.js";

const globalForPrisma = global ;
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
