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
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">AI Content Generator</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="content" className="block text-sm font-medium">
            Topic or Paragraph
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full border rounded-md p-2"
            rows="5"
            required
          />
        </div>
        <div>
          <label htmlFor="outputType" className="block text-sm font-medium">
            Output Type
          </label>
          <select
            id="outputType"
            value={outputType}
            onChange={(e) => setOutputType(e.target.value)}
            className="mt-1 block w-full border rounded-md p-2"
          >
            <option value="description">Description</option>
            <option value="quiz">Quiz</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {result && (
        <div className="mt-6">
          {outputType === 'description' ? (
            <div>
              <h3 className="text-xl font-semibold">Description</h3>
              <p className="mt-2">{result.description}</p>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-semibold">Quiz</h3>
              {result.questions.map((q, index) => (
                <div key={index} className="mt-4">
                  <p className="font-medium">{q.question}</p>
                  <ul className="mt-2 space-y-1">
                    {q.options.map((option, i) => (
                      <li key={i}>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option}
                            className="mr-2"
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
