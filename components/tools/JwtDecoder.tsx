"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Check, Terminal, AlertCircle, Clock, ShieldCheck, ShieldAlert } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Enhanced Base64 URL decoding with better error handling
const base64UrlDecode = (str: string): string => {
  if (!str || typeof str !== 'string') {
    throw new Error('Input must be a non-empty string');
  }

  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding if needed
  const padLength = base64.length % 4;
  if (padLength) {
    base64 += '='.repeat(4 - padLength);
  }

  try {
    const decoded = atob(base64);
    return decodeURIComponent(escape(decoded));
  } catch (e) {
    console.error("Base64 URL decode error:", e);
    throw new Error("Invalid Base64 URL encoding");
  }
};

// Enhanced JWT validation
const validateJwtStructure = (token: string): boolean => {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  return parts.length === 3 && parts.every(part => part.length > 0);
};

// Enhanced copy function with better error handling
const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!text) return false;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    try {
      const el = document.createElement('textarea');
      el.value = text;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      return true;
    } catch {
      return false;
    }
  }
};

// Enhanced expiry status calculation
const getExpiryStatus = (exp: number | undefined): { status: string; color: string } => {
  if (exp === undefined) {
    return { status: "No expiration claim (exp) found", color: "text-muted-foreground" };
  }

  const expirationTime = exp * 1000;
  const currentTime = Date.now();
  const isExpired = expirationTime < currentTime;

  if (isExpired) {
    const expiryDate = new Date(expirationTime);
    return {
      status: `Expired on ${expiryDate.toLocaleString()}`,
      color: "text-destructive"
    };
  }

  const remainingMs = expirationTime - currentTime;
  const remainingSecs = Math.floor(remainingMs / 1000);
  const remainingMins = Math.floor(remainingSecs / 60);
  const remainingHours = Math.floor(remainingMins / 60);
  const remainingDays = Math.floor(remainingHours / 24);

  let remainingText = "Valid";
  if (remainingDays > 0) {
    remainingText += ` (Expires in ${remainingDays} days)`;
  } else if (remainingHours > 0) {
    remainingText += ` (Expires in ${remainingHours} hours)`;
  } else if (remainingMins > 0) {
    remainingText += ` (Expires in ${remainingMins} minutes)`;
  } else if (remainingSecs > 0) {
    remainingText += ` (Expires in ${remainingSecs} seconds)`;
  } else {
    remainingText += ` (Expires very soon)`;
  }

  const expiryDate = new Date(expirationTime);
  return {
    status: `${remainingText} (at ${expiryDate.toLocaleString()})`,
    color: "text-accent-foreground"
  };
};

export default function JwtDecoder() {
  const [jwtToken, setJwtToken] = useState<string>("");
  const [decodedHeader, setDecodedHeader] = useState<string>("");
  const [decodedPayload, setDecodedPayload] = useState<string>("");
  const [expiryStatus, setExpiryStatus] = useState<{ status: string; color: string }>({
    status: "",
    color: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [isValidJwt, setIsValidJwt] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("decode");

  // Copy states
  const [copiedHeader, setCopiedHeader] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedFullToken, setCopiedFullToken] = useState(false);

  const handleCopy = useCallback(async (text: string, setState: React.Dispatch<React.SetStateAction<boolean>>) => {
    const success = await copyToClipboard(text);
    if (success) {
      setState(true);
      setTimeout(() => setState(false), 2000);
    }
  }, []);

  const decodeJwt = useCallback((token: string) => {
    setError(null);
    setDecodedHeader("");
    setDecodedPayload("");
    setExpiryStatus({ status: "", color: "" });
    setIsValidJwt(false);

    if (!token) return;

    if (!validateJwtStructure(token)) {
      setError("Invalid JWT format: A JWT must have 3 parts separated by dots (header.payload.signature).");
      return;
    }

    const [headerB64, payloadB64] = token.split('.').slice(0, 2);

    try {
      const decodedHeaderStr = base64UrlDecode(headerB64);
      const decodedPayloadStr = base64UrlDecode(payloadB64);

      const header = JSON.parse(decodedHeaderStr);
      const payload = JSON.parse(decodedPayloadStr);

      setDecodedHeader(JSON.stringify(header, null, 2));
      setDecodedPayload(JSON.stringify(payload, null, 2));
      setExpiryStatus(getExpiryStatus(payload.exp));
      setIsValidJwt(true);

    } catch (e: any) {
      setError(`Error decoding JWT: ${e.message}`);
      console.error("JWT Decoding Error:", e);
    }
  }, []);

  useEffect(() => {
    decodeJwt(jwtToken);
  }, [jwtToken, decodeJwt]);

  // Syntax highlighting for JSON (simple implementation)
  const syntaxHighlight = (json: string) => {
    if (!json) return json;
    return json
      .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?)/g, match => {
        return match.replace(/^"/, '<span class="text-blue-500">"').replace(/"$/, '"</span>');
      })
      .replace(/\b(true|false|null)\b/g, '<span class="text-purple-500">$1</span>')
      .replace(/\b-?\d+(\.\d+)?([eE][+-]?\d+)?\b/g, '<span class="text-green-500">$&</span>');
  };

  return (
    <div className="flex flex-col gap-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="decode">Decode</TabsTrigger>
          <TabsTrigger value="generate">Generate</TabsTrigger>
        </TabsList>

        <TabsContent value="decode">
          <div className="grid w-full items-center gap-1.5 mt-4">
            <Label htmlFor="jwt-input" className="text-foreground">Enter JWT Token</Label>
            <Textarea
              id="jwt-input"
              placeholder="Paste your JWT token here..."
              value={jwtToken}
              onChange={(e) => setJwtToken(e.target.value)}
              className="min-h-[120px] font-mono"
            />
            <div className="flex gap-2 mt-2">
              <Button
                onClick={() => handleCopy(jwtToken, setCopiedFullToken)}
                className="w-fit bg-primary text-primary-foreground hover:bg-primary/90"
                aria-label="Copy full JWT token"
              >
                {copiedFullToken ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copiedFullToken ? "Copied!" : "Copy Token"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setJwtToken("")}
                aria-label="Clear token"
              >
                Clear
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {jwtToken && !error && (
            <div className="grid lg:grid-cols-2 gap-6 mt-4">
              <Card className="bg-card text-card-foreground">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-semibold">Header</CardTitle>
                    {isValidJwt && (
                      <Badge variant="secondary" className="text-xs">
                        Valid JSON
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(decodedHeader, setCopiedHeader)}
                    aria-label="Copy header"
                  >
                    {copiedHeader ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div
                    className="overflow-auto text-sm font-mono bg-muted p-4 rounded-md text-foreground border border-border"
                    dangerouslySetInnerHTML={{ __html: syntaxHighlight(decodedHeader || "Header will appear here") }}
                  />
                </CardContent>
              </Card>

              <Card className="bg-card text-card-foreground">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-semibold">Payload</CardTitle>
                    {isValidJwt && (
                      <Badge variant="secondary" className="text-xs">
                        Valid JSON
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(decodedPayload, setCopiedPayload)}
                    aria-label="Copy payload"
                  >
                    {copiedPayload ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div
                    className="overflow-auto text-sm font-mono bg-muted p-4 rounded-md text-foreground border border-border"
                    dangerouslySetInnerHTML={{ __html: syntaxHighlight(decodedPayload || "Payload will appear here") }}
                  />
                  {expiryStatus.status && (
                    <div className={`mt-4 p-3 rounded-md text-sm border ${expiryStatus.color.includes('destructive') ? 'bg-destructive/10 border-destructive' : 'bg-accent/10 border-accent'}`}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">Expiry Status:</span>
                      </div>
                      <p className={`mt-1 ${expiryStatus.color}`}>
                        {expiryStatus.status}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>JWT Generator (Coming Soon)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">This feature will allow you to generate test JWT tokens with custom claims.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}