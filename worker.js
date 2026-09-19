// PLACEHOLDER FOR API KEY
const PASSNINJA_API_KEY = "YOUR_PASSNINJA_API_KEY_HERE"; // Get this from PassNinja dashboard

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
        
        // Construct the payload for PassNinja API
        const payload = {
            passType: "generic",
            pass: {
                backgroundColor: "rgb(0,0,0)",
                foregroundColor: "rgb(255,255,255)",
                labelColor: "rgb(105,105,105)",
                primaryFields: [
                    {
                        key: "name",
                        label: "NAME",
                        value: name
                    }
                ],
                secondaryFields: [
                    {
                        key: "status",
                        label: "STATUS",
                        value: "I'M CEO, BITCH"
                    }
                ],
                auxiliaryFields: [
                    {
                        key: "serial",
                        label: "SERIAL",
                        value: Math.floor(100 + Math.random() * 900).toString()
                    }
                ],
                barcode: null, // Remove all barcodes
                // Add a QR code linking to a placeholder URL
                barcodes: [
                    {
                        format: "PKBarcodeFormatQR",
                        message: "https://example.com/verify-pass",
                        messageEncoding: "iso-8859-1"
                    }
                ]
            }
        };

        const passApiResponse = await fetch("https://api.passninja.com/v1/passes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": PASSNINJA_API_KEY
            },
            body: JSON.stringify(payload)
        });

        if (!passApiResponse.ok) {
            const errorText = await passApiResponse.text();
            throw new Error(`API Error: ${passApiResponse.status} ${errorText}`);
        }

        const pkpassBuffer = await passApiResponse.arrayBuffer();

        // Return the binary .pkpass file to the frontend
        return new Response(pkpassBuffer, {
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
