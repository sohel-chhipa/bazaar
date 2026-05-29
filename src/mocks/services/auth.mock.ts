import { fetchUsers } from "@/shared/api/methods/users.methods";
import { createMockToken } from "@/shared/lib/auth";
import type { AuthSession, User } from "@/shared/types/ecommerce.types";

interface SendOtpPayload {
  email: string;
}

interface VerifyOtpPayload {
  email: string;
  otp: string;
}

const OTP_VALUE = "123456";

const findUserByEmail = async (email: string) => {
  const users = await fetchUsers({ page: 1, perPage: 200 });
  return users.data.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

const createSession = (): AuthSession => ({
  accessToken: createMockToken(),
  refreshToken: createMockToken(),
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
});

const createGuestUserFromEmail = (email: string): User => ({
  _id: Math.floor(100000 + Math.random() * 900000),
  name: email.split("@")[0] || "Guest User",
  username: email.split("@")[0] || "guest",
  email,
  role: "Customer",
  status: "Active",
});

export const authMock = {
  async sendOtp(payload: SendOtpPayload) {
    await new Promise((resolve) => setTimeout(resolve, 900));

    if (!payload.email.includes("@")) {
      throw {
        title: "Invalid email",
        message: "Please enter a valid email address.",
      };
    }

    const user = await findUserByEmail(payload.email);

    return {
      user: user ?? createGuestUserFromEmail(payload.email),
      sentAt: new Date().toISOString(),
    };
  },

  async verifyOtp(payload: VerifyOtpPayload) {
    await new Promise((resolve) => setTimeout(resolve, 900));

    if (payload.otp !== OTP_VALUE) {
      throw {
        title: "Incorrect OTP",
        message: "The OTP you entered is incorrect. Please try again.",
      };
    }

    const user = (await findUserByEmail(payload.email)) ?? createGuestUserFromEmail(payload.email);

    return {
      user,
      session: createSession(),
    };
  },

  async refreshSession() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return createSession();
  },
};
