import "source-map-support/register";
import { NextFunction } from "express";
import { decode, verify } from "jsonwebtoken";
import Axios from "axios";

import { JwtPayload } from "./JwtPayload";
import { Jwt } from "./Jwt";

const jwksUrl = "https://brurez.auth0.com/pem";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const verifiedToken = await verifyToken(req.headers.authorization);

  next();
}

function getToken(authHeader: string): string {
  if (!authHeader) {
    throw new Error("No authentication header");
  }

  if (!authHeader.toLowerCase().startsWith("bearer ")) {
    throw new Error("Invalid authentication header");
  }

  const split = authHeader.split(" ");
  return split[1];
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader);
  const jwt: Jwt = decode(token, { complete: true }) as Jwt;

  if (!jwt) {
    throw new Error("invalid token");
  }

  try {
    const response = await Axios.get(jwksUrl);
    console.log(response);
    const verifedToken = verify(token, response.data, { algorithms: ["RS256"] });

    console.log("verfied token", verifedToken);
    return verifedToken as JwtPayload;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
