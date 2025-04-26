import React, { useState } from 'react';
import axios from 'axios';

const AIContentGenerator = () => {
  const [content, setContent] = useState('');
  const [outputType, setOutputType] = useState('description');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/ai/generate`,
        { content, output_type: outputType },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        AI Content Generator
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="content" style={{ display: 'block', marginBottom: '5px' }}>
            Topic or Paragraph
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '100px' }}
            required
          />
        </div>
        <div>
          <label htmlFor="outputType" style={{ display: 'block', marginBottom: '5px' }}>
            Output Type
          </label>
          <select
            id="outputType"
            value={outputType}
            onChange={(e) => setOutputType(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="description">Description</option>
            <option value="quiz">Quiz</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            padding: '10px',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '20px' }}>
          {outputType === 'description' ? (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Description</h3>
              <p style={{ marginTop: '10px' }}>{result.description}</p>
            </div>
          ) : (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Quiz</h3>
              {result.questions.map((q, index) => (
                <div key={index} style={{ marginTop: '15px' }}>
                  <p style={{ fontWeight: 'medium' }}>{q.question}</p>
                  <ul style={{ marginTop: '10px', listStyle: 'none', padding: '0' }}>
                    {q.options.map((option, i) => (
                      <li key={i} style={{ marginBottom: '5px' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option}
                            style={{ marginRight: '10px' }}
                          />
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIContentGenerator;
