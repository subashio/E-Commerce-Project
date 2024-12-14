import { Button } from "@/components/ui/button";
import { SummaryApi } from "@/constants/SummaryApi";
import Axios from "@/lib/Axios";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function VerfiyEmail() {
  const [searchParams] = useSearchParams();
  const [verify, setVerify] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  // Determine message color based on content
  const getColorClass = (message: string | null) => {
    if (!message) return "";
    if (message.toLowerCase().includes("success")) return "text-green-500";
    if (
      message.toLowerCase().includes("error") ||
      message.toLowerCase().includes("failed")
    )
      return "text-red-500";
    return "text-gray-500";
  };

  const handleVerify = async () => {
    const code = searchParams.get("code");
    if (!code) {
      setVerify("No verification code found in the URL.");
      return;
    }

    setIsLoading(true); // Start loading
    setVerify(null); // Clear any previous message

    try {
      const response = await Axios({
        ...SummaryApi.verify_email,
        data: { code }, // Axios handles JSON serialization
      });

      if (response.status === 200) {
        setVerify("Verification successful!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setVerify("Verification failed.");
      }
    } catch (error: any) {
      console.error("Error:", error.response || error.message);
      setVerify("An error occurred during verification.");
    } finally {
      setIsLoading(false); // End loading
    }
  };
  return (
    <div className="flex h-[60vh] w-full flex-col items-center justify-center px-10">
      <div className="flex flex-col items-start gap-6 bg-background">
        <img src="/logo.png" alt="logo" />
        <h1 className="text-2xl font-semibold">Confirm your account</h1>
        <p>
          Please click the button below to confirm your email address and finish
          setting up your account. This link is valid for 15 minutes.
        </p>
        {verify && (
          <p className={cn("mt-2", getColorClass(verify))}>{verify}</p>
        )}
        <hr className="h-[1px] w-full border-0 bg-slate-600/20" />
        <Button onClick={handleVerify} disabled={isLoading}>
          Confirm{isLoading && <Loader className="animate-spin" />}
        </Button>
      </div>
    </div>
  );
}
