import { doubleReturn } from "@/typings/globalTypes";
import { createHmac } from "crypto";
import { v4 as uuid4 } from "uuid";

type createDoubleCSRFT = (defaultCSRFToken?: string) => {
  CSRFToken: string;
  hashedCSRFToken: string;
};

// * Creates necessary csrf tokens to apply signed double-submit cookie method
// * If defaultCSRFToken given its uses that instead of creating new uuid (used for verifying)
// * Copied from my other project https://github.com/ensarkr/express-stateless

const createDoubleCSRF: createDoubleCSRFT = (defaultCSRFToken) => {
  const secretKey = process.env.CSRF_SECRET_KEY as string;
  const CSRFToken = defaultCSRFToken || uuid4();

  const hashedCSRFToken = createHmac("sha256", secretKey)
    .update(CSRFToken)
    .digest("base64");

  return {
    CSRFToken,
    hashedCSRFToken,
  };
};

const verifyDoubleSignedSubmit = (
  cookieCSRFToken: string | undefined | null,
  headerHashedCSRFToken: string | undefined | null
): doubleReturn<"success"> => {
  if (
    cookieCSRFToken === null ||
    cookieCSRFToken === undefined ||
    headerHashedCSRFToken === null ||
    headerHashedCSRFToken === undefined
  ) {
    return { status: false, message: "tokens are undefined" };
  }

  const { hashedCSRFToken: trueHashedCSRFToken } =
    createDoubleCSRF(cookieCSRFToken);

  if (headerHashedCSRFToken === trueHashedCSRFToken) {
    return { status: true, value: "success" };
  } else return { status: false, message: "csrf token mismatch" };
};

const removeCSRFToken = () => {
  return {
    "Set-Cookie":
      "csrf_token_guest=null; SameSite=strict; HttpOnly; Secure; Max-Age=0",
  };
};

export { createDoubleCSRF, verifyDoubleSignedSubmit, removeCSRFToken };
