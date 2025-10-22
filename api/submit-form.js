export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { Name, Email, Message } = req.body;

  try {
    const response = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Name,
          Email,
          Message,
        },
      }),
    });

    if (!response.ok) throw new Error("Airtable API error");

    res.status(200).json({ message: "Success! Record added to Airtable." });
  } catch (err) {
    res.status(500).json({ message: "Error submitting form", error: err.message });
  }
}
