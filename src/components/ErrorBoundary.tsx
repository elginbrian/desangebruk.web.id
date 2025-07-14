"use client";

import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="text-red-500 mb-2">Terjadi kesalahan</div>
            <div className="text-gray-500 text-sm mb-4 text-center">Silakan refresh halaman atau coba lagi nanti</div>
            <button onClick={() => this.setState({ hasError: false, error: undefined })} className="bg-[#1B3A6D] text-white px-4 py-2 rounded-lg hover:bg-[#152f5a] transition-colors text-sm">
              Coba Lagi
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
