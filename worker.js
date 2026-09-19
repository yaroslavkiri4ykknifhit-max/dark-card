// worker.js

// --- CONFIGURATION ---
const WALLETWALLET_API_KEY = "ww_live_30205b4812623bbf54de305c188e430b";

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        }
      });
    }

    if (request.method === "POST") {
      try {
        const { name } = await request.json();
        const serial = Math.floor(100 + Math.random() * 900).toString();
        
        // Construct the payload for WalletWallet API
        const payload = {
            barcodeValue: `CENTURION-${serial}`,
            barcodeFormat: "QR",
            logoText: "CENTURION",
            hexBackgroundColor: "#000000",
            primaryFields: [
                {
                    label: "NAME",
                    value: name || "Elite Member"
                }
            ],
            secondaryFields: [
                {
                    label: "STATUS",
                    value: "I'M CEO, BITCH"
                }
            ],
            auxiliaryFields: [
                {
                    label: "SERIAL",
                    value: serial
                }
            ]
        };

        const passApiResponse = await fetch("https://api.walletwallet.dev/api/passes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${WALLETWALLET_API_KEY}`
            },
            body: JSON.stringify(payload)
        });

        if (!passApiResponse.ok) {
            const errorText = await passApiResponse.text();
            console.error("WalletWallet Error:", errorText);
            throw new Error(`WalletWallet API Error: ${passApiResponse.status} ${errorText}`);
        }

        const data = await passApiResponse.json();

        if (!data.applePass) {
             throw new Error("No applePass returned from WalletWallet API.");
        }

        // Decode base64 to binary ArrayBuffer
        const binaryString = atob(data.applePass);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Return the binary .pkpass file to the frontend
        return new Response(bytes.buffer, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/vnd.apple.pkpass",
            "Content-Disposition": 'attachment; filename="blackcard.pkpass"'
          }
        });

      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          }
        });
      }
    }

    return new Response("Method not allowed", { 
        status: 405,
        headers: { "Access-Control-Allow-Origin": "*" }
    });
  }
};
