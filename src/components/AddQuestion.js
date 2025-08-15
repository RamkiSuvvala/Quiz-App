import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { fetchWithAuth } from "../utils/api";
import "../css/AddQuestion.css";

function AddQuestion({ onQuestionAdded, onExit }) {
  const [formData, setFormData] = useState({
    category: null, // will hold { label, value } or null
    questionTitle: "",
    level: "easy",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    rightAnswer: "",
  });
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); // options: [{value,label}]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const levels = ["easy", "medium", "hard"];

  // Fetch categories from backend and convert to react-select format
  useEffect(() => {
    fetchWithAuth("http://localhost:8080/api/quiz/categories")
      .then((res) => res.json())
      .then((data) => {
        const options = data.map((cat) => ({ value: cat, label: cat }));
        setCategories(options);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (newValue, actionMeta) => {
    setFormData((prev) => ({
      ...prev,
      category: newValue,
    }));
  };

  const clearForm = () => {
    setFormData({
      category: null,
      questionTitle: "",
      level: "easy",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      rightAnswer: "",
    });
    setError(null);
    setSuccessMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Validation
    if (
      !formData.category ||
      !formData.category.value ||
      !formData.questionTitle.trim() ||
      !formData.option1.trim() ||
      !formData.option2.trim() ||
      !formData.option3.trim() ||
      !formData.option4.trim() ||
      !formData.rightAnswer.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (
      ![
        formData.option1,
        formData.option2,
        formData.option3,
        formData.option4,
      ].includes(formData.rightAnswer)
    ) {
      setError("Right answer must match one of the provided options.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetchWithAuth("http://localhost:8080/question/addQuestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          category: formData.category.value, // send string category
        }),
      });

      
      if (!response.ok)
        throw new Error(`Server error: ${response.statusText}`);
      clearForm();
      alert("Question added successfully!");
      if (onQuestionAdded) onQuestionAdded();

      if(response.ok){
        navigate("/manage", { state: { category: formData.category.value, refresh: true } });
      }
      
    } catch (err) {
      setError(err.message || "Failed to add question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addq-container">
      <h2>Add New Question</h2>
      <form className="addq-form" onSubmit={handleSubmit}>
        <label>Category:</label>
        <CreatableSelect
          isClearable
          onChange={handleCategoryChange}
          options={categories}
          value={formData.category}
          placeholder="Select or type category..."
        />

        <label>Question Title:</label>
        <textarea
          name="questionTitle"
          value={formData.questionTitle}
          onChange={handleInputChange}
          rows="3"
          className="question-title-input"
        />

        <label>Level:</label>
        <select
          name="level"
          value={formData.level}
          onChange={handleInputChange}
        >
          {levels.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>

        <label>Option 1:</label>
        <input
          type="text"
          name="option1"
          value={formData.option1}
          onChange={handleInputChange}
        />

        <label>Option 2:</label>
        <input
          type="text"
          name="option2"
          value={formData.option2}
          onChange={handleInputChange}
        />

        <label>Option 3:</label>
        <input
          type="text"
          name="option3"
          value={formData.option3}
          onChange={handleInputChange}
        />

        <label>Option 4:</label>
        <input
          type="text"
          name="option4"
          value={formData.option4}
          onChange={handleInputChange}
        />

        <label>Right Answer:</label>
        <select
          name="rightAnswer"
          value={formData.rightAnswer}
          onChange={handleInputChange}
        >
          <option value="">-- Select Right Answer --</option>
          {[formData.option1, formData.option2, formData.option3, formData.option4]
            .filter(Boolean)
            .map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
        </select>

        {error && <p className="addq-error">{error}</p>}
        {successMsg && <p className="addq-success">{successMsg}</p>}

        <div className="addq-buttons">
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Add Question"}
          </button>
          <button
            type="button"
            onClick={clearForm}
            className="secondary-btn"
            disabled={loading}
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => navigate("/manage", { state: { category: formData.category, refresh: true } })}
            className="danger-btn"
            disabled={loading}
          >
            Exit
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddQuestion;
