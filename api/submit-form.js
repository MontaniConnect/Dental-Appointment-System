export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { Name, Email, Message, Service_Needed, Other, Time_Date, Age, Phone_Number, Address, Patient_Type, Source, Referred_By } = req.body;

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: { Name, Email, Message, Service_Needed, Other, Time_Date, Age, Phone_Number, Address, Patient_Type, Source, Referred_By },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        message: "Airtable error",
        error: errorText,
      });
    }

    const result = await response.json();

    // ✅ Send a success response so frontend doesn't error
    return res.status(200).json({
      success: true,
      message: "Form submitted successfully!",
      record: result,
    });

  } catch (err) {
    console.error("Error submitting to Airtable:", err);
    return res
      .status(500)
      .json({ message: "Error submitting form", error: err.message });
  }
}
