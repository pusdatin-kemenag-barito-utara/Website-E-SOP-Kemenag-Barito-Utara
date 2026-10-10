import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 md:p-8 m-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 shadow-lg text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
            {this.props.fallbackTitle || "Terjadi Kendala pada Tampilan Ini"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
            Sistem mendeteksi kendala format data. Halaman dapat disegarkan kembali untuk melanjutkan pekerjaan.
          </p>
          {this.state.error?.message && (
            <div className="text-[11px] font-mono text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/30 p-2.5 rounded-xl border border-rose-100 dark:border-rose-900/30 mb-5 break-all text-left">
              {this.state.error.message}
            </div>
          )}
          <div className="flex items-center justify-center gap-2">
            <Button
              type="button"
              onClick={this.handleReload}
              className="h-9 px-4 text-xs font-bold rounded-xl bg-[#015C3A] text-white hover:bg-[#014A2E] cursor-pointer inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Muat Ulang Halaman</span>
            </Button>
            {this.props.onReset && (
              <Button
                type="button"
                variant="outline"
                onClick={this.handleReset}
                className="h-9 px-4 text-xs font-bold rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Coba Lagi
              </Button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
