import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/ManageQuestionsByCategory.css";

function ManageQuestionsByCategory() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch categories on component mount
  useEffect(() => {
    fetch("http://localhost:8080/question/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const fetchQuestionsForCategory = (category) => {
    if (category) {
      fetch(`http://localhost:8080/question/category/${category}`)
        .then((res) => res.json())
        .then((data) => setQuestions(data))
        .catch((err) => console.error("Error fetching questions:", err));
    } else {
      setQuestions([]);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchQuestionsForCategory(category);
  };

  const goToEditPage = (questionId) => {
    navigate(`/manage/${questionId}/edit`, {
      state: { category: selectedCategory },
    });
  };

  //  Delete Function
  const handleDelete = (questionId) => {
    // Confirm before deleting
    if (window.confirm("Are you sure you want to delete this question?")) {
      fetch(`http://localhost:8080/question/deleteQuestion/${questionId}`, {
        method: "DELETE",
      })
      .then(response => {
        if (response.ok) {
          alert("Question deleted successfully!");
          // Refresh the list by removing the deleted question from state
          setQuestions(prevQuestions => prevQuestions.filter(q => (q.questionId || q.question_id || q.id) !== questionId));
        } else {
          alert("Failed to delete the question.");
        }
      })
      .catch(err => {
        console.error("Error deleting question:", err);
        alert("An error occurred while deleting the question.");
      });
    }
  };

  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
      // Fetches questions if category is present from navigation state
      fetchQuestionsForCategory(location.state.category);
    }
  }, [location.state]);

  return (
    <div className="manage-container">
      {/* ... h2 and label for category select ... */}
       <h2>Manage Questions by Category</h2>
      <label>
        <span>Select Category:</span>
        <div className="select-wrapper">
            <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            >
            <option value="">-- Select Category --</option>
            {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                {cat}
                </option>
            ))}
            </select>
        </div>
      </label>

      {questions.length > 0 && (
        <ul className="question-list">
          {questions.map((q, idx) => {
            const id = q.questionId || q.question_id || q.id;
            const level = (q.level || "").toLowerCase();
            return (
              <li key={id} className="question-row">
                <span className="question-seq">{idx + 1}.</span>
                <span className="question-title">
                  {q.questionTitle || q.question_title}
                  <span className={`level-badge-inline level-${level}`}>
                    {level.toUpperCase()}
                  </span>
                </span>
                <div className="action-icons">
                    <button onClick={() => goToEditPage(id)} className="icon-btn edit-icon-btn" title="Edit Question">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    {/* ✅ New Delete Icon Button */}
                    <button onClick={() => handleDelete(id)} className="icon-btn delete-icon-btn" title="Delete Question">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default ManageQuestionsByCategory;