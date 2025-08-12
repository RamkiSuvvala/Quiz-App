import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../css/EditQuestion.css";

function EditQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const categoryFromList = location.state?.category;
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch question by ID when component loads
  useEffect(() => {
    fetch(`http://localhost:8080/question/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          questionId: data.questionId || data.question_id || data.id,
          category: data.category,
          questionTitle: data.questionTitle || data.question_title,
          level: data.level,
          option1: data.option1,
          option2: data.option2,
          option3: data.option3,
          option4: data.option4,
          rightAnswer: data.rightAnswer || data.right_answer
        });
      })
      .catch((err) => console.error("Error fetching question:", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setLoading(true);
    fetch(`http://localhost:8080/api/questions/${formData.questionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then(() => {
        alert("Question updated!");
        navigate("/manage"); // go back to list screen
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="edit-question-container">
      <h2>Edit Question</h2>

      <label>
        Question Title:
        <textarea
          name="questionTitle"
          value={formData.questionTitle || ""}
          onChange={handleChange}
          rows="3"
        />
      </label>

      <label>
        Level:
        <select name="level" value={formData.level || ""} onChange={handleChange}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>

      <label>Option 1:
        <input type="text" name="option1" value={formData.option1 || ""} onChange={handleChange} />
      </label>
      <label>Option 2:
        <input type="text" name="option2" value={formData.option2 || ""} onChange={handleChange} />
      </label>
      <label>Option 3:
        <input type="text" name="option3" value={formData.option3 || ""} onChange={handleChange} />
      </label>
      <label>Option 4:
        <input type="text" name="option4" value={formData.option4 || ""} onChange={handleChange} />
      </label>

      <label>
        Right Answer:
        <input type="text" name="rightAnswer" value={formData.rightAnswer || ""} onChange={handleChange} />
      </label>

      <div className="edit-btns">
        <button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
        <button
            className="secondary-btn"
            onClick={() => navigate("/manage", { state: { category: categoryFromList, refresh: true } })} >
            Cancel
        </button>

      </div>
    </div>
  );
}

export default EditQuestion;
