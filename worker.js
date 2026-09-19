// worker.js

// --- CONFIGURATION ---
// 1. Get your API Key and Account ID from the PassNinja Dashboard settings.
// 2. Create a template in PassNinja. Add a data field with the key "name".
// 3. Paste the Template ID below (usually starts with "ptk_").
const PASSNINJA_API_KEY = "YOUR_PASSNINJA_API_KEY_HERE";
const PASSNINJA_ACCOUNT_ID = "YOUR_PASSNINJA_ACCOUNT_ID_HERE"; 
const PASSNINJA_TEMPLATE_ID = "YOUR_TEMPLATE_ID_HERE"; // e.g., ptk_xyz123

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests for the frontend
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
        
        // PassNinja expects the template ID and a 'pass' object containing the dynamic fields
        // that match the keys you defined in your PassNinja template dashboard.
        const payload = {
            passType: PASSNINJA_TEMPLATE_ID, // some SDKs/APIs use passType, some passTemplate. We will send passTemplate.
            passTemplate: PASSNINJA_TEMPLATE_ID, 
            pass: {
                name: name || "Elite Member" // The key "name" must exist in your PassNinja Template fields!
            }
        };

        const passApiResponse = await fetch("https://api.passninja.com/v1/passes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": PASSNINJA_API_KEY,
                "x-account-id": PASSNINJA_ACCOUNT_ID
            },
            body: JSON.stringify(payload)
        });

        if (!passApiResponse.ok) {
            const errorText = await passApiResponse.text();
            console.error("PassNinja Error:", errorText);
            throw new Error(`PassNinja API Error: ${passApiResponse.status} ${errorText}`);
        }

        const data = await passApiResponse.json();

        // PassNinja returns a landing URL for the pass (e.g. data.urls.landing)
        if (!data.urls || !data.urls.landing) {
             throw new Error("Landing URL not found in PassNinja response.");
        }

        // Return the URL to the frontend so it can redirect the user to download the pass
        return new Response(JSON.stringify({ passUrl: data.urls.landing }), {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
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
