"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function ScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<{
    verified: boolean;
    team_id?: string;
    team_name?: string;
    row_number?: number;
    member1: {
      name: string;
      reg_number: string;
      status: string;
      is_present: boolean;
    };
    member2: {
      name: string;
      reg_number: string;
      status: string;
      is_present: boolean;
    };
    scanned_reg?: string;
  } | { verified: false } | null>(null);
  const [error, setError] = useState<string>('');
  const [isMarking, setIsMarking] = useState<number | null>(null); // Track which member is being marked (1, 2, or null)
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const stopScanner = useCallback(async () => {
    try {
      if (scannerRef.current) {
        // Check if scanner is actually running before attempting to stop
        const isRunning = scannerRef.current.isScanning;
        
        if (isRunning) {
          await scannerRef.current.stop();
          console.log('Scanner stopped successfully');
        }
        setIsScanning(false);
      }
    } catch (error) {
      console.log('Error while stopping scanner:', error);
    
      setIsScanning(false);
    }
  }, []);

  const startScanner = async () => {
    try {
      // First ensure any existing scanner is properly stopped
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch (e) {
          console.log('Cleanup of previous scanner instance:', e);
        }
      }

      if (!window.isSecureContext) {
        throw new Error('Page must be served over HTTPS to access the camera');
      }

      // Request camera permissions with explicit mobile configuration
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      // Test camera access first
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      // Stop the test stream immediately
      stream.getTracks().forEach(track => track.stop());

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader");
      }

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        formatsToSupport: ["QR_CODE"]
      };

      await scannerRef.current.start(
        { facingMode: "environment" },
        config,
        async (decodedText) => {
          // QR code contains registration number
          try {
            const response = await fetch(
              `/api/py/lookup-team?reg_number=${encodeURIComponent(decodedText)}`,
              { cache: 'no-store' }
            );
            
            if (response.ok) {
              const data = await response.json();
              setResult({
                verified: true,
                team_id: data.team_id,
                team_name: data.team_name,
                row_number: data.row_number,
                member1: {
                  name: data.member1.name,
                  reg_number: data.member1.reg_number,
                  status: data.member1.status,
                  is_present: data.member1.is_present
                },
                member2: {
                  name: data.member2.name,
                  reg_number: data.member2.reg_number,
                  status: data.member2.status,
                  is_present: data.member2.is_present
                },
                scanned_reg: decodedText
              });
              stopScanner();
            } else {
              setResult({ verified: false });
              stopScanner();
            }
          } catch (err) {
            console.error('Lookup error:', err);
            setResult({ verified: false });
            stopScanner();
          }
        },
        (errorMessage) => {
          // Only log critical errors
          if (!errorMessage.includes('Frame')) {
            console.warn('Scan error:', errorMessage);
          }
        }
      );
      setIsScanning(true);
      setError('');
    } catch (err) {
      let errorMessage = 'Failed to start scanner';
      if (err instanceof Error) {
        errorMessage = err.message;
        // Add more specific error messages
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Camera permission denied. Please allow camera access and try again.';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'No camera found. Please ensure your device has a working camera.';
        } else if (err.name === 'NotReadableError') {
          errorMessage = 'Camera is in use by another application. Please close other apps using the camera.';
        }
      }
      setError(errorMessage);
      console.error('Scanner error:', err);
    }
  };

  const markEntry = async (memberNumber: 1 | 2) => {
    if (!result || !result.verified || !('row_number' in result) || !result.row_number) return;

    setIsMarking(memberNumber);
    try {
      const formData = new FormData();
      formData.append('row_number', result.row_number.toString());
      formData.append('member_number', memberNumber.toString());

      const response = await fetch('/api/py/mark-entry', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        // Update the specific member's attendance status
        setResult(prev => {
          if (!prev || !prev.verified) return prev;
          if (memberNumber === 1) {
            return {
              ...prev,
              member1: { ...prev.member1, is_present: true, status: 'Present' }
            };
          } else {
            return {
              ...prev,
              member2: { ...prev.member2, is_present: true, status: 'Present' }
            };
          }
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.detail || 'Failed to mark entry');
      }
    } catch (err) {
      console.error('Mark entry error:', err);
      setError('Failed to mark entry');
    } finally {
      setIsMarking(null);
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop().catch(console.error);
        } catch (error) {
          console.log('Cleanup error:', error);
        }
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-200">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Ticket Scanner
        </h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-200">
            <p className="font-medium">{error}</p>
            {error.includes('permission') && (
              <p className="text-sm mt-2 text-red-600 dark:text-red-300">
                Please check your browser settings and ensure camera permissions are enabled.
                You may need to refresh the page after allowing access.
              </p>
            )}
            {error.includes('HTTPS') && (
              <p className="text-sm mt-2 text-red-600 dark:text-red-300">
                This feature requires a secure HTTPS connection. Please ensure you&apos;re accessing the site via HTTPS.
              </p>
            )}
          </div>
        )}

        {!isScanning ? (
          <button
            onClick={startScanner}
            className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-xl mb-6 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Start Scanner
          </button>
        ) : (
          <button
            onClick={stopScanner}
            className="w-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-medium py-4 px-6 rounded-xl mb-6 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Stop Scanner
          </button>
        )}

        <div id="qr-reader" className="mb-6 overflow-hidden rounded-xl shadow-inner dark:bg-gray-700" />

        {result && (
          <div className={`p-6 rounded-xl transition-all duration-200 ${
            result.verified 
              ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800' 
              : 'bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
          }`}>
            {result.verified && 'member1' in result ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="font-bold text-lg">Valid Registration</span>
                </div>
                
                {/* Team Information */}
                <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium uppercase">Team ID</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">#{result.team_id}</p>
                  </div>
                  
                  {result.team_name && result.team_name !== 'N/A' && (
                    <div className="pt-2 border-t border-green-200 dark:border-green-700">
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium uppercase">Team Name</p>
                      <p className="text-lg font-semibold text-green-900 dark:text-green-100">{result.team_name}</p>
                    </div>
                  )}
                </div>
                
                {/* Team Members */}
                <div>
                  <p className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">Team Members:</p>
                  <div className="space-y-3">
                    {/* Member 1 */}
                    <div className={`bg-white/60 dark:bg-black/30 rounded-lg p-3 ${
                      result.scanned_reg?.toLowerCase() === result.member1.reg_number?.toLowerCase() 
                        ? 'ring-2 ring-green-500' 
                        : ''
                    }`}>
                      <div className="flex items-start mb-2">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                          1
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-green-900 dark:text-green-100 truncate">{result.member1.name}</p>
                          <p className="text-sm text-green-700 dark:text-green-300 font-mono">{result.member1.reg_number}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {result.scanned_reg?.toLowerCase() === result.member1.reg_number?.toLowerCase() && (
                              <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                                Scanned
                              </span>
                            )}
                            {result.member1.is_present && (
                              <span className="text-xs bg-green-700 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                                Present
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {!result.member1.is_present && (
                        <button
                          onClick={() => markEntry(1)}
                          disabled={isMarking !== null}
                          className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                            isMarking === 1
                              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white'
                              : 'bg-green-600 hover:bg-green-700 text-white shadow hover:shadow-md'
                          }`}
                        >
                          {isMarking === 1 ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Marking...
                            </span>
                          ) : (
                            'Mark Present'
                          )}
                        </button>
                      )}
                    </div>
                    
                    {/* Member 2 */}
                    <div className={`bg-white/60 dark:bg-black/30 rounded-lg p-3 ${
                      result.scanned_reg?.toLowerCase() === result.member2.reg_number?.toLowerCase() 
                        ? 'ring-2 ring-green-500' 
                        : ''
                    }`}>
                      <div className="flex items-start mb-2">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                          2
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-green-900 dark:text-green-100 truncate">{result.member2.name}</p>
                          <p className="text-sm text-green-700 dark:text-green-300 font-mono">{result.member2.reg_number}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {result.scanned_reg?.toLowerCase() === result.member2.reg_number?.toLowerCase() && (
                              <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                                Scanned
                              </span>
                            )}
                            {result.member2.is_present && (
                              <span className="text-xs bg-green-700 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                                Present
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {!result.member2.is_present && (
                        <button
                          onClick={() => markEntry(2)}
                          disabled={isMarking !== null}
                          className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                            isMarking === 2
                              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white'
                              : 'bg-green-600 hover:bg-green-700 text-white shadow hover:shadow-md'
                          }`}
                        >
                          {isMarking === 2 ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Marking...
                            </span>
                          ) : (
                            'Mark Present'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Status Summary */}
                {result.member1.is_present && result.member2.is_present && (
                  <div className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold text-center flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Both Members Marked as Present
                  </div>
                )}
                
                {/* Scan Another Button */}
                <button
                  onClick={() => {
                    setResult(null);
                    setError('');
                    startScanner();
                  }}
                  className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
                >
                  Scan Another
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <span className="font-bold text-lg">Invalid Code</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
