"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Lock,
} from "lucide-react";

interface TemplateInfo {
  title: string;
  slug: string;
  price: number;
  format?: string;
  thumbnail?: string;
}

interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: TemplateInfo | null;
  onSuccess?: (details: any) => void;
}

// Helper to dynamically load the Razorpay checkout.js script
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function RazorpayCheckoutModal({
  isOpen,
  onClose,
  template,
  onSuccess,
}: RazorpayCheckoutModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [loadingConfig, setLoadingConfig] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState<{
    isActive: boolean;
    mode: "test" | "live";
    keyId: string;
    currency: string;
  } | null>(null);

  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Load gateway status when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setCompletedOrder(null);
      setLoadingConfig(true);
      fetch("/api/payment/config")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setPaymentConfig({
              isActive: data.isActive,
              mode: data.mode,
              keyId: data.keyId,
              currency: data.currency || "INR",
            });
          }
        })
        .catch(() => {
          setErrorMessage("Failed to load payment configuration");
        })
        .finally(() => {
          setLoadingConfig(false);
        });

      // Pre-load Razorpay script
      loadRazorpayScript();
    }
  }, [isOpen]);

  if (!isOpen || !template) return null;

  const price = template.price || 499;

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage("Please enter your name / couple name");
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      setErrorMessage("Please enter a valid 10-digit WhatsApp phone number");
      return;
    }

    try {
      setProcessing(true);

      // 1. Ensure Razorpay script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded || !(window as any).Razorpay) {
        setErrorMessage(
          "Could not load Razorpay checkout script. Please check your internet connection."
        );
        setProcessing(false);
        return;
      }

      // 2. Create Order on Backend
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateSlug: template.slug,
          templateTitle: template.title,
          amount: price,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim(),
        }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        setErrorMessage(
          orderData.error || "Failed to initiate payment. Please contact support."
        );
        setProcessing(false);
        return;
      }

      // 3. Configure Razorpay Standard Checkout Options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "VivahVaani",
        description: `Wedding Patrika: ${template.title}`,
        image: "/favicon.png",
        order_id: orderData.orderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        notes: {
          templateSlug: template.slug,
          internalOrderId: orderData.internalOrderId,
        },
        theme: {
          color: "#720E16",
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
          backdropclose: false,
          escape: true,
        },
        handler: async function (response: any) {
          try {
            setProcessing(true);
            // 4. Verify payment on Backend
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: orderData.dbOrderId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              setCompletedOrder({
                ...verifyData.order,
                razorpayPaymentId: response.razorpay_payment_id,
              });
              if (onSuccess) {
                onSuccess(verifyData.order);
              }
            } else {
              setErrorMessage(
                verifyData.error || "Payment verification failed. Please contact support."
              );
            }
          } catch (err: any) {
            setErrorMessage("Error verifying payment transaction.");
          } finally {
            setProcessing(false);
          }
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);

      razorpayInstance.on("payment.failed", function (response: any) {
        console.error("Razorpay Payment Failed:", response.error);
        setErrorMessage(
          response.error?.description || "Payment failed or was declined by bank."
        );
        setProcessing(false);
      });

      razorpayInstance.open();
    } catch (error: any) {
      console.error("Payment checkout error:", error);
      setErrorMessage(error?.message || "An unexpected error occurred.");
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ----------------------------------------------------
            SUCCESS STATE: Payment Completed
           ---------------------------------------------------- */}
        {completedOrder ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner ring-4 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Payment Verified &amp; Confirmed
              </span>
              <h3 className="font-serif font-bold text-xl text-stone-900 mt-2">
                Shubh Aarambh! Order Confirmed
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Aapka payment safalta-purvak receive ho gaya hai. Aapka design{" "}
                <strong>{template.title}</strong> activate ho gaya hai.
              </p>
            </div>

            {/* Receipt Details Box */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-left text-xs space-y-1.5 font-sans">
              <div className="flex justify-between text-stone-600">
                <span>Order Ref:</span>
                <span className="font-mono font-bold text-stone-900">
                  {completedOrder.orderId}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Razorpay Payment ID:</span>
                <span className="font-mono text-stone-900 text-[11px]">
                  {completedOrder.razorpayPaymentId}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Paid Amount:</span>
                <span className="font-serif font-bold text-emerald-700">
                  ₹{completedOrder.amount || price}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Customer:</span>
                <span className="font-semibold text-stone-900">{customerName}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <Link
                href={`/customize/${encodeURIComponent(template.slug)}`}
                className="w-full py-3.5 rounded-xl bg-[#720E16] hover:bg-[#5A0910] text-[#FFF3DA] font-bold text-xs sm:text-sm text-center shadow-md transition flex items-center justify-center gap-2"
                onClick={onClose}
              >
                <span>Customize Wedding Details Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-xs font-semibold text-stone-500 hover:text-stone-800"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* ----------------------------------------------------
             CHECKOUT FORM
             ---------------------------------------------------- */
          <form onSubmit={handlePayNow} className="space-y-4">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Razorpay Secure Checkout
                </span>
                {paymentConfig?.mode === "test" && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300">
                    🧪 Test Mode
                  </span>
                )}
                {paymentConfig?.mode === "live" && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                    Live
                  </span>
                )}
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900 mt-1">
                {template.title}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Instant delivery &bull; Lifetime active hosting &bull; No recurring fee
              </p>
            </div>

            {/* Price & Summary Box */}
            <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-stone-500 block">
                  Total Payable Amount
                </span>
                <span className="text-2xl font-serif font-bold text-[#720E16]">
                  ₹{price}
                </span>
                <span className="text-[11px] text-stone-500 ml-1">all taxes incl.</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300 block">
                  100% Lifetime Valid
                </span>
                <span className="text-[11px] text-stone-500 block mt-1">
                  Single Event License
                </span>
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Customer Inputs */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Your Name / Groom &amp; Bride <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-[#720E16] focus:ring-1 focus:ring-[#720E16] transition"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  WhatsApp Mobile Number <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9826012345"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-[#720E16] focus:ring-1 focus:ring-[#720E16] transition"
                />
                <p className="text-[10px] text-stone-400 mt-1">
                  Your customized invitation card link will be sent here
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Email Address <span className="text-stone-400 font-normal">(optional for receipt)</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-[#720E16] focus:ring-1 focus:ring-[#720E16] transition"
                />
              </div>
            </div>

            {/* Gateway Inactive Alert */}
            {paymentConfig && !paymentConfig.isActive && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  Razorpay credentials are being configured by admin. You can test in demo mode once credentials are saved.
                </span>
              </div>
            )}

            {/* Pay Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={processing || loadingConfig}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#720E16] via-[#8B1A24] to-[#5A0910] hover:from-[#5A0910] hover:to-[#42060B] text-[#FFF3DA] font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-200" />
                    <span>Opening Razorpay Secure Gateway...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-amber-300" />
                    <span>
                      Pay ₹{price} via Razorpay {paymentConfig?.mode === "test" ? "(Test Mode)" : ""}
                    </span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 text-[10px] text-stone-400 text-center mt-2.5">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-bit SSL Encrypted</span>
                </span>
                <span>&bull;</span>
                <span>UPI / Cards / NetBanking</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
