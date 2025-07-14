import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://evodegqwygnjtusbkdoy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2b2RlZ3F3eWduanR1c2JrZG95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0ODk0MDksImV4cCI6MjA2ODA2NTQwOX0.AiCy7Et2mKXrT7V-yW5rNgtw8F_ZJLV5j7ae7uZ6JOM";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function FeedbackForm() {
  const [step, setStep] = useState(1);
  const [npsScore, setNpsScore] = useState(null);
  const [comment, setComment] = useState("");
  const [valueScore, setValueScore] = useState(null);
  const [averageNPS, setAverageNPS] = useState(null);

  useEffect(() => {
    const fetchAverageNPS = async () => {
      const { data, error } = await supabase.from("feedback").select("nps_score");
      if (error) return console.error("Error fetching NPS scores:", error);
      const scores = data.map(d => d.nps_score);
      const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null;
      setAverageNPS(avg);
    };
    fetchAverageNPS();
  }, [step]);

  const handleSubmit = async () => {
    const payload = {
      nps_score: npsScore,
      comment,
      value_score: valueScore,
      submitted_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("feedback").insert([payload]);

    if (error) {
      console.error("Submission error:", error);
      return;
    }

    setStep(4);
  };

  const renderScale = (selected, setSelected) => (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '10px' }}>
      {Array.from({ length: 11 }).map((_, i) => (
        <button
          key={i}
          style={{
            padding: '6px 10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: selected === i ? 'black' : 'white',
            color: selected === i ? 'white' : 'black'
          }}
          onClick={() => setSelected(i)}
        >
          {i}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      {averageNPS !== null && (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <strong>Average NPS Score:</strong> {averageNPS}
        </div>
      )}
      <div>
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>
              How likely are you to recommend Wendo Coffee and Bistro to a friend or colleague?
            </h2>
            {renderScale(npsScore, setNpsScore)}
            <button
              style={{ marginTop: '20px', width: '100%', padding: '10px', backgroundColor: 'black', color: 'white', borderRadius: '4px' }}
              disabled={npsScore === null}
              onClick={() => setStep(2)}
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>What’s the main reason for your score?</h2>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Type your feedback here..."
              style={{ marginTop: '10px', width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <button
              style={{ marginTop: '20px', width: '100%', padding: '10px', backgroundColor: 'black', color: 'white', borderRadius: '4px' }}
              disabled={!comment.trim()}
              onClick={() => setStep(3)}
            >
              Next
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>
              How likely are you to say that Wendo Coffee and Bistro offers good value for money?
            </h2>
            {renderScale(valueScore, setValueScore)}
            <button
              style={{ marginTop: '20px', width: '100%', padding: '10px', backgroundColor: 'black', color: 'white', borderRadius: '4px' }}
              disabled={valueScore === null}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        )}

        {step === 4 && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Thank you for your feedback! 🙏</h2>
            <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
              We appreciate your input and use it to make Wendo Coffee and Bistro better every day.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
