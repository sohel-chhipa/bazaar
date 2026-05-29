import { ArrowRight, Mail, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { authMock } from "@/mocks/services/auth.mock";
import { PAGE_URLS } from "@/routes/page-urls";
import RunAPI from "@/shared/api/RunAPI";
import { useApiError } from "@/shared/hooks/use-api-error";
import { useAuthStore } from "@/shared/store/auth.store";
import { useUiStore } from "@/shared/store/ui.store";
import { Button, FormField, Modal } from "@/shared/ui";
import {
  sendOtpSchema,
  verifyOtpSchema,
  type SendOtpForm,
  type VerifyOtpForm,
} from "@/shared/validation/schemas/auth.schema";

type Step = "email" | "otp";

const RESEND_TIMEOUT = 14;

const formatResend = (seconds: number) => `0:${String(seconds).padStart(2, "0")}`;

export function AuthModal() {
  const navigate = useNavigate();
  const { onApiError } = useApiError();

  const isOpen = useUiStore((state) => state.isAuthModalOpen);
  const closeModal = useUiStore((state) => state.closeAuthModal);
  const authReason = useUiStore((state) => state.authModalReason);

  const setSession = useAuthStore((state) => state.setSession);
  const protectedIntent = useAuthStore((state) => state.protectedIntent);
  const clearProtectedIntent = useAuthStore((state) => state.clearProtectedIntent);

  const [step, setStep] = useState<Step>("email");
  const [resendSeconds, setResendSeconds] = useState(RESEND_TIMEOUT);

  const sendOtpForm = useForm<SendOtpForm>({
    resolver: zodResolver(sendOtpSchema),
    defaultValues: { email: "" },
  });

  const verifyOtpForm = useForm<VerifyOtpForm>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { email: "", otp: "" },
  });

  const otp = verifyOtpForm.watch("otp");
  const isSendingOtp = sendOtpForm.formState.isSubmitting;
  const isVerifyingOtp = verifyOtpForm.formState.isSubmitting;

  const resetLocal = () => {
    setStep("email");
    sendOtpForm.reset({ email: "" });
    verifyOtpForm.reset({ email: "", otp: "" });
    setResendSeconds(RESEND_TIMEOUT);
  };

  const handleClose = () => {
    closeModal();
    clearProtectedIntent();
    resetLocal();
  };

  useEffect(() => {
    if (step !== "otp") {
      return;
    }

    const timerId = window.setInterval(() => {
      setResendSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [step]);

  const handleSendOtp = sendOtpForm.handleSubmit(async (payload) => {
    verifyOtpForm.setValue("email", payload.email);

    const api = new RunAPI<SendOtpForm, Awaited<ReturnType<typeof authMock.sendOtp>>>();
    api.setConfig({
      loaderKey: "auth-send-otp",
      apiHandler: {
        fetch: ({ data }) => authMock.sendOtp(data as SendOtpForm),
      },
      onSuccess: () => {
        setStep("otp");
        setResendSeconds(RESEND_TIMEOUT);
      },
      onError: (error) => {
        onApiError(error, {
          title: "Unable to send OTP",
          message: "Please verify your email and try again.",
        });
      },
    });

    await api.executeFetch({ data: payload });
  });

  const handleResendOtp = async () => {
    if (resendSeconds > 0) {
      return;
    }

    await handleSendOtp();
  };

  const handleVerifyOtp = verifyOtpForm.handleSubmit(async (payload) => {
    const api = new RunAPI<VerifyOtpForm, Awaited<ReturnType<typeof authMock.verifyOtp>>>();
    api.setConfig({
      loaderKey: "auth-verify-otp",
      apiHandler: {
        fetch: ({ data }) => authMock.verifyOtp(data as VerifyOtpForm),
      },
      onSuccess: (response) => {
        setSession(response.user, response.session);
        closeModal();

        if (protectedIntent.type === "checkout") {
          navigate(PAGE_URLS.CHECKOUT);
        } else if (protectedIntent.type === "route") {
          navigate(protectedIntent.path);
        }

        clearProtectedIntent();
        resetLocal();
      },
      onError: (error) => {
        onApiError(error, {
          title: "Login failed",
          message: "Please verify OTP and try again.",
        });
      },
    });

    await api.executeFetch({ data: payload });
  });

  const canVerifyOtp = otp.trim().length >= 4;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      showClose={false}
      padding={false}
      contentClassName="max-h-[92vh] overflow-y-auto lg:max-h-none lg:overflow-hidden"
      overlayClassName="p-2 sm:p-4"
    >
      <div className="relative grid overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[1fr_1fr]">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-20 grid h-8 w-8 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:text-foreground"
          aria-label="Close sign in modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative hidden min-h-[540px] overflow-hidden rounded-l-2xl lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,87,230,0.2),transparent_35%),radial-gradient(circle_at_75%_25%,rgba(0,0,0,0.18),transparent_38%),linear-gradient(160deg,#171717_0%,#313131_45%,#626262_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/38 via-black/10 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/85">Bazaar</p>
            <p className="mt-2 text-4xl font-semibold leading-tight">
              India-inspired shopping, made effortless.
            </p>
          </div>
        </div>

        <div className="flex min-h-[480px] flex-col justify-center px-6 py-8 sm:min-h-[540px] sm:px-10 sm:py-10">
          <div className="mx-auto w-full max-w-[360px] space-y-6">
            <div className="space-y-2 text-center">
              <h3 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                Sign in / Sign up
              </h3>
              <p className="text-sm text-muted-foreground">
                {authReason || "Login to continue shopping"}
              </p>
            </div>

            <FormField
              control={sendOtpForm.control}
              name="email"
              label="Email address"
              inputProps={{
                id: "auth-email",
                type: "email",
                placeholder: "Enter your work or personal email",
                inputSize: "lg",
                disabled: step === "otp",
              }}
            />

            {step === "otp" ? (
              <div className="space-y-3">
                <FormField
                  control={verifyOtpForm.control}
                  name="otp"
                  label="One-time password"
                  inputProps={{
                    id: "auth-otp",
                    placeholder: "Enter OTP",
                    inputMode: "numeric",
                    inputSize: "lg",
                  }}
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => void handleResendOtp()}
                    disabled={resendSeconds > 0 || isSendingOtp}
                    className="text-xs font-medium text-muted-foreground transition disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {resendSeconds > 0
                      ? `Resend in ${formatResend(resendSeconds)}`
                      : "Resend OTP"}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  If you cannot find the OTP email, check your spam or promotions folder.
                </p>
              </div>
            ) : null}

            {step === "email" ? (
              <Button
                className="h-12 w-full rounded-xl"
                isLoading={isSendingOtp}
                onClick={() => void handleSendOtp()}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Continue
              </Button>
            ) : (
              <div className="space-y-2">
                <Button
                  className="h-12 w-full rounded-xl"
                  isLoading={isVerifyingOtp}
                  onClick={() => void handleVerifyOtp()}
                  disabled={!canVerifyOtp}
                  rightIcon={<ShieldCheck className="h-4 w-4" />}
                >
                  Verify and continue
                </Button>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="inline-flex w-full items-center justify-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-foreground"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Use a different email
                </button>
              </div>
            )}

            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              By signing in or signing up, you agree to Bazaar’s terms and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
