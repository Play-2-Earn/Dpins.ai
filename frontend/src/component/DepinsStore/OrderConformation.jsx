import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function OrderConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <div className="max-w-md mx-auto glass-effect rounded-2xl p-8 border border-cyan-900/30">
        <div className="text-cyan-400 mb-6">
          <CheckCircle size={64} className="mx-auto" />
        </div>

        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
          Order Successful!
        </h1>

        <p className="text-gray-300 mb-8">
          Thank you for your purchase. We'll send you an email with your order
          details and tracking information.
        </p>

        <button
          onClick={() => navigate("/store")}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 mx-auto animate-glow"
        >
          Continue Shopping
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
